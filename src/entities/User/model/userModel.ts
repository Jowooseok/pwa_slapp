// src/entities/User/model/userModel.ts

import create from 'zustand';
import api from '@/shared/api/axiosInstance';

// 월간 보상 정보 인터페이스
interface MonthlyPrize {
  year: number;
  month: number;
  prizeType: string;
  amount: number;
}

// 주간 출석 정보 인터페이스
interface WeekAttendance {
  mon: boolean | null;
  tue: boolean | null;
  wed: boolean | null;
  thu: boolean | null;
  fri: boolean | null;
  sat: boolean | null;
  sun: boolean | null;
}

// 사용자 상태 인터페이스
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

  currentMiniGame: string;

  isLoading: boolean;
  error: string | null;

  // 인증 관련 함수들
  login: (initData: string) => Promise<void>;
  signup: (initData: string, petType: 'DOG' | 'CAT') => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;

  // 사용자 데이터 가져오기
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
  incrementStarPoints: (amount) => set({ starPoints: get().starPoints + amount }),

  lotteryCount: 0,
  setLotteryCount: (lotteryCount) => set({ lotteryCount }),
  incrementLotteryCount: (amount) => set({ lotteryCount: get().lotteryCount + amount }),

  userLv: 1,
  characterType: 'cat',

  slToken: 0,
  rank: 0,

  monthlyPrize: {
    year: 0,
    month: 0,
    prizeType: '',
    amount: 0,
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

  currentMiniGame: '',

  isLoading: false,
  error: null,

  // 사용자 데이터 설정 함수
  fetchUserData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/home');
      const data = response.data.data;

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
        currentMiniGame: data.nowDice.currentMiniGame, // 설정
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Failed to fetch user data:', error);
      set({ isLoading: false, error: error.message });
    }
  },

  // 로그인 함수
  login: async (initData: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { initData });

      if (response.data.code === 'OK') {
        const { accessToken, refreshToken } = response.data.data;
        // 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // 사용자 데이터 가져오기
        await get().fetchUserData();
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
      set({ isLoading: false, error: null });
    } catch (error: any) {
      console.error('Login failed:', error);
      set({ isLoading: false, error: error.message });
    }
  },

  // 회원가입 함수
  signup: async (initData: string, petType: 'DOG' | 'CAT') => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/signup', { initData, petType });

      if (response.data.code === 'OK') {
        // 회원가입 성공 후 로그인 진행
        await get().login(initData);
      } else {
        throw new Error(response.data.message || 'Signup failed');
      }
      set({ isLoading: false, error: null });
    } catch (error: any) {
      console.error('Signup failed:', error);
      set({ isLoading: false, error: error.message });
    }
  },

  // 로그아웃 함수
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({
      position: 0,
      diceCount: 0,
      starPoints: 0,
      lotteryCount: 0,
      userLv: 1,
      characterType: 'cat',
      slToken: 0,
      rank: 0,
      monthlyPrize: {
        year: 0,
        month: 0,
        prizeType: '',
        amount: 0,
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
      currentMiniGame: '',
      isLoading: false,
      error: null,
    });
  },

  // 토큰 갱신 함수
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh', { refreshToken });

      if (response.data.code === 'OK') {
        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        return true;
      } else {
        throw new Error(response.data.message || 'Token refresh failed');
      }
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      // Refresh 실패 시 로그아웃 처리
      get().logout();
      set({ error: error.message });
      return false;
    }
  },
}));
