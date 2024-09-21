// src/shared/api/axiosInstance.ts

import axios from 'axios';
import { useUserStore } from '@/entities/User/model/userModel';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 요청 인터셉터: 모든 요청에 Authorization 헤더 추가
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 에러 시 토큰 갱신 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이며, 토큰 갱신 시도하지 않은 경우
    if (
      error.response?.status === 401 &&
      error.response.data.message === 'JWT Token has expired' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const { refreshToken } = useUserStore.getState();

      try {
        const success = await useUserStore.getState().refreshToken();
        if (success) {
          // 새로운 accessToken은 요청 인터셉터에 의해 자동으로 추가됨
          return api(originalRequest);
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
