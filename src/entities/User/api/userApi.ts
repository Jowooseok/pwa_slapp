// src/entities/user/api/userApi.ts
import api from '@/shared/api/axiosInstance';

export const fetchHomeData = async () => {
  try {
    const response = await api.get('/home');
    console.log('fetchHomeData response:', response); // 디버깅을 위한 로그 추가
    return response.data.data;
  } catch (error: any) {
    console.error('fetchHomeData 에러:', error);
    throw error;
  }
};


// export const fetchHomeData = async () => {
//   // Return mock data instead of making an API call
//   return Promise.resolve({
//     nowDice: {
//       tileSequence: 0, // Starting position on the game board
//       dice: 5, // Number of dice available
//       currentMiniGame: null, // No mini-game active
//     },
//     rank: {
//       star: 100, // Star points
//       ticket: 2, // Lottery tickets
//       slToken: 50, // SL tokens
//       rank: 1, // User rank
//     },
//     pet: {
//       level: 5, // User level
//       type: 'CAT', // Pet type: 'CAT' or 'DOG'
//     },
//     monthlyPrize: {
//       year: 2023,
//       month: 10,
//       prizeType: 'gold', // Prize type
//       amount: 1000, // Prize amount
//     },
//     weekAttendance: {
//       mon: true,
//       tue: false,
//       wed: null,
//       thu: null,
//       fri: null,
//       sat: null,
//       sun: null,
//     },
//   });
// };