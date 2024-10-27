// src/shared/api/axiosInstance.ts

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

// 요청 인터셉터 설정 (필요 시)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정 (필요 시)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshSuccessful = await useUserStore.getState().refreshToken();
      if (refreshSuccessful) {
        const newAccessToken = localStorage.getItem('accessToken');
        if (newAccessToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
