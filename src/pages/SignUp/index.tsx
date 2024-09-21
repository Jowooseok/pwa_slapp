// src/pages/SignUp/index.tsx

import React, { useState } from 'react';
import TelegramActivityCheck from './TelegramActivityCheck';
import SelectCharacter from './SelectCharacter';
import { useUserStore } from '@/entities/User/model/userModel';
import { useNavigate } from 'react-router-dom';

const SignUpPage: React.FC = () => {
  const [step, setStep] = useState<'activityCheck' | 'selectCharacter'>('activityCheck');
  const [selectedPet, setSelectedPet] = useState<'DOG' | 'CAT'>('DOG');
  const { signup, isLoading, error } = useUserStore();
  const navigate = useNavigate();

  const handleContinue = async () => {
    console.log('SignUpPage: Continue 버튼 클릭됨. signup 함수 호출.');
    try {
      const telegram = window.Telegram?.WebApp;
      const initData = telegram?.initData || '';
      console.log('SignUpPage: Telegram initData:', initData);
      console.log('SignUpPage: 선택된 캐릭터:', selectedPet);
      await signup(initData, selectedPet);
      console.log('SignUpPage: signup 성공. /dice-event 페이지로 이동합니다.');
      navigate('/dice-event');
    } catch (err: any) {
      console.error('SignUpPage: signup 실패:', err);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="relative">
      {step === 'activityCheck' && (
        <TelegramActivityCheck onComplete={() => {
          console.log('SignUpPage: TelegramActivityCheck 완료. SelectCharacter 단계로 이동.');
          setStep('selectCharacter');
        }} />
      )}
      {step === 'selectCharacter' && (
        <SelectCharacter selectedPet={selectedPet} setSelectedPet={setSelectedPet} />
      )}
      {step === 'selectCharacter' && (
        <div className="bottom-10 absolute flex w-full self-center">
          <button
            className={`h-14 bg-[#0147e5] rounded-full w-full mx-6 ${
              // 모든 작업이 완료되고 캐릭터가 선택되었을 때 활성화
              Object.values({
                accountAge: 100,
                activityLevel: 100,
                telegramPremium: 100,
                ogStatus: 100,
              }).every((value) => value === 100) && selectedPet
                ? 'opacity-100'
                : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={
              !(
                Object.values({
                  accountAge: 100,
                  activityLevel: 100,
                  telegramPremium: 100,
                  ogStatus: 100,
                }).every((value) => value === 100) && selectedPet
              )
            }
            onClick={handleContinue}
          >
            {isLoading ? 'Signing Up...' : 'Continue'}
          </button>
        </div>
      )}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default SignUpPage;
