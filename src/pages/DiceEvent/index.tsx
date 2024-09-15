import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserLevel from "@/entities/User/components/UserLevel";
import "@/features/DiceEvent/DiceEvent.css";
import Images from "@/shared/assets/images";
import { WeeklyPrize } from "@/entities/WeeklyPrize";
import Attendance from "@/widgets/Attendance";
import MyRankingWidget from "@/widgets/MyRanking/MyRankingWidget";
import MissionWidget from "@/widgets/MissionWidget/MissionWidget";
import { useDiceGame } from "./useDiceGame";
import GameBoard from "./GameBoard";
import { Board } from "@/features/DiceEvent";

export interface WeeklyPrizeData {
  week: string;
  prizeName: string;
  prizeValue: string;
}

const DiceEventPage: React.FC = () => {
  const game = useDiceGame("dog");
  const [initialX, setInitialX] = useState<number>(140);
  const [initialY, setInitialY] = useState<number>(474);
  const [delta, setDelta] = useState<number>(56);

  const [weeklyPrizeData, setWeeklyPrizeData] = useState<WeeklyPrizeData>({
    week: "Week 2",
    prizeName: "SL Coin",
    prizeValue: "Approx. $8,000",
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setInitialX(250);
        setInitialY(730);
        setDelta(100);
      } else {
        setInitialX(140);
        setInitialY(474);
        setDelta(56);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center md:h-screen bg-[#0D1226] relative">
      <div className="w-full flex justify-center mb-4 mt-8 gap-4">
        <UserLevel
          userLv={game.userLv}
          charactorImageSrc={game.charactorImageSrc}
          mainColorClassName={game.mainColorClassName}
        />
        <WeeklyPrize
          week={weeklyPrizeData.week}
          prizeName={weeklyPrizeData.prizeName}
          prizeValue={weeklyPrizeData.prizeValue}
        />
      </div>
      <GameBoard
        position={game.position}
        selectingTile={game.selectingTile}
        handleTileClick={game.handleTileClick}
        gaugeValue={game.gaugeValue}
        diceCount={game.diceCount}
        showDiceValue={game.showDiceValue}
        rolledValue={game.rolledValue}
        buttonDisabled={game.buttonDisabled}
        diceRef={game.diceRef}
        handleRollComplete={game.handleRollComplete}
        reward={game.reward}
        isHolding={game.isHolding}
        handleMouseDown={game.handleMouseDown}
        handleMouseUp={game.handleMouseUp}
      />
      {game.selectingTile && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-20">
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-75"></div>
          <div className="text-white text-lg z-30 flex flex-col items-center justify-center mb-96 md:mb-[442px]">
            <img
              src={Images.Airplane}
              alt="airplane"
              className="h-20 md:h-24"
            />
            Select a tile to move
          </div>
        </div>
      )}
      <Attendance />
      <MyRankingWidget />
      <MissionWidget />
      <br /> <br /> <br />
      <br />
      <br />
      <Board
        position={game.position}
        charactorImageSrc={game.charactorImageSrc}
        initialX={initialX}
        initialY={initialY}
        delta={delta}
      />
      <div className="hidden md:block md:mb-40"> &nbsp;</div>
    </div>
  );
};

export default DiceEventPage;
