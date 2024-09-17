import create from "zustand";

// Zustand store to manage dice event state
interface DiceEventStore {
  position: number;
  diceCount: number;
  starPoints: number;
  lotteryCount: number;
  setPosition: (position: number) => void;
  setDiceCount: (diceCount: number) => void;
  setStarPoints: (starPoints: number) => void;
  setLotteryCount: (lotteryCount: number) => void;
}

export const useDiceEventStore = create<DiceEventStore>((set) => ({
  position: 0,
  diceCount: 0,
  starPoints: 0,
  lotteryCount: 0,
  setPosition: (position) => set({ position }),
  setDiceCount: (diceCount) => set({ diceCount }),
  setStarPoints: (starPoints) => set({ starPoints }),
  setLotteryCount: (lotteryCount) => set({ lotteryCount }),
}));
