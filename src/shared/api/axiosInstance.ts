import axios from 'axios';
import { useUserStore } from '@/entities/User/model/userModel';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://bfde-61-81-223-147.ngrok-free.app', // Vite 환경 변수 사용
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
  withCredentials: true,
});

// 환경 변수 값 확인을 위한 콘솔 로그 추가
console.log('🔍 [Axios] VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

// 요청 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    // 리프레시 토큰 요청인지 확인
    if (!config.url?.includes('/auth/refresh') && token) {
      // 리프레시 토큰 요청이 아닌 경우에만 Authorization 헤더 추가
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 처리 및 리프레시 토큰 재시도 로직
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 리프레시 토큰을 통해 액세스 토큰 재발급 시도
      const refreshSuccessful = await useUserStore.getState().refreshToken();

      if (refreshSuccessful) {
        const newAccessToken = localStorage.getItem('accessToken');
        if (newAccessToken) {
          // 갱신된 액세스 토큰을 요청 헤더에 추가하여 원래 요청을 재시도
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
