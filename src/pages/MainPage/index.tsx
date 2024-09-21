// src/pages/MainPage/index.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/entities/User/model/userModel';
import '@/pages/MainPage/MainPage.css';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    login,
    fetchUserData,
    isLoading,
    error,
    // 기타 필요한 상태들
  } = useUserStore();

  useEffect(() => {
    const checkAuthentication = async () => {
      console.log('MainPage: 시작 - 인증 상태 확인 중...');
      const telegram = window.Telegram?.WebApp;
      const initData = telegram?.initData || '';
      console.log('MainPage: Telegram initData:', initData);

      // 로컬 스토리지에서 토큰 확인
      const accessToken = localStorage.getItem('accessToken');
      console.log('MainPage: accessToken:', accessToken);

      if (accessToken) {
        console.log('MainPage: accessToken이 존재합니다. 토큰 검증을 시작합니다.');
        // 토큰에서 telegram_user_id 추출 (JWT 디코딩 필요)
        const decodedToken = parseJwt(accessToken);
        console.log('MainPage: decodedToken:', decodedToken);
        const tokenTelegramUserId = decodedToken?.sub; // 'sub' 필드에 telegram_user_id가 저장되어 있다고 가정
        console.log('MainPage: tokenTelegramUserId:', tokenTelegramUserId);

        // 현재 텔레그램 사용자 ID 얻기
        const currentTelegramUserId = telegram?.initDataUnsafe?.user?.id;
        console.log('MainPage: currentTelegramUserId:', currentTelegramUserId);

        // ID 비교
        if (
          tokenTelegramUserId &&
          currentTelegramUserId &&
          tokenTelegramUserId.toString() === currentTelegramUserId.toString()
        ) {
          console.log('MainPage: 사용자 ID 일치. 토큰 서버 검증을 시작합니다.');
          // 토큰 서버 검증
          try {
            await fetchUserData();
            console.log('MainPage: 사용자 데이터 가져오기 성공. /dice-event 페이지로 이동합니다.');
            navigate('/dice-event');
          } catch (err) {
            console.error('MainPage: 토큰 검증 실패:', err);
            // 토큰 무효: 토큰 삭제하고 인증을 다시 진행
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            authenticateWithInitData(initData);
          }
        } else {
          console.warn('MainPage: 사용자 ID 불일치. 토큰을 삭제하고 인증을 다시 진행합니다.');
          // ID 불일치: 토큰 삭제하고 인증을 다시 진행
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          authenticateWithInitData(initData);
        }
      } else {
        console.log('MainPage: accessToken이 없습니다. 인증을 진행합니다.');
        // 토큰 없음: 인증을 진행
        authenticateWithInitData(initData);
      }
    };

    const authenticateWithInitData = async (initData: string) => {
      console.log('MainPage: initData를 사용하여 로그인 시도 중...');
      try {
        // initData로 서버에 인증 요청
        await login(initData);
        console.log('MainPage: 로그인 성공. /dice-event 페이지로 이동합니다.');
        // 인증 성공: 필요한 페이지로 이동
        navigate('/dice-event');
      } catch (err: any) {
        console.error('MainPage: 인증 실패:', err);
        if (err.message === 'User not found') {
          console.log('MainPage: 신규 사용자. /sign-up 페이지로 이동합니다.');
          // 신규 사용자: 회원가입 페이지로 이동
          navigate('/sign-up');
        } else if (err.response && err.response.status === 401) {
          console.log('MainPage: initData 문제. 로그인 재시도 필요.');
          // initData 문제가 있을 경우, 사용자에게 알림 표시
          alert('Authentication failed due to invalid data. Please try again.');
        } else {
          // 기타 에러 처리
          alert('Authentication failed. Please try again.');
        }
      }
    };

    const parseJwt = (token: string) => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch (e) {
        console.error('MainPage: JWT 파싱 실패:', e);
        return null;
      }
    };

    checkAuthentication();
  }, [fetchUserData, login, navigate]);

  if (isLoading) {
    console.log('MainPage: 로딩 중...');
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('MainPage: 에러 발생:', error);
    return <div>Error loading data: {error}</div>;
  }

  console.log('MainPage: 인증 완료. 메인 페이지 표시.');
  return (
    <div className="main-page-container">
      <p>Welcome to the Dice Event Mini-App!</p>
      {/* 추가적인 UI 요소 */}
    </div>
  );
};

export default MainPage;
