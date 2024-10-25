import { TopTitle } from '@/shared/components/ui';
import './Home.css';
import Images from '@/shared/assets/images';
import useMainPageStore from '@/shared/store/useMainPageStore';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { FaChevronRight } from 'react-icons/fa';

interface HomeMenuProps {
  title: string;
  alt: string;
  image: string;
  onClick: () => void;
  className: string;
}

const HomeMenu: React.FC<HomeMenuProps> = ({
  title,
  alt,
  image,
  className,
  onClick,
}) => {
  return (
    <div
      className={`flex flex-col rounded-3xl aspect-square items-center justify-center gap-3 ${
        className && className
      }`}
      onClick={onClick}
      >
      <img src={image} alt={alt} className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain" />
      <div className="flex flex-col items-center justify-center">
        <p className="text-sm md:text-xl lg:text-2xl font-semibold text-center">{title}</p>
      </div>
    </div>
  );
};

interface DailyMissionProps {
  title: string;
  image: string;
  alt: string;
}

const DailyMissionCard: React.FC<DailyMissionProps> = ({
  title,
  image,
  alt,
}) => {
  return (
    <div className="basic-mission-card h-36 rounded-3xl flex flex-row items-center pl-8 pr-5 justify-between mb-3">
      <div className=" space-y-3">
        <p className="text-xl font-semibold">{title}</p>
        <p className=" text-sm">
          Earn various rewards <br className="md:hidden" /> such as dice,
          points, SL coins
        </p>
      </div>
      <img src={image} alt={alt} className=" w-24 h-24" />
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const setSelectedMenu = useMainPageStore((state) => state.setSelectedMenu);

  useEffect(() => {
    // 토큰의 존재 여부 확인
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      // accessToken이 없으면 로그인 페이지로 이동
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // 각 메뉴 클릭 시 전역 상태 설정 후 반려동물 선택 페이지로 이동
  const handleMenuClick = (menu: 'x-ray' | 'ai-analysis' | 'records') => {
    // x-ray 또는 ai-analysis 선택 시 전역 상태에 저장 후 반려동물 선택 페이지로 이동
    setSelectedMenu(menu);
    navigate('/select-pet');
  };
  

  return (
    <div className="flex flex-col text-white mx-6 md:mx-28">
      {/* <TopTitle title="Pet Health Management" /> */}
      <div 
        className="flex items-center w-full mt-8 relative"
        onClick={()=> navigate('/my-point')}>
        <img
          src={Images.pointStar} // 별 이미지 경로
          alt="Star"
          className="w-6 h-6 mr-2"
          />
        <p className="text-lg font-semibold mr-2">10,000P</p> {/* 포인트 표시 */}
        <FaChevronRight className="text-lg cursor-pointer" />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <HomeMenu
          title="AI-based real-time dental analysis"
          image={Images.HomeTooth}
          alt="HomeTooth"
          className="follow-on-x-mission-card"
          onClick={() => handleMenuClick('ai-analysis')}
        />
        <HomeMenu
          title="AI-based dental X-ray analysis"
          image={Images.HomeXray}
          alt="HomeXray"
          className="join-telegram-mission-card"
          onClick={() => handleMenuClick('x-ray')}
        />
        <HomeMenu
          title="Viewing Records"
          image={Images.HomeReport}
          alt="HomeReport"
          className="join-the-sl-discord-mission-card"
          onClick={() => handleMenuClick('records')}
        />
        {/* <HomeMenu
          title="Animal Dice game"
          image={Images.Dice3D}
          alt="Dice3D"
                className="subscribe-to-email-mission-card"
        /> */}
        </div>
      <br /> <br /> <br /> <br />
      <br />
    </div>
  );
};

export default Home;
