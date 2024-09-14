import React from 'react';
import Images from '@/shared/assets/images';

interface WeeklyPrizeProps {
  week: string;
  prizeName: string;
  prizeValue: string;
}

const WeeklyPrize: React.FC<WeeklyPrizeProps> = ({
  week,
  prizeName,
  prizeValue,
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-48 h-36 md:w-96 md:h-44 relative prize-box overflow-visible z-10 gap-2">
      <div className="absolute h-7 w-20 rounded-full border border-black bg-white flex items-center justify-center text-xs -top-4 z-20 font-medium box-border left-14 md:left-36 inset-2">
        {week}
      </div>
      <img src={Images.PrizeImage} alt="token logo" className=" h-14 mt-2" />
      <div className="flex flex-col items-center">
        <p className=" font-semibold text-base">{prizeName}</p>
        <p className=" text-xs font-normal">{prizeValue}</p>
      </div>
    </div>
  );
};

export default WeeklyPrize;
