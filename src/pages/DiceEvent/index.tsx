import React, { useEffect, useState } from "react";
import { useDiceEventDataQuery } from "@/features/DiceEvent/api/diceEvent"; // 서버에서 데이터 가져오기
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
import RPSGame from "../RPSGame";
import SpinGame from "../SpinGame";
import { useDiceEventStore } from "@/features/DiceEvent/store/diceEventStore"; // zustand 상태 가져오기

const DiceEventPage: React.FC = () => {
  const { setPosition, setDiceCount, setStarPoints, setLotteryCount } =
    useDiceEventStore();

  const game = useDiceGame("dog");
  const [initialX, setInitialX] = useState<number>(140);
  const [initialY, setInitialY] = useState<number>(474);
  const [delta, setDelta] = useState<number>(56);

  // 서버에서 데이터를 받아오는 query 훅
  const { data: diceEventData, error, isLoading } = useDiceEventDataQuery();

  // 데이터가 성공적으로 로드되었을 때 상태 업데이트
  useEffect(() => {
    console.log("Fetching dice event data...");
    if (diceEventData) {
      console.log("Dice event data received:", diceEventData);
      const { nowDice, rank } = diceEventData.data;
      setPosition(nowDice.currentTileId);
      setDiceCount(nowDice.dice);
      setStarPoints(rank.star);
      setLotteryCount(rank.ticket);
    }
  }, [
    diceEventData,
    setPosition,
    setDiceCount,
    setStarPoints,
    setLotteryCount,
  ]);

  const handleRPSCancel = () => {
    console.log("RPS game canceled");
    game.handleRPSGameEnd("lose", 0);
  };

  const handleRPSGameEnd = (result: "win" | "lose", winnings: number) => {
    console.log(`RPS game ended with result: ${result}, winnings: ${winnings}`);
    game.handleRPSGameEnd(result, winnings);
  };

  const handleSpinGameEnd = () => {
    console.log("Spin game ended");
    game.handleSpinGameEnd();
  };

  useEffect(() => {
    const handleResize = () => {
      console.log("Window resized");
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
    <div className="flex flex-col items-center md:h-screen bg-[#0D1226] relative ">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <>
          <p>Error fetching data</p>
          <pre>{error.message}</pre> {/* 에러 메시지 로그 */}
        </>
      ) : (
        <>
          {game.isRPSGameActive ? (
            <>
              <p>RPS Game is active</p>
              <RPSGame
                onGameEnd={handleRPSGameEnd}
                onCancel={handleRPSCancel}
              />
            </>
          ) : game.isSpinGameActive ? (
            <>
              <p>Spin Game is active</p>
              <SpinGame onSpinEnd={handleSpinGameEnd} />
            </>
          ) : (
            <>
              <div className="w-full flex justify-center mb-4 mt-8 gap-4">
                <UserLevel
                  userLv={game.userLv}
                  charactorImageSrc={game.charactorImageSrc}
                  mainColorClassName={game.mainColorClassName}
                />
                <WeeklyPrize
                  week="Week 2"
                  prizeName="SL Coin"
                  prizeValue="Approx. $8,000"
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
              <Board
                position={game.position}
                charactorImageSrc={game.charactorImageSrc}
                initialX={initialX}
                initialY={initialY}
                delta={delta}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DiceEventPage;
