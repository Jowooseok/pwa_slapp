// src/pages/MainPage/index.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useHistory 대신 useNavigate 사용
import { useUserStore } from '@/entities/User/model/userModel';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    login,
    fetchUserData,
    isLoading,
    error,
    userLv,
    characterType,
    rank,
    monthlyPrize,
    currentMiniGame, // UserState에 추가된 속성
    weekAttendance,
  } = useUserStore();

  useEffect(() => {
    const checkAuthentication = async () => {
      const telegram = window.Telegram?.WebApp;
      const initData = telegram?.initData || '';

      // 2-1. 로컬 스토리지에서 토큰 확인
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        // 3-1. 토큰에서 telegram_user_id 추출 (JWT 디코딩 필요)
        const decodedToken = parseJwt(accessToken);
        const tokenTelegramUserId = decodedToken?.sub; // 'sub' 필드에 telegram_user_id가 저장되어 있다고 가정

        // 3-2. 현재 텔레그램 사용자 ID 얻기
        const currentTelegramUserId = telegram?.initDataUnsafe?.user?.id;

        // 3-3. ID 비교
        if (
          tokenTelegramUserId &&
          currentTelegramUserId &&
          tokenTelegramUserId.toString() === currentTelegramUserId.toString()
        ) {
          // 4-1. 토큰 서버 검증
          try {
            await fetchUserData();
            // 4-2-1. 토큰 유효: 필요한 페이지로 이동
            navigate('/dice-event');
          } catch (err) {
            console.error('Token validation failed:', err);
            // 4-2-3. 토큰 무효: 토큰 삭제하고 5단계로 진행
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            authenticateWithInitData(initData);
          }
        } else {
          // ID 불일치: 토큰 삭제하고 5단계로 진행
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          authenticateWithInitData(initData);
        }
      } else {
        // 토큰 없음: 5단계로 진행
        authenticateWithInitData(initData);
      }
    };

    const authenticateWithInitData = async (initData: string) => {
      try {
        // 5-2. initData로 서버에 인증 요청
        await login(initData);
        // 5-3-3. 인증 성공: 필요한 페이지로 이동
        navigate('/dice-event');
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          // 5-3-4. 신규 사용자: 회원가입 페이지로 이동
          navigate('/sign-up');
        } else {
          // 5-3-7. 에러 처리
          console.error('Authentication failed:', err);
          alert('Authentication failed. Please try again.');
        }
      }
    };

    const parseJwt = (token: string) => {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return null;
      }
    };

    checkAuthentication();
  }, [fetchUserData, login, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  return (
    <div className="main-page-container">
      <p>Welcome to the Dice Event Mini-App!</p>
      {/* 추가적인 UI 요소 */}
    </div>
  );
};

export default MainPage;
