// src/entities/User/model/userModel.ts

import create from 'zustand';
import { fetchHomeData } from '@/entities/User/api/userApi';
import api from '@/shared/api/axiosInstance';
import { rollDiceAPI } from '@/features/DiceEvent/api/rollDiceApi';

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

// 활동량 데이터 인터페이스
interface ActivityData {
  accountAge: number;
  activityLevel: number;
  telegramPremium: number;
  ogStatus: number;
}

// 사용자 상태 인터페이스
interface UserState {
  // 사용자 관련 상태들
  userId: string | null;
  setUserId: (userId: string | null) => void;

  starPoints: number;
  setStarPoints: (value: number | ((prev: number) => number)) => void;

  diceCount: number;
  setDiceCount: (value: number | ((prev: number) => number)) => void;

  lotteryCount: number;
  setLotteryCount: (value: number | ((prev: number) => number)) => void;

  position: number;
  setPosition: (value: number | ((prev: number) => number)) => void;

  userLv: number;
  setUserLv: (userLv: number) => void;

  characterType: 'dog' | 'cat';
  setCharacterType: (type: 'dog' | 'cat') => void;

  slToken: number;
  setSlToken: (value: number | ((prev: number) => number)) => void;

  rank: number;
  setRank: (rank: number) => void;

  monthlyPrize: MonthlyPrize;
  setMonthlyPrize: (monthlyPrize: MonthlyPrize) => void;

  weekAttendance: WeekAttendance;
  setWeekAttendance: (weekAttendance: WeekAttendance) => void;

  currentMiniGame: string;
  setCurrentMiniGame: (game: string) => void;

  activityData: ActivityData | null;
  setActivityData: (activityData: ActivityData | null) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  error: string | null;
  setError: (error: string | null) => void;

  // 인증 관련 함수들
  login: (initData: string) => Promise<void>;
  signup: (initData: string, petType: 'DOG' | 'CAT') => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;

  // 사용자 데이터 가져오기
  fetchUserData: () => Promise<void>;

  diceResult: number;
  rollDice: (gauge: number) => Promise<void>;

}

