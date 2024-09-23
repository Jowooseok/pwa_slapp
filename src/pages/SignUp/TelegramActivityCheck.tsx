// src/pages/SignUp/TelegramActivityCheck.tsx

import React from 'react';
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
  React.useEffect(() => {
    console.log('Step 5-12: TelegramActivityCheck 컴포넌트 마운트됨. activityData:', activityData);
    // 타이머 제거하여 자동 이동 방지
    return () => {
      console.log('Step 5-14: TelegramActivityCheck 컴포넌트 언마운트됨.');
    };
  }, [activityData]);

  const isComplete = (value: number) => value === 100;

  const progressVariants = {
    initial: { width: '0%' },
    animate: (value: number) => ({
      width: `${value}%`,
      transition: { duration: 1, ease: 'easeInOut' },
    }),
  };

  return (
    <div className="flex flex-col bg-[#0D1226] h-screen text-white items-center p-6">
      <h1 className="text-3xl font-bold mt-32 text-center">
        Your Activity Scores
      </h1>
      <div className="flex flex-col mt-12 font-medium w-full gap-4">
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
      <div className='bottom-10 absolute flex w-full self-center'>
      <button
        className="h-14 bg-[#0147e5] hover:bg-[#013bb5] text-white font-semibold mx-6 w-full rounded-full"
        onClick={onComplete}
      >
        Confirm
      </button>
      </div>
    </div>
  );
};

export default TelegramActivityCheck;
