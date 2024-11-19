//src\pages\RPSGame\store\index.tsx

import create from "zustand";

interface RPSGameState {
  betAmount: number;
  currentRound: number;
  totalRounds: number;
  isSpinning: boolean;
  slotResults: { userChoice: string; computerChoice: string }[]; // 타입 수정
  winMultiplier: number;
  isGameStarted: boolean;
  isDialogOpen: boolean;
  gameResult: "win" | "lose" | null;
  userPoints: number;
  consecutiveWins: number;

  setBetAmount: (amount: number) => void;
  setUserPoints: (points: number) => void;
  startGame: () => void;
  spin: () => void;
  stopSpin: (userChoice: string, computerChoice: string) => void;
  checkResult: (userChoice: string, computerChoice: string) => void;
  continueGame: () => void;
  endGame: () => void;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useRPSGameStore = create<RPSGameState>((set, get) => ({
  betAmount: 0,
  currentRound: 1,
  totalRounds: 3,
  isSpinning: false,
  slotResults: [],
  winMultiplier: 1,
  isGameStarted: false,
  isDialogOpen: false,
  gameResult: null,
  userPoints: 10000,
  consecutiveWins: 0,

  setBetAmount: (amount: number) => set({ betAmount: amount }),
  setUserPoints: (points: number) => set({ userPoints: points }),

  startGame: () => {
    console.log("Starting game"); // 콘솔로 확인
    set((state) => ({
      isGameStarted: true,
      currentRound: 1,
      slotResults: [],
      winMultiplier: 1,
      consecutiveWins: 0,
    }));
  },

  spin: () => set({ isSpinning: true }),

  // stopSpin 함수 수정: 두 개의 인자를 받도록 원래대로 수정
  stopSpin: (userChoice: string, computerChoice: string) =>
    set((state) => ({
      isSpinning: false,
      slotResults: [
        ...state.slotResults,
        { userChoice, computerChoice }, // 객체로 저장
      ],
    })),

  checkResult: (userChoice: string, computerChoice: string) => {
    let gameResult: "win" | "lose" = "lose";
    if (
      (userChoice === "rock" && computerChoice === "scissors") ||
      (userChoice === "scissors" && computerChoice === "paper") ||
      (userChoice === "paper" && computerChoice === "rock")
    ) {
      gameResult = "win";
    }

    // 결과 업데이트
    set((state) => ({
      winMultiplier:
        gameResult === "win" ? state.winMultiplier * 3 : state.winMultiplier,
      userPoints:
        gameResult === "win"
          ? state.userPoints + state.betAmount * state.winMultiplier
          : state.userPoints,
      gameResult,
      isDialogOpen: true,
      currentRound:
        state.currentRound < state.totalRounds
          ? state.currentRound + 1
          : state.currentRound,
      consecutiveWins:
        gameResult === "win"
          ? state.consecutiveWins + 1
          : state.consecutiveWins,
    }));
  },

  continueGame: () =>
    set((state) => ({
      isDialogOpen: false,
      gameResult: null,
    })),

  endGame: () =>
    set({
      isGameStarted: false,
      betAmount: 0,
      currentRound: 1,
      slotResults: [],
      winMultiplier: 1,
      gameResult: null,
      isDialogOpen: false,
      consecutiveWins: 0,
    }),

  openDialog: () => set({ isDialogOpen: true }),

  closeDialog: () => set({ isDialogOpen: false }),
}));
