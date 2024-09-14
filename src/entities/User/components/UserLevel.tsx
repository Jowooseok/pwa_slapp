import React from 'react';

const UserLevel: React.FC<{
  userLv: number;
  charactorImageSrc: string;
  mainColorClassName: string;
}> = ({ userLv, charactorImageSrc, mainColorClassName }) => (
  <div
    className={`flex flex-col items-center justify-center w-32 h-36 md:w-48 md:h-44 lv-box ${mainColorClassName}`}
  >
    <img src={charactorImageSrc} className="w-24 h-24 md:w-32 md:h-32" />
    <div className="flex flex-row items-center w-full px-4 gap-2">
      <p className="font-semibold text-[8px] md:text-xs">Lv.{userLv}</p>
      <div className="flex flex-row border border-[#F59E0B] rounded-full w-full h-2 gap-[0.5px]">
        <div
          className={`bg-[#DD2726] w-[5%] rounded-l-full ${
            userLv < 1 ? 'hidden' : ''
          }`}
        ></div>
        <div
          className={`bg-[#DD2726] w-[5%] ${userLv < 2 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#DD2726] w-[5%] ${userLv < 3 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#DD2726] w-[5%] ${userLv < 4 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#F59E0B] w-[5%] ${userLv < 5 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#F59E0B] w-[5%] ${userLv < 6 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#F59E0B] w-[5%] ${userLv < 7 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#F59E0B] w-[5%] ${userLv < 8 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#FACC15] w-[5%] ${userLv < 9 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#FACC15] w-[5%] ${userLv < 10 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#FACC15] w-[5%] ${userLv < 11 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#FACC15] w-[5%] ${userLv < 12 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#22C55E] w-[5%] ${userLv < 13 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#22C55E] w-[5%] ${userLv < 14 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#22C55E] w-[5%] ${userLv < 15 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#22C55E] w-[5%] ${userLv < 16 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#0147E5] w-[5%] ${userLv < 17 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#0147E5] w-[5%] ${userLv < 18 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#0147E5] w-[5%] ${userLv < 19 ? 'hidden' : ''}`}
        ></div>
        <div
          className={`bg-[#0147E5] w-[5%] rounded-r-full ${
            userLv < 20 ? 'hidden' : ''
          }`}
        ></div>
      </div>
    </div>
  </div>
);

export default UserLevel;
