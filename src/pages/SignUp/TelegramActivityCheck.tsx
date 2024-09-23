// src/pages/SignUp/TelegramActivityCheck.tsx

import React, { useEffect } from 'react';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface ActivityData {
  accountAge: number;
  activityLevel: number;
  telegramPremium: number;
  ogStatus: number;
}

interface TelegramActivityCheckProps {
  activityData: ActivityData;
  onComplete: () => void;
}

const TelegramActivityCheck: React.FC<TelegramActivityCheckProps> = ({ activityData, onComplete }) => {
  useEffect(() => {
    console.log('Step 5-12: TelegramActivityCheck 컴포넌트 마운트됨. activityData:', activityData);
    // 활동량 점수를 표시한 후 자동으로 이동하도록 설정
    const timer = setTimeout(() => {
      console.log('Step 5-13: 활동량 점수 확인 완료. onComplete 호출.');
      onComplete();
    }, 3000); // 3초 후 이동 (필요에 따라 조정)
    
    return () => {
      clearTimeout(timer);
      console.log('Step 5-14: TelegramActivityCheck 컴포넌트 언마운트됨. 타이머 정리.');
    };
  }, [activityData, onComplete]);

  const isComplete = (value: number) => value === 100;

  const progressVariants = {
    initial: { width: '0%' },
    animate: (value: number) => ({
      width: `${value}%`,
      transition: { duration: 1, ease: 'easeInOut' },
    }),
  };

  return (
    <div className="flex flex-col bg-[#0D1226] h-screen text-white items-center">
      <h1 className="text-3xl font-bold mt-32 text-center">
        Your Activity Scores
      </h1>
      <div className="flex flex-col mt-12 font-medium w-full px-6 gap-4">
        {Object.entries(activityData).map(([key, value]) => (
          <div className="flex flex-col gap-3" key={key}>
            <div className="flex flex-row justify-between items-center">
              <p>
                {key === 'accountAge' && 'Account Age'}
                {key === 'activityLevel' && 'Activity Level'}
                {key === 'telegramPremium' && 'Telegram Premium'}
                {key === 'ogStatus' && 'OG Status'}
              </p>
              {isComplete(value) ? (
                <FiCheckCircle className="w-6 h-6 text-[#0147E5]" />
              ) : (
                <FiCircle className="w-6 h-6 text-[#0147E5]" />
              )}
            </div>
            <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="absolute h-full bg-[#0147E5]"
                custom={value}
                variants={progressVariants}
                initial="initial"
                animate="animate"
              />
            </div>
            <p className="text-sm mt-1">{value}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TelegramActivityCheck;
