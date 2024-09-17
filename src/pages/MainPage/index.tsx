import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useLoginMutation,
  useRefreshTokenMutation,
} from "@/features/auth/api/login";
import { useDiceEventDataQuery } from "@/features/DiceEvent/api/diceEvent";

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0); // 재시도 횟수 제한

  const loginMutation = useLoginMutation();
  const refreshTokenMutation = useRefreshTokenMutation();
  const { data, refetch } = useDiceEventDataQuery();

  // 최대 재시도 횟수 설정
  const MAX_RETRY = 3;

  // 1. 페이지 로드 시 URL에서 해시값 추출
  useEffect(() => {
    console.log("1. Extracting hash from URL");
    const hash = new URLSearchParams(window.location.search).get("hash");
    const accessToken = localStorage.getItem("accessToken");

    console.log("Hash from URL:", hash);
    console.log("Access Token from localStorage:", accessToken);

    if (hash && !userId) {
      // userId가 설정되지 않은 경우에만 실행
      setUserId(hash);

      console.log("2. Checking for access token in localStorage");
      if (accessToken) {
        fetchDataWithToken(accessToken, hash);
      } else {
        handleLogin(hash);
      }
    }
  }, [userId]); // userId가 변경될 때만 실행

  // 3. 엑세스 토큰을 사용해 데이터를 요청하는 함수
  const fetchDataWithToken = (accessToken: string, hash: string) => {
    console.log("3. Fetching data with access token:", accessToken);

    refetch().then((result) => {
      console.log("Data fetch result:", result); // 3번 로그

      if (result.isError) {
        console.error("3. Data fetch failed, attempting token refresh");

        if (retryCount < MAX_RETRY) {
          setRetryCount(retryCount + 1);
          handleTokenRefresh(hash); // 토큰 재발급 시에도 해시값 전달
        } else {
          console.error("Max retry attempts reached. Stopping retries.");
        }
      } else {
        console.log("3. Data fetch succeeded, navigating to dice-event");
        navigate(`/dice-event?hash=${hash}`); // 해시값을 URL에 전달
      }
    });
  };

  // 4. 로그인 처리 함수
  // 로그인 성공 시 토큰 저장 부분 수정
  const handleLogin = (userId: string) => {
    loginMutation.mutate(
      { userId },
      {
        onSuccess: (data) => {
          console.log("Login successful, setting new tokens:", data); // 성공 로그 확인
          const accessToken = data.data.accessToken; // 여기서 accessToken을 올바르게 가져오는지 확인
          const refreshToken = data.data.refreshToken;

          if (accessToken && refreshToken) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            console.log("Saved Access Token:", accessToken);
            console.log("Saved Refresh Token:", refreshToken);

            fetchDataWithToken(accessToken, userId);
          } else {
            console.error(
              "Failed to save tokens, access or refresh token missing"
            );
          }
        },
        onError: () => {
          navigate(`/sign-up?hash=${userId}`);
        },
      }
    );
  };

  // 5. 토큰 만료 시 액세스 토큰 재발급 및 로그인 재시도
  const handleTokenRefresh = (hash: string) => {
    console.log("5. Attempting token refresh");
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      refreshTokenMutation.mutate(
        { refreshToken },
        {
          onSuccess: (data) => {
            console.log("5. Token refresh success:", data);
            localStorage.setItem("accessToken", data.accessToken);

            const savedAccessToken = localStorage.getItem("accessToken");
            console.log("Saved Access Token after refresh:", savedAccessToken);

            if (savedAccessToken) {
              fetchDataWithToken(savedAccessToken, hash);
            } else {
              console.error("Failed to save access token after refresh.");
            }
          },
          onError: (error) => {
            console.error("5. Token refresh failed:", error);
            console.log("5. Attempting login after token refresh failure");
            handleLogin(hash); // 로그인 함수 호출
          },
        }
      );
    } else {
      console.error("5. No refresh token found in localStorage");
      handleLogin(hash); // 리프레시 토큰이 없으면 로그인
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
