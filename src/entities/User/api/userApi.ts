// src/entities/user/api/userApi.ts
import api from '@/shared/api/axiosInstance';

export const fetchHomeData = async () => {
  try {
    const response = await api.post('/home');
    console.log('fetchHomeData response:', response); // 디버깅을 위한 로그 추가
    console.log('fetchHomeData response.data:', response.data); // 추가 로그
    return response.data.data;
  } catch (error: any) {
    console.error('fetchHomeData 에러:', error);
    throw error;
  }
};
