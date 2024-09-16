// auth.ts
import { useMutation } from "@tanstack/react-query";

interface LoginData {
  userId: string;
}

interface RefreshTokenData {
  refreshToken: string;
}

// 로그인 API 호출 함수
const login = async (data: LoginData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  return response.json();
};

// 액세스 토큰 재발급 API 호출 함수
const refreshAccessToken = async (data: RefreshTokenData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return response.json();
};

// 로그인 훅
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login,
  });
};

// 토큰 재발급 훅
export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationFn: refreshAccessToken,
  });
};
