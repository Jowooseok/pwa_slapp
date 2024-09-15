import create from "zustand";

interface RPSGameState {
  betAmount: number;
  currentRound: number;
  totalRounds: number;
  isSpinning: boolean;
  slotResults: string[];
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
  stopSpin: (result: string) => void;
  checkResult: () => void;
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

  stopSpin: (result: string) =>
    set((state) => ({
      isSpinning: false,
      slotResults: [...state.slotResults, result], // 결과를 동적으로 반영
    })),

  checkResult: () => {
    const { currentRound, totalRounds, consecutiveWins, slotResults } = get();

    // 가위바위보 승패 계산
    const playerChoice = slotResults[currentRound - 1];
    const computerChoice = ["rock", "paper", "scissors"][
      Math.floor(Math.random() * 3)
    ]; // 컴퓨터의 선택을 랜덤으로 설정

    let gameResult: "win" | "lose" = "lose";
    if (
      (playerChoice === "rock" && computerChoice === "scissors") ||
      (playerChoice === "scissors" && computerChoice === "paper") ||
      (playerChoice === "paper" && computerChoice === "rock")
    ) {
      gameResult = "win";
    }

    // 결과 업데이트
    set((state) => ({
      winMultiplier:
        gameResult === "win" ? state.winMultiplier * 2 : state.winMultiplier,
      userPoints:
        gameResult === "win"
          ? state.userPoints + state.betAmount * state.winMultiplier
          : state.userPoints,
      gameResult: gameResult,
      isDialogOpen: true,
      currentRound:
        state.currentRound < totalRounds
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
