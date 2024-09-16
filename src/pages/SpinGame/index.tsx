import React, { useState } from "react";
import Images from "@/shared/assets/images";
import { Wheel } from "react-custom-roulette";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui";
import { HiX } from "react-icons/hi";

const data = [
  {
    option: "0",
    image: {
      uri: `${Images.Star}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    style: { backgroundColor: "#2FAF74" },
  },
  {
    option: "1",
    image: {
      uri: `${Images.Dice}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    style: { backgroundColor: "#39A1E8" },
  },
  {
    option: "2",
    image: {
      uri: `${Images.TokenReward}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    style: { backgroundColor: "#FBA629" },
  },
  {
    option: "3",
    image: {
      uri: `${Images.Star}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    style: { backgroundColor: "#F3F3E9" },
  },
  {
    option: "4",
    image: {
      uri: `${Images.Dice}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    style: { backgroundColor: "#2FAF74" },
  },
  {
    option: "5",
    image: {
      uri: `${Images.TokenReward}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    style: { backgroundColor: "#39A1E8" },
  },
  {
    option: "6",
    image: {
      uri: `${Images.Star}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    style: { backgroundColor: "#FBA629" },
  },
  {
    option: "7",
    image: {
      uri: `${Images.Dice}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    style: { backgroundColor: "#F3F3E9" },
  },
  {
    option: "8",
    image: {
      uri: `${Images.TokenReward}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    style: { backgroundColor: "#2FAF74" },
  },
  {
    option: "9",
    image: {
      uri: `${Images.LosingTicket}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    style: { backgroundColor: "#39A1E8" },
  },
];

const SpinGameStart: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className=" flex flex-col items-center">
      <img
        src={Images.SpinExample}
        alt="spin-example"
        className=" w-[306px] h-[376px] mt-4 self-center"
      />
      <div className=" border-2 border-[#21212f] rounded-3xl text-center bg-white text-[#171717] font-medium w-[342px] h-[110px] flex items-center justify-center mt-4">
        <p>
          ※ Note ※<br /> If you leave without spinning the roulette, <br />
          you will lose your turn.
        </p>
      </div>
      <button
        className=" flex items-center justify-center bg-[#21212f] text-white h-14 mt-4 w-[342px] rounded-full font-medium"
        onClick={onStart}
      >
        Start
      </button>
    </div>
  );
};

const Spin: React.FC<{ onSpinEnd: () => void }> = ({ onSpinEnd }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  const handleSpinEnd = () => {
    setMustSpin(false);
    setIsDialogOpen(true); // 스핀 종료 후 다이얼로그 오픈
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    onSpinEnd(); // 다이얼로그에서 닫기 버튼을 눌렀을 때 주사위 게임으로 돌아가기
  };

  return (
    <div className="relative flex flex-col items-center">
      <img src={Images.Spin} alt="Spin-game" className="w-[368px] mt-2" />
      <img
        src={Images.SpinPin}
        alt="Spin-game"
        className="w-[126px] h-[142] absolute z-10 top-28 transform rotate-45"
      />
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-0">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          outerBorderColor="#DEDEDE"
          onStopSpinning={handleSpinEnd} // 스핀 종료 후 처리
          spinDuration={0.5}
          outerBorderWidth={10}
          radiusLineColor="none"
          pointerProps={{
            style: {
              width: "0px",
              height: "0px",
            },
          }}
        />
      </div>

      <button
        onClick={handleSpinClick}
        className="flex items-center justify-center bg-[#21212f] text-white h-14 mt-4 w-[342px] rounded-full font-medium"
      >
        Spin the Roulette
      </button>

      <AlertDialog open={isDialogOpen}>
        <AlertDialogContent className="rounded-3xl bg-[#21212F] text-white border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center font-bold text-xl">
              <div className="flex flex-row items-center justify-between">
                <div> &nbsp;</div>
                <p>Roulette Result</p>
                <HiX className="w-6 h-6" onClick={handleCloseDialog} />
              </div>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex flex-col items-center justify-center w-full h-full gap-10">
            <div className="mt-20 w-40 h-40 bg-gradient-to-b from-[#2660f4] to-[#3937a3] rounded-[40px] flex items-center justify-center">
              <div className="w-[158px] h-[158px] logo-bg rounded-[40px] flex items-center justify-center">
                <img
                  src={data[prizeNumber].image.uri}
                  className="w-16 h-16"
                  alt="Prize"
                />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold">
                Congratulations! You won {data[prizeNumber].option}!
              </p>
              <p className="text-[#a3a3a3]">
                This reward has been added to your account.
              </p>
            </div>
            <div className="space-y-3 w-full">
              <button
                className="w-full h-14 rounded-full bg-[#0147e5]"
                onClick={handleCloseDialog} // 확인 버튼 클릭 시 주사위 게임으로 돌아가도록 설정
              >
                OK
              </button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const SpinGame: React.FC<{ onSpinEnd: () => void }> = ({ onSpinEnd }) => {
  const [showSpin, setShowSpin] = useState(false);

  const handleStartClick = () => {
    setShowSpin(true);
  };

  return (
    <div
      className="flex flex-col z-50 h-screen bg-white w-full  items-center"
      style={{
        backgroundImage: `url(${Images.BGSpinGame})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-[#fde047] font-jalnan text-center text-[36px] mt-8 ">
        Let's play,
        <br />
        Roulette Game!
      </h1>

      {showSpin ? (
        <Spin onSpinEnd={onSpinEnd} />
      ) : (
        <SpinGameStart onStart={handleStartClick} />
      )}
    </div>
  );
};

export default SpinGame;
