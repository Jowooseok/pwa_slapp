// Custom Hook using useMutation from react-query
import { useMutation, useQuery } from "@tanstack/react-query";

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
  return useMutation<ReturnType<typeof login>, Error, LoginData>({
    mutationFn: login,
  });
};

// 토큰 재발급 훅
export const useRefreshTokenMutation = () => {
  return useMutation<
    ReturnType<typeof refreshAccessToken>,
    Error,
    RefreshTokenData
  >({
    mutationFn: refreshAccessToken,
  });
};

// /home API를 호출하는 함수
const fetchHomeData = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("No access token found");
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/home`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch home data");
  }

  return response.json();
};

// 홈 데이터를 가져오는 커스텀 훅
export const useHomeDataQuery = () => {
  return useQuery({
    queryKey: ["homeData"],
    queryFn: fetchHomeData,
    retry: false, // 실패 시 자동 재시도를 하지 않도록 설정
    staleTime: 60000, // 1분 동안 데이터가 최신으로 간주됨
  });
};
