import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useLoginMutation,
  useRefreshTokenMutation,
} from "@/features/auth/api/login"; // 파일명 수정 반영

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  const loginMutation = useLoginMutation();
  const refreshTokenMutation = useRefreshTokenMutation();

  // 페이지 로드 시 URL에서 해시값 추출 및 로그인 시도
  useEffect(() => {
    const hash = new URLSearchParams(window.location.search).get("hash");
    const accessToken = localStorage.getItem("accessToken");

    if (hash) {
      setUserId(hash);

      if (accessToken) {
        // 엑세스 토큰이 있으면 바로 dice-event 페이지로 이동
        navigate("/dice-event");
      } else {
        // 토큰이 없으면 로그인 시도
        handleLogin(hash);
      }
    }
  }, []);

  // 로그인 처리 함수
  const handleLogin = (userId: string) => {
    loginMutation.mutate(
      { userId },
      {
        onSuccess: async (data) => {
          const resolvedData = await data; // 데이터가 Promise인 경우 처리
          // 성공 시 토큰을 로컬 스토리지에 저장
          localStorage.setItem("accessToken", resolvedData.data.accessToken);
          localStorage.setItem("refreshToken", resolvedData.data.refreshToken);
          // 로그인 성공 후 바로 dice-event 페이지로 이동
          navigate("/dice-event");
        },
        onError: () => {
          // 실패 시 회원가입 페이지로 이동
          navigate(`/sign-up?hash=${userId}`);
        },
      }
    );
  };

  // 토큰 만료 시 액세스 토큰 재발급
  const handleTokenRefresh = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      refreshTokenMutation.mutate(
        { refreshToken },
        {
          onSuccess: async (data) => {
            const resolvedData = await data;
            localStorage.setItem("accessToken", resolvedData.data.accessToken);
            navigate("/dice-event"); // 새 토큰으로 데이터 요청 후 dice-event로 이동
          },
          onError: () => {
            console.error("토큰 재발급 실패");
            navigate("/login");
          },
        }
      );
    }
  };

  return (
    <div>
      <h1>Welcome to the Main Page</h1>
      {loginMutation.isPending && <p>Logging in...</p>}
      {loginMutation.isError && <p>Login failed. Redirecting to Sign Up...</p>}
      {!userId && <p>Loading user data...</p>}
    </div>
  );
};

export default MainPage;
