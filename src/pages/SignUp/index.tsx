// src/pages/SignUp/index.tsx

import React from 'react';
import TelegramActivityCheck from './TelegramActivityCheck';
import SelectCharacter from './SelectCharacter';
import { useUserStore } from '@/entities/User/model/userModel';
import { useNavigate } from 'react-router-dom';

const SignUpPage: React.FC = () => {
  const [step, setStep] = React.useState<'selectCharacter' | 'activityCheck'>('selectCharacter');
  const [selectedPet, setSelectedPet] = React.useState<'DOG' | 'CAT'>('DOG');
  
  const { signup, login, isLoading, error, activityData: storeActivityData } = useUserStore();
  const navigate = useNavigate();

  const handleCharacterSelect = () => {
    console.log('Step 5-1: Continue 버튼 클릭됨. 캐릭터 선택 완료.');
    handleContinue();
  };

  const handleContinue = async () => {
    console.log('Step 5-2: Continue 함수 실행. signup 함수 호출 시작.');
    try {
      const telegram = window.Telegram?.WebApp;
      const initData = telegram?.initData || '';
      console.log('Step 5-3: Telegram initData:', initData);
      console.log('Step 5-4: 선택된 캐릭터:', selectedPet);
      
      // 회원가입 요청 보내기
      await signup(initData, selectedPet);
      console.log('Step 5-5: signup 함수 호출 완료.');

      // 단계 전환
      setStep('activityCheck');
      console.log('Step 5-6: 단계 전환 - activityCheck');
    } catch (err: any) {
      console.error('Step 5-7: signup 실패:', err);
      if (err.message === 'User not found') {
        // 예시: 유저가 없을 경우
        console.log('Step 5-8: User not found 에러 발생. 사용자에게 알림 표시');
        alert('Signup failed: User not found. Please try again.');
      } else if (err.message === 'Invalid initData') {
        // 예시: 요청 데이터 문제
        console.log('Step 5-9: Invalid initData 에러 발생. 사용자에게 알림 표시');
        alert('Signup failed due to invalid data. Please try again.');
      } else {
        // 기타 에러 처리
        console.log('Step 5-10: 기타 에러 발생. 사용자에게 알림 표시');
        alert('Signup failed. Please try again.');
      }
    }
  };

  const handleActivityCheckComplete = async () => {
    console.log('Step 5-11: 활동량 점수 확인 완료. 로그인 시도 및 페이지 이동');
    try {
      const telegram = window.Telegram?.WebApp;
      const initData = telegram?.initData || '';
      await login(initData);
      navigate('/dice-event');
    } catch (err: any) {
      console.error('Step 5-12: 로그인 실패:', err);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="relative">
      {step === 'selectCharacter' && (
        <SelectCharacter selectedPet={selectedPet} setSelectedPet={setSelectedPet} />
      )}
      {step === 'selectCharacter' && (
        <div className="bottom-10 absolute flex w-full self-center">
          <button
            className={`h-14 bg-[#0147e5] rounded-full w-full mx-6 ${
              selectedPet ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!selectedPet}
            onClick={handleCharacterSelect}
          >
            {isLoading ? 'Signing Up...' : 'Continue'}
          </button>
        </div>
      )}
      {step === 'activityCheck' && storeActivityData && (
        <TelegramActivityCheck activityData={storeActivityData} onComplete={handleActivityCheckComplete} />
      )}
    </div>
  );
};

export default SignUpPage;
