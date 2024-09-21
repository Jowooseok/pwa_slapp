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
    try {
      const telegram = window.Telegram?.WebApp;
      const initData = telegram?.initData || '';
      await signup(initData, selectedPet);
      navigate('/dice-event');
    } catch (err: any) {
      console.error('Signup failed:', err);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div>
      {step === 'activityCheck' && (
        <TelegramActivityCheck onComplete={() => setStep('selectCharacter')} />
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
