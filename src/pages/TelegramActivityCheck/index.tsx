import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const TelegramActivityCheck: React.FC = () => {
  const [progress, setProgress] = useState({
    accountAge: 0,
    activityLevel: 0,
    telegramPremium: 0,
    ogStatus: 0,
  });

  useEffect(() => {
    const updateProgress = (key: keyof typeof progress) => {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newValue = Math.min(prevProgress[key] + 2, 100);
          if (newValue === 100) {
            clearInterval(interval);
          }
          return { ...prevProgress, [key]: newValue };
        });
      }, 50);
    };

    // 모든 작업을 동시에 시작
    updateProgress('accountAge');
    updateProgress('activityLevel');
    updateProgress('telegramPremium');
    updateProgress('ogStatus');
  }, []);

  const isComplete = (value: number) => value === 100;

  const progressVariants = {
    initial: { width: '0%' },
    animate: (value: number) => ({
      width: `${value}%`,
      transition: { duration: 0.5, ease: 'easeInOut' },
    }),
  };

  // 모든 작업이 완료되었는지 확인하는 함수
  const allTasksComplete = () =>
    Object.values(progress).every((value) => value === 100);

  return (
    <div className="flex flex-col bg-[#0D1226] h-screen text-white items-center">
      <h1 className="text-3xl font-bold mt-32 text-center">
        Checking <br /> your account
      </h1>
      <div className="flex flex-col mt-12 font-medium w-full px-6 gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between items-center">
            <p>Account Age Verified</p>
            {isComplete(progress.accountAge) ? (
              <FiCheckCircle className="w-6 h-6 text-[#0147E5]" />
            ) : (
              <FiCircle className="w-6 h-6 text-[#0147E5]" />
            )}
          </div>
          <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute h-full bg-[#0147E5]"
              custom={progress.accountAge}
              variants={progressVariants}
              initial="initial"
              animate="animate"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between items-center">
            <p>Activity Level Analyzed</p>
            {isComplete(progress.activityLevel) ? (
              <FiCheckCircle className="w-6 h-6 text-[#0147E5]" />
            ) : (
              <FiCircle className="w-6 h-6 text-[#0147E5]" />
            )}
          </div>
          <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute h-full bg-[#0147E5]"
              custom={progress.activityLevel}
              variants={progressVariants}
              initial="initial"
              animate="animate"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between items-center">
            <p>Telegram Premium Checked</p>
            {isComplete(progress.telegramPremium) ? (
              <FiCheckCircle className="w-6 h-6 text-[#0147E5]" />
            ) : (
              <FiCircle className="w-6 h-6 text-[#0147E5]" />
            )}
          </div>
          <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute h-full bg-[#0147E5]"
              custom={progress.telegramPremium}
              variants={progressVariants}
              initial="initial"
              animate="animate"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between items-center">
            <p>OG Status Confirmed</p>
            {isComplete(progress.ogStatus) ? (
              <FiCheckCircle className="w-6 h-6 text-[#0147E5]" />
            ) : (
              <FiCircle className="w-6 h-6 text-[#0147E5]" />
            )}
          </div>
          <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute h-full bg-[#0147E5]"
              custom={progress.ogStatus}
              variants={progressVariants}
              initial="initial"
              animate="animate"
            />
          </div>
        </div>
      </div>
      <div className=" bottom-10 absolute flex w-full self-center">
        <button
          className={`h-14 bg-[#0147e5] rounded-full w-full mx-6 ${
            allTasksComplete() ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!allTasksComplete()} // 모든 작업이 완료되지 않으면 버튼 비활성화
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default TelegramActivityCheck;