export const useUserStore = create<UserState>((set, get) => ({
  // 초기 상태 값 설정
  userId: null,
  setUserId: (userId) => set({ userId }),

  position: 0,
  setPosition: (value: number | ((prev: number) => number)) =>
    set((state) => ({
      position: typeof value === 'function' ? value(state.position) : value,
    })),
    
  starPoints: 0,
  setStarPoints: (value: number | ((prev: number) => number)) =>
    set((state) => ({
      starPoints: typeof value === 'function' ? value(state.starPoints) : value,
    })),

  diceCount: 0,
  setDiceCount: (value: number | ((prev: number) => number)) =>
    set((state) => ({
      diceCount: typeof value === 'function' ? value(state.diceCount) : value,
    })),

  lotteryCount: 0,
  setLotteryCount: (value: number | ((prev: number) => number)) =>
    set((state) => ({
      lotteryCount: typeof value === 'function' ? value(state.lotteryCount) : value,
    })),

  userLv: 1,
  setUserLv: (userLv) => set({ userLv }),

  characterType: 'cat',
  setCharacterType: (type) => set({ characterType: type }),

  slToken: 0,
  setSlToken: (value) =>
    set((state) => ({
      slToken: typeof value === "function" ? value(state.slToken) : value,
    })),

  rank: 0,
  setRank: (rank) => set({ rank }),

  monthlyPrize: {
    year: 0,
    month: 0,
    prizeType: '',
    amount: 0,
  },
  setMonthlyPrize: (monthlyPrize) => set({ monthlyPrize }),

  weekAttendance: {
    mon: null,
    tue: null,
    wed: null,
    thu: null,
    fri: null,
    sat: null,
    sun: null,
  },
  setWeekAttendance: (weekAttendance) => set({ weekAttendance }),

  currentMiniGame: '',
  setCurrentMiniGame: (game) => set({ currentMiniGame: game }),

  activityData: null,
  setActivityData: (activityData) => set({ activityData }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  error: null,
  setError: (error) => set({ error }),


  // 사용자 데이터 설정 함수
  fetchUserData: async () => {
    console.log('Step 4-1: fetchUserData 시작');
    set({ isLoading: true, error: null });
    try {
      const data = await fetchHomeData(); // userApi.ts의 fetchHomeData 사용
      if (!data) {
        throw new Error('No data returned from /home API');
      }
      console.log('Step 4-2: fetchUserData 성공, 데이터:', data);
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
        currentMiniGame: data.nowDice.currentMiniGame || '', // 설정
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Step 5: fetchUserData 실패:', error);
      set({ isLoading: false, error: error.message });
      throw error; // 에러를 다시 던져 호출한 쪽에서 인지할 수 있도록 함
    }
  },

  // 로그인 함수
  login: async (initData: string): Promise<void> => {
    console.log('Step: login 시작, initData:', initData);
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { initData });

      if (response.data.code === 'OK') {
        const { userId, accessToken, refreshToken } = response.data.data;
        console.log('Step: login 성공, userId:', userId);
        // 토큰 및 userId 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ userId });

        // 사용자 데이터 가져오기
        await get().fetchUserData();
        set({ isLoading: false, error: null });
      } else if (response.data.code === 'ENTITY_NOT_FOUND') {
        console.warn('Step: login 응답 코드 ENTITY_NOT_FOUND:', response.data.message);
        throw new Error(response.data.message || 'User not found');
      } else {
        console.warn('Step: login 응답 코드가 OK가 아님:', response.data.message);
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Step: login 실패:', error);
      let errorMessage = 'Login failed. Please try again.';
      if (error.response) {
        // 서버가 응답을 했지만, 상태 코드가 2xx가 아닌 경우
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // 요청이 이루어졌으나, 응답을 받지 못한 경우
        errorMessage = 'No response from server. Please try again later.';
      } else {
        // 다른 에러
        errorMessage = error.message;
      }
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage); // 에러를 다시 던져 호출한 쪽에서 인지할 수 있도록 함
    }
  },

  // 회원가입 함수
  signup: async (initData: string, petType: 'DOG' | 'CAT'): Promise<void> => {
    console.log('Step: signup 시작, initData:', initData, 'petType:', petType);
    set({ isLoading: true, error: null });
    try {
      // 회원가입 요청 보내기
      await api.post('/auth/signup', { initData, petType });

      // 활동량 데이터 하드코딩
      console.log('Step: signup 성공. 활동량 게이지 업데이트');
      set({ activityData: { accountAge: 30, activityLevel: 75, telegramPremium: 1, ogStatus: 1 } }); // 예시 하드코딩 값

      set({ isLoading: false, error: null });
    } catch (error: any) {
      console.error('Step: signup 실패:', error);
      let errorMessage = 'Signup failed. Please try again.';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'No response from server. Please try again later.';
      } else {
        errorMessage = error.message;
      }
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage); // 에러를 다시 던져 호출한 쪽에서 인지할 수 있도록 함
    }
  },

  // 로그아웃 함수
  logout: () => {
    console.log('Step: logout 실행. 토큰 및 userId 제거 및 상태 초기화.');
    localStorage.removeItem('accessToken');
    set({
      userId: null,
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
      activityData: null,
      isLoading: false,
      error: null,
    });
  },

  // 토큰 갱신 함수
  refreshToken: async (): Promise<boolean> => {
    console.log('Step: refreshToken 시작');
    try {
      const response = await api.get('/auth/refresh');
      console.log('Step: refreshToken 응답:', response);
  
      const newAccessToken = response.headers['authorization'];
      if (newAccessToken) {
        localStorage.setItem('accessToken', newAccessToken.replace('Bearer ', ''));
        console.log('Step: 새로운 accessToken 저장 완료');
        return true;
      } else {
        console.warn('Step: Authorization 헤더가 없습니다.');
        throw new Error('Token refresh failed: Authorization header is missing');
      }
    } catch (error: any) {
      console.error('Step: refreshToken 실패:', error);
      // Refresh 실패 시 로그아웃 처리
      get().logout();
      set({ error: 'Token refresh failed. Please log in again.' });
      return false;
    }
  },  

  diceResult: 0,
   rollDice: async (gauge: number) => {
    set({ isLoading: true, error: null });

    try {
      const data = await rollDiceAPI(gauge);

      set({
        rank: data.rank,
        starPoints: data.star,
        lotteryCount: data.ticket,
        diceCount: data.dice,
        slToken: data.slToken,
        diceResult: data.diceResult,
        position: data.tileSequence,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Roll dice failed' });
      throw error;
    }
  },
}));
