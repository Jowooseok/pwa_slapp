import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useLoginMutation,
  useRefreshTokenMutation,
  useHomeDataQuery,
} from "@/features/auth/api/auth";

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  const loginMutation = useLoginMutation();
  const refreshTokenMutation = useRefreshTokenMutation();
  const {
    data: homeData,
    error: homeDataError,
    refetch: fetchHomeData,
  } = useHomeDataQuery();

  // 페이지 로드 시 URL에서 해시값 추출 및 로그인 시도
  useEffect(() => {
    const hash = new URLSearchParams(window.location.search).get("hash");
    const accessToken = localStorage.getItem("accessToken");

    if (hash) {
      setUserId(hash);

      if (accessToken) {
        console.log("Access Token exists, fetching user data...");
        fetchHomeData();
      } else {
        console.log("No Access Token, attempting login...");
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
          console.log("Login successful, storing tokens...");
          // 성공 시 토큰을 로컬 스토리지에 저장
          localStorage.setItem("accessToken", resolvedData.data.accessToken);
          localStorage.setItem("refreshToken", resolvedData.data.refreshToken);
          fetchHomeData(); // 로그인 성공 후 사용자 데이터를 요청
        },
        onError: () => {
          console.log("Login failed, redirecting to sign-up...");
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
            console.log(
              "Token refresh successful, storing new access token..."
            );
            localStorage.setItem("accessToken", resolvedData.data.accessToken);
            fetchHomeData(); // 새 토큰으로 데이터 재요청
          },
          onError: () => {
            console.error("Token refresh failed, redirecting to login...");
            navigate("/login");
          },
        }
      );
    }
  };

  // 서버에서 받아온 사용자 데이터를 보여줌
  useEffect(() => {
    if (homeData) {
      console.log("Home data loaded successfully:", homeData);
      // 데이터가 성공적으로 로드되면 dice-event 페이지로 이동
      navigate("/dice-event");
    }
  }, [homeData, navigate]);

  return (
    <div>
      <h1>Welcome to the Main Page</h1>
      {loginMutation.isPending && <p>Logging in...</p>}
      {loginMutation.isError && <p>Login failed. Redirecting to Sign Up...</p>}
      {homeDataError && <p>Error fetching user data.</p>}

      {/* 데이터가 로드된 후에만 dice 정보를 렌더링 */}
      {homeData ? (
        <div>
          <h2>User Info:</h2>
          <p>
            Current Dice: {homeData.nowDice?.dice || "Loading dice data..."}
          </p>
          <p>Rank: {homeData.rank?.rank || "Loading rank data..."}</p>
          {/* 추가적으로 다른 데이터 렌더링 */}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default MainPage;
