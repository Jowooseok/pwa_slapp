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

  activityData: ActivityData | null;

  isLoading: boolean;
  error: string | null;

  // 인증 관련 함수들
  login: (initData: string) => Promise<void>;
  signup: (initData: string, petType: 'DOG' | 'CAT') => Promise<ActivityData>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;

  // 사용자 데이터 가져오기
  fetchUserData: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  // 초기 상태 값 설정
  userId: null,
  setUserId: (userId) => set({ userId }),

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

  activityData: null,

  isLoading: false,
  error: null,

  // 사용자 데이터 설정 함수
  fetchUserData: async () => {
    console.log('userModel: fetchUserData 시작');
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/home');
      const data = response.data.data;
      console.log('userModel: fetchUserData 성공, 데이터:', data);

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
      console.error('userModel: fetchUserData 실패:', error);
      set({ isLoading: false, error: error.message });
      throw error; // 에러를 다시 던져 호출한 쪽에서 인지할 수 있도록 함
    }
  },

  // 로그인 함수
  login: async (initData: string): Promise<void> => {
    console.log('userModel: login 시작, initData:', initData);
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { initData });

      if (response.data.code === 'OK') {
        const { userId, accessToken, refreshToken } = response.data.data;
        console.log('userModel: login 성공, userId:', userId, 'accessToken:', accessToken, 'refreshToken:', refreshToken);
        // 토큰 및 userId 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ userId });

        // 사용자 데이터 가져오기
        await get().fetchUserData();
      } else if (response.data.code === 'ENTITY_NOT_FOUND') {
        console.warn('userModel: login 응답 코드 ENTITY_NOT_FOUND:', response.data.message);
        throw new Error(response.data.message || 'User not found');
      } else {
        console.warn('userModel: login 응답 코드가 OK가 아님:', response.data.message);
        throw new Error(response.data.message || 'Login failed');
      }
      set({ isLoading: false, error: null });
    } catch (error: any) {
      console.error('userModel: login 실패:', error);
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
  signup: async (initData: string, petType: 'DOG' | 'CAT'): Promise<ActivityData> => {
    console.log('userModel: signup 시작, initData:', initData, 'petType:', petType);
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/signup', { initData, petType });

      if (response.data.code === 'OK') {
        console.log('userModel: signup 성공. 로그인 시도.');
        // 서버로부터 활동량 데이터 받기
        const { userId, accessToken, refreshToken, activityScores } = response.data.data;
        console.log('userModel: 받은 activityScores:', activityScores);

        // 토큰 및 userId 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ userId });

        // activityData 상태 설정
        set({ activityData: activityScores });

        // 회원가입 성공 후 로그인 진행 (이미 토큰을 저장했으므로 fetchUserData만 호출)
        await get().fetchUserData();

        // activityData 반환
        return activityScores;
      } else {
        console.warn('userModel: signup 응답 코드가 OK가 아님:', response.data.message);
        throw new Error(response.data.message || 'Signup failed');
      }
    } catch (error: any) {
      console.error('userModel: signup 실패:', error);
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
    console.log('userModel: logout 실행. 토큰 및 userId 제거 및 상태 초기화.');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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
    console.log('userModel: refreshToken 시작');
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      console.log('userModel: 현재 refreshToken:', refreshToken);
      if (!refreshToken) {
        console.warn('userModel: refreshToken이 없습니다.');
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh', { refreshToken });
      console.log('userModel: refreshToken 응답:', response.data);

      if (response.data.code === 'OK') {
        const { accessToken } = response.data.data;
        console.log('userModel: 새로운 accessToken:', accessToken);
        localStorage.setItem('accessToken', accessToken);
        return true;
      } else {
        console.warn('userModel: refreshToken 응답 코드가 OK가 아님:', response.data.message);
        throw new Error(response.data.message || 'Token refresh failed');
      }
    } catch (error: any) {
      console.error('userModel: refreshToken 실패:', error);
      // Refresh 실패 시 로그아웃 처리
      get().logout();
      let errorMessage = 'Token refresh failed. Please log in again.';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'No response from server. Please try again later.';
      } else {
        errorMessage = error.message;
      }
      set({ error: errorMessage });
      return false;
    }
  },
}));
