// src/entities/user/model/userModel.ts

import create from 'zustand';

interface MonthlyPrize {
  year: number;
  month: number;
  prizeType: string;
  amount: number;
}

interface WeekAttendance {
  mon: boolean | null;
  tue: boolean | null;
  wed: boolean | null;
  thu: boolean | null;
  fri: boolean | null;
  sat: boolean | null;
  sun: boolean | null;
}

interface UserState {
  // 사용자 관련 상태들
  position: number;
  setPosition: (position: number) => void;

  diceCount: number;
  setDiceCount: (diceCount: number) => void;
  incrementDiceCount: (amount: number) => void;

  starPoints: number;
  setStarPoints: (starPoints: number) => void;
  incrementStarPoints: (amount: number) => void;

  lotteryCount: number;
  setLotteryCount: (lotteryCount: number) => void;
  incrementLotteryCount: (amount: number) => void;

  userLv: number;
  characterType: 'dog' | 'cat';

  slToken: number;
  rank: number;

  monthlyPrize: MonthlyPrize;

  weekAttendance: WeekAttendance;

  isLoading: boolean;
  error: string | null;

  fetchUserData: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  // 초기 상태 값 설정
  position: 0,
  setPosition: (position) => set({ position }),

  diceCount: 0,
  setDiceCount: (diceCount) => set({ diceCount }),
  incrementDiceCount: (amount) => set({ diceCount: get().diceCount + amount }),

  starPoints: 0,
  setStarPoints: (starPoints) => set({ starPoints }),
  incrementStarPoints: (amount) =>
    set({ starPoints: get().starPoints + amount }),

  lotteryCount: 0,
  setLotteryCount: (lotteryCount) => set({ lotteryCount }),
  incrementLotteryCount: (amount) =>
    set({ lotteryCount: get().lotteryCount + amount }),

  userLv: 1,
  characterType: 'cat',

  slToken: 0,
  rank: 0,

  monthlyPrize: {
    year: 2024,
    month: 9,
    prizeType: 'SL Token',
    amount: 1000,
  },

  weekAttendance: {
    mon: null,
    tue: null,
    wed: null,
    thu: null,
    fri: null,
    sat: null,
    sun: null,
  },

  isLoading: false,
  error: null,

  fetchUserData: async () => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch('/home', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const data = result.data;

      set({
        position: data.nowDice.tileSequence,
        diceCount: data.nowDice.dice,
        starPoints: data.rank.star,
        lotteryCount: data.rank.ticket,
        userLv: data.pet.level,
        characterType: data.pet.type.toLowerCase() as 'dog' | 'cat',
        slToken: data.rank.slToken,
        rank: data.rank.rank,
        monthlyPrize: {
          year: data.monthlyPrize.year,
          month: data.monthlyPrize.month,
          prizeType: data.monthlyPrize.prizeType,
          amount: data.monthlyPrize.amount,
        },
        weekAttendance: {
          mon: data.weekAttendance.mon,
          tue: data.weekAttendance.tue,
          wed: data.weekAttendance.wed,
          thu: data.weekAttendance.thu,
          fri: data.weekAttendance.fri,
          sat: data.weekAttendance.sat,
          sun: data.weekAttendance.sun,
        },
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Failed to fetch user data:', error);
      set({ isLoading: false, error: error.message });
    }
  },
}));
