// src/pages/RPSGame/store/index.tsx

import create from "zustand";
import api from "@/shared/api/axiosInstance";
import { useUserStore } from "@/entities/User/model/userModel";

interface SlotResult {
  userChoice: string;
  computerChoice: string;
}

interface PlayRoundResponse {
  computerChoice: string;
  result: "win" | "lose";
  reward: number;
}

interface RPSGameState {
  betAmount: number;
  allowedBetting: number;
  currentRound: number;
  totalRounds: number;
  isSpinning: boolean;
  slotResults: SlotResult[];
  isGameStarted: boolean;
  isDialogOpen: boolean;
  gameResult: "win" | "lose" | null;
  consecutiveWins: number;
  lastReward: number;
  winMultiplier: number;

  setBetAmount: (amount: number) => void;
  setAllowedBetting: (amount: number) => void;
  startGame: () => void;
  spin: () => void;
  stopSpin: (userChoice: string, computerChoice: string) => void;
  continueGame: () => void;
  endGame: () => void;
  openDialog: () => void;
  closeDialog: () => void;
  fetchAllowedBetting: () => Promise<void>;
  playRound: (userChoice: string) => Promise<PlayRoundResponse | null>;
}

export const useRPSGameStore = create<RPSGameState>((set, get) => ({
  betAmount: 0,
  allowedBetting: 0,
  currentRound: 1,
  totalRounds: 3,
  isSpinning: false,
  slotResults: [],
  isGameStarted: false,
  isDialogOpen: false,
  gameResult: null,
  consecutiveWins: 0,
  lastReward: 0,
  winMultiplier: 1,

  setBetAmount: (amount: number) => set({ betAmount: amount }),
  setAllowedBetting: (amount: number) => set({ allowedBetting: amount }),

  startGame: () => {
    console.log("Starting game");
    set({
      isGameStarted: true,
      currentRound: 1,
      slotResults: [],
      consecutiveWins: 0,
      gameResult: null,
      lastReward: 0,
      winMultiplier: 1,
    });
  },

  spin: () => set({ isSpinning: true }),

  stopSpin: (userChoice: string, computerChoice: string) =>
    set((state) => ({
      isSpinning: false,
      slotResults: [...state.slotResults, { userChoice, computerChoice }],
    })),

  continueGame: () =>
    set((state) => ({
      isDialogOpen: false,
      gameResult: null,
      lastReward: 0,
      // 'consecutiveWins'와 'winMultiplier'는 playRound에서 관리
    })),

  endGame: () =>
    set({
      isGameStarted: false,
      betAmount: 0,
      currentRound: 1,
      slotResults: [],
      gameResult: null,
      isDialogOpen: false,
      consecutiveWins: 0,
      lastReward: 0,
      winMultiplier: 1,
    }),

  openDialog: () => set({ isDialogOpen: true }),

  closeDialog: () => set({ isDialogOpen: false }),

  // 베팅 가능 금액 및 현재 포인트 조회
  fetchAllowedBetting: async () => {
    try {
      console.log("Fetching allowed betting");
      const response = await api.get("/rps/star");
      console.log("Allowed betting response:", response);
      if (response.data.code === "OK") {
        const { starCount, allowedBetting } = response.data.data;
        set({ allowedBetting });
        useUserStore.getState().setStarPoints(starCount);
      } else {
        console.error("Error fetching allowed betting:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching allowed betting:", error);
    }
  },

  // 가위바위보 게임 진행
  playRound: async (userChoice: string): Promise<PlayRoundResponse | null> => {
    const bettingAmount = get().betAmount;
    console.log("Playing round with userChoice:", userChoice, "betAmount:", bettingAmount);
    try {
      const response = await api.post("/play-rps", {
        bettingAmount: bettingAmount,
        value: userChoice === "rock" ? 1 : userChoice === "paper" ? 2 : 0,
      });
      console.log("playRound response:", response);

      if (response.data.code === "OK") {
        const { reward, result, pcValue } = response.data.data;
        const computerChoice =
          pcValue === 0 ? "scissors" : pcValue === 1 ? "rock" : "paper";

        let winnings = 0;
        let newConsecutiveWins = get().consecutiveWins;
        let newWinMultiplier = get().winMultiplier;

        if (result === "WIN") {
          newConsecutiveWins += 1;
          newWinMultiplier = Math.pow(3, newConsecutiveWins);
          winnings = bettingAmount * newWinMultiplier;
          // Update user points
          useUserStore.getState().setStarPoints(
            useUserStore.getState().starPoints + winnings
          );

          console.log(`Round ${get().currentRound}: WIN! Winnings: +${winnings}`);

          // Check if max rounds reached
          if (newConsecutiveWins >= get().totalRounds) {
            // Max rounds reached, finish the game
            set({
              slotResults: [...get().slotResults, { userChoice, computerChoice }],
              gameResult: "win",
              isDialogOpen: true,
              consecutiveWins: newConsecutiveWins,
              lastReward: winnings,
              winMultiplier: newWinMultiplier,
              // currentRound remains same or set to totalRounds
            });
            console.log("Max rounds reached. Game finished.");
          } else {
            // Continue to next round
            set({
              slotResults: [...get().slotResults, { userChoice, computerChoice }],
              gameResult: "win",
              isDialogOpen: true,
              consecutiveWins: newConsecutiveWins,
              lastReward: winnings,
              winMultiplier: newWinMultiplier,
              currentRound: get().currentRound + 1,
            });
            console.log(`Proceeding to round ${get().currentRound + 1}`);
          }
        } else {
          // Lose
          newConsecutiveWins = 0;
          newWinMultiplier = 1;
          winnings = -bettingAmount;
          // Update user points
          useUserStore.getState().setStarPoints(
            useUserStore.getState().starPoints + winnings
          );

          set({
            slotResults: [...get().slotResults, { userChoice, computerChoice }],
            gameResult: "lose",
            isDialogOpen: true,
            consecutiveWins: newConsecutiveWins,
            lastReward: winnings,
            winMultiplier: newWinMultiplier,
          });
          console.log(`Round ${get().currentRound}: LOSE! Winnings: ${winnings}`);
        }

        console.log("Round result:", result, "computerChoice:", computerChoice, "winnings:", winnings);

        return {
          computerChoice,
          result: result === "WIN" ? "win" : "lose",
          reward: winnings,
        };
      } else {
        console.error("Error playing RPS:", response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error playing RPS:", error);
      return null;
    }
  },
}));
