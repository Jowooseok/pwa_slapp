// src/pages/SpinGame/index.tsx

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
import api from "@/shared/api/axiosInstance";
import { useUserStore } from "@/entities/User/model/userModel";


const data = [
  // 스타 보상
  {
    option: "1000 Stars",
    image: {
      uri: `${Images.Star}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    prize: { type: "STAR", amount: 1000 },
    style: { backgroundColor: "#FBA629" },
  },
  // 주사위 보상
  {
    option: "5 Dice",
    image: {
      uri: `${Images.Dice}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    prize: { type: "DICE", amount: 5 },
    style: { backgroundColor: "#F3F3E9" },
  },
  // 스타 보상
  {
    option: "2000 Stars",
    image: {
      uri: `${Images.Star}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    prize: { type: "STAR", amount: 2000 },
    style: { backgroundColor: "#2FAF74" },
  },
  // 주사위 보상
  {
    option: "10 Dice",
    image: {
      uri: `${Images.Dice}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    prize: { type: "DICE", amount: 10 },
    style: { backgroundColor: "#39A1E8" },
  },
  // 스타 보상
  {
    option: "4000 Stars",
    image: {
      uri: `${Images.Star}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    prize: { type: "STAR", amount: 4000 },
    style: { backgroundColor: "#CA3D77" },
  },
  // 주사위 보상
  {
    option: "20 Dice",
    image: {
      uri: `${Images.Dice}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    prize: { type: "DICE", amount: 20 },
    style: { backgroundColor: "#FBA629" },
  },
  // 스타 보상
  {
    option: "5000 Stars",
    image: {
      uri: `${Images.Star}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    prize: { type: "STAR", amount: 5000 },
    style: { backgroundColor: "#F3F3E9" },
  },
  // 주사위 보상
  {
    option: "30 Dice",
    image: {
      uri: `${Images.Dice}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    prize: { type: "DICE", amount: 30 },
    style: { backgroundColor: "#2FAF74" },
  },
  // 토큰 보상
  {
    option: "10 Coins",
    image: {
      uri: `${Images.TokenReward}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    prize: { type: "SL", amount: 10 },
    style: { backgroundColor: "#39A1E8" },
  },
  // 래플권 보상
  {
    option: "1 Raffle Ticket",
    image: {
      uri: `${Images.LotteryTicket}`,
      sizeMultiplier: 0.5,
      offsetY: 150,
    },
    prize: { type: "TICKET", amount: 1 },
    style: { backgroundColor: "#CA3D77" },
  },
];

const SpinGameStart: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className=" flex flex-col items-center justify-center px-12 pb-8 h-full w-full"      
     style={{
      backgroundImage: `url(${Images.BGSpinGame})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>

<h1 className="text-[#fde047] font-jalnan text-center text-[36px] mt-8 ">
        Spin the Wheel,
        <br />
        Win Prizes!
      </h1>

      <img
        src={Images.SpinExample}
        alt="spin-example"
        className="md:w-[306px] md:h-[372px] w-[230px]  mt-4 self-center"
      />
      <div className="border-2 border-[#21212f] rounded-3xl text-center bg-white text-[#171717] font-medium w-[342px] h-[110px] flex items-center justify-center mt-4">
        <p>
          ※ Note ※<br /> If you leave without spinning the roulette, <br />
          you will lose your turn.
        </p>
      </div>
      <button
        className="flex items-center justify-center bg-[#21212f] text-white h-14 mt-4 w-[342px] rounded-full font-medium"
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
  const [prizeData, setPrizeData] = useState<{ spinType: string; amount: number } | null>(
    null
  );
  const [isSpinning, setIsSpinning] = useState(false);


  const {
    setStarPoints,
    setDiceCount,
    setSlToken,
    setLotteryCount,
  } = useUserStore();

  const handleSpinClick = async () => {

    if (isSpinning) return;

    try {

      setIsSpinning(true); // 스핀 시작

      // /play-spin API 호출
      const response = await api.get("/play-spin");
      console.log("Server response:", response.data); // 서버 응답 출력
      if (response.data.code === "OK") {
        const { spinType, amount } = response.data.data;

        // data 배열에서 서버로부터 받은 보상과 일치하는 인덱스 찾기
        const prizeIndex = data.findIndex(
          (item) => item.prize.type === spinType && item.prize.amount === amount
        );

        if (prizeIndex >= 0) {
          console.log("Prize index found:", prizeIndex); // 찾은 인덱스 출력
          setPrizeNumber(prizeIndex);
          setPrizeData({ spinType, amount });
          setMustSpin(true);
        } else {
          console.error("Prize not found in wheel segments");
          window.location.reload();
        }
      } else {
        console.error("Error in play-spin API:", response.data.message);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error calling play-spin API:", error);
      window.location.reload();
    }finally {
      setIsSpinning(false); // 스핀 완료
    }
  };

  const handleSpinEnd = () => {
    setMustSpin(false);
    // 사용자 상태 업데이트
    if (prizeData) {
      console.log("Prize data:", prizeData); // prizeData 출력
      const { spinType, amount } = prizeData;
      if (spinType === "STAR") {
        setStarPoints((prev: number) => prev + amount);
      } else if (spinType === "DICE") {
        setDiceCount((prev: number) => prev + amount);
      } else if (spinType === "SL") {
        setSlToken((prev: number) => prev + amount);
      } else if (spinType === "TICKET") {
        setLotteryCount((prev: number) => prev + amount);
      }
    }
    setIsDialogOpen(true);

  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    onSpinEnd();
    setIsSpinning(false); // 스핀 완료
  };

  const getPrizeDisplayName = (spinType: string | undefined) => {
    switch (spinType) {
      case "STAR":
        return "Stars";
      case "DICE":
        return "Dice";
      case "SL":
        return "Coins";
      case "TICKET":
        return "Raffle Ticket";
      default:
        return spinType ?? "Unknown";
    }
  };

  return (
    <div className="relative flex flex-col items-center h-screen justify-center  w-full" style={{
      backgroundImage: `url(${Images.BGSpinGame})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
<h1 className="text-[#fde047] font-jalnan text-center text-[36px] mt-8 md:mb-12" >
        Spin the Wheel,
        <br />
        Win Prizes!
      </h1>
     
      <img src={Images.Spin} alt="Spin-game" className="w-[320px] md:w-[360px] md:mt-16" loading="lazy" />
      
      <img
        src={Images.SpinPin}
        alt="Spin-game"
        className="w-[126px] h-[142px] absolute z-10  transform rotate-45"
        loading="lazy"
      />
      <div className="absolute top-[1/2] left-1/2 transform -translate-x-1/2 z-0">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          outerBorderColor="#E52025"
          onStopSpinning={handleSpinEnd} // 스핀 종료 후 처리
          spinDuration={0.5}
          outerBorderWidth={20}
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
  disabled={isSpinning || mustSpin} // 스핀 중이거나 반드시 스핀해야 하는 상태일 때 비활성화
  className={`flex items-center justify-center h-14 mt-4 w-[342px] rounded-full font-medium ${
    isSpinning || mustSpin
      ? "bg-[#21212f] opacity-65 text-white cursor-not-allowed" // 비활성화된 스타일
      : "bg-[#21212f] text-white" // 활성화된 스타일
  }`}
>
  {isSpinning ? "Spinning..." : "Spin the Wheel"} {/* 스핀 중일 때 텍스트 변경 */}
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
                Congratulations! You won {prizeData?.amount}{" "}
                {getPrizeDisplayName(prizeData?.spinType)}!
              </p>
              <p className="text-[#a3a3a3]">
                This reward has been added to your account.
              </p>
            </div>
            <div className="space-y-3 w-full">
              <button
                className="w-full h-14 rounded-full bg-[#0147e5]"
                onClick={handleCloseDialog}
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
      className="flex flex-col  z-50 h-screen w-full items-center min-w-[600px]"
    >
      {showSpin ? (
        <Spin onSpinEnd={onSpinEnd} />
      ) : (
        <SpinGameStart onStart={handleStartClick} />
      )}
    </div>
  );
};

export default SpinGame;
