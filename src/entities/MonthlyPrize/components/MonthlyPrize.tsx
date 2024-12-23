import React from 'react';
import { motion } from 'framer-motion';
import Images from '@/shared/assets/images';
import { formatNumber } from '@/shared/utils/formatNumber';
import { useNavigate } from 'react-router-dom';
import { useNavigationStore } from '@/shared/store/navigationStore';

interface MonthlyPrizeProps {
  month: number;
  prizeType: string;
  amount: number;
}

const MonthlyPrize: React.FC<MonthlyPrizeProps> = ({
  month,
  prizeType,
  amount,
}) => {
  const navigate = useNavigate();
  const setSelected = useNavigationStore((state) => state.setSelected);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // 클릭하면 /reward 로 이동
  const handleRankingClick = () => {
    setSelected('/reward');
    if (window.location.pathname !== '/reward') {
      navigate('/reward');
    }
  };

  return (
    <div
      onClick={handleRankingClick}
      className="flex flex-col items-center justify-center w-48 h-36 md:w-[340px] md:h-44 relative text-white border-2 border-[#BBA361] rounded-3xl overflow-visible z-10 gap-2"
    >
      {/* 월 라벨 */}
      <div className="absolute h-7 w-20 rounded-full border-2 border-[#FBDF86] bg-white flex items-center justify-center text-xs -top-4 text-black z-50 font-medium box-border left-14 md:left-32">
        {monthNames[month - 1]}
      </div>

      {/* 상품 이미지 */}
      <img src={Images.PrizeImage} alt="token logo" className="h-14 mt-2" />

      {/* 상품 정보 */}
      <div className="flex flex-col items-center">
        <p className=" font-semibold text-base">{prizeType}</p>
        <p className=" text-xs font-normal">(Approx. ${formatNumber(amount)})</p>
      </div>

      {/* ---------------------------
          아래는 Framer Motion 적용 예시
      --------------------------- */}

      {/* 첫 번째 이미지 예시 */}
      <motion.img
        src={Images.GiveawayEffect}
        alt="giveaway"
        className="absolute w-32 z-30 -top-[20%] -right-[15%] md:right-[5%] md:-top-[10%]"
        animate={{
          opacity: [1, 0, 1], // 1 -> 0 -> 1
          y: [0, -10, 0],     // 위아래로 살짝 이동
        }}
        transition={{
          duration: 2,        // 한 사이클 2초
          repeat: Infinity,   // 무한 반복
          repeatType: 'reverse', // 왕복
        }}
      />

      {/* 두 번째 이미지 예시 */}
      <motion.img
        src={Images.GiveawayEffect}
        alt="giveaway"
        className="absolute w-32 z-30 -bottom-[10%] -left-[15%] md:left-[5%] md:bottom-[5%]"
        animate={{
          opacity: [1, 0.2, 1],   // 1 -> 0.2 -> 1
          y: [0, 10, 0],          // 살짝 아래/위로 이동
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

 
    </div>
  );
};

export default MonthlyPrize;
