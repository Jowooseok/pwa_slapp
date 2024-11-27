// src/pages/DiceEvent/GameBoard.tsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tile from "./tile";
import { StarTile, DiceTile, AirplaneTile, Gauge } from "@/features/DiceEvent";
import Dice from "@/widgets/Dice";
import { BsDice5Fill } from "react-icons/bs";
import Images from "@/shared/assets/images";
import { Switch } from "@/shared/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui";
import { IoDice, IoGameController, IoTicket } from "react-icons/io5";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useUserStore } from "@/entities/User/model/userModel";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

interface GameBoardProps {
  position: number;
  selectingTile: boolean;
  handleTileClick: (tileId: number) => void;
  gaugeValue: number;
  diceCount: number;
  showDiceValue: boolean;
  rolledValue: number;
  buttonDisabled: boolean;
  diceRef: React.RefObject<any>;
  handleRollComplete: (value: number, gaugeValue: number) => void;
  reward: { type: string; value: number; top: string; left: string } | null;
  isHolding: boolean;
  handleMouseDown: () => void;
  handleMouseUp: () => void;
  isLuckyVisible: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  position,
  selectingTile,
  handleTileClick,
  gaugeValue,
  diceCount,
  showDiceValue,
  rolledValue,
  buttonDisabled,
  diceRef,
  handleRollComplete,
  reward,
  isHolding,
  handleMouseDown,
  handleMouseUp,
  isLuckyVisible,
}) => {
  const { items, diceRefilledAt, boards } = useUserStore();
  const [timeUntilRefill, setTimeUntilRefill] = useState("");

  useEffect(() => {
    const updateRefillTime = () => {
      if (diceRefilledAt) {
        const now = dayjs();
        const refillTime = dayjs(diceRefilledAt);
        const diff = refillTime.diff(now);
        if (diff <= 0) {
          setTimeUntilRefill("0m");
        } else {
          const remainingDuration = dayjs.duration(diff);
          const hours = remainingDuration.hours();
          const minutes = remainingDuration.minutes();
          setTimeUntilRefill(`${hours}h ${minutes}m`);
        }
      } else {
        // diceRefilledAt이 null인 경우 "Waiting"을 표시
        setTimeUntilRefill("Waiting");
      }
    };
    updateRefillTime();
    const interval = setInterval(updateRefillTime, 60000);
    return () => clearInterval(interval);
  }, [diceRefilledAt]);

  // Mapping from front-end tile IDs to server tile sequences
  const tileIdToSequenceMap: { [key: number]: number } = {
    // Front-end tile ID: Server tile sequence
    10: 10,
    9: 9,
    8: 8,
    7: 7,
    6: 6,
    5: 5,
    11: 11,
    4: 4,
    12: 12,
    3: 3,
    13: 13,
    2: 2,
    14: 14,
    1: 1,
    15: 15,
    16: 16,
    17: 17,
    18: 18,
    19: 19,
    0: 0,
  };

  const renderTile = (id: number) => {
    const sequence = tileIdToSequenceMap[id];
    const tileData = boards.find((tile) => tile.sequence === sequence);

    let content: React.ReactNode = null;
    let dataStar = "0";
    let dataDice = "0";

    if (tileData) {
      switch (tileData.tileType) {
        case "HOME":
          content = "Home";
          break;
        case "REWARD":
          if (tileData.rewardType === "STAR") {
            content = <StarTile count={tileData.rewardAmount || 0} />;
            dataStar = (tileData.rewardAmount || 0).toString();
          } else if (tileData.rewardType === "DICE") {
            content = <DiceTile count={tileData.rewardAmount || 0} />;
            dataDice = (tileData.rewardAmount || 0).toString();
          }
          break;
        case "SPIN":
          content = (
            <img
              src={Images.SpinImage}
              alt="Spin"
              className="z-0 w-[41px] h-[41px]"
            />
          );
          break;
        case "RPS":
          content = (
            <img
              src={Images.RPSImage}
              alt="RPS"
              className="z-0 w-[51px] h-[51px]"
            />
          );
          break;
        case "MOVE":
          content = <AirplaneTile text={tileData.moveType || ""} />;
          break;
        case "JAIL":
          content = (
            <img
              src={Images.DesertIsland}
              alt="Jail"
              className="z-0 w-[41px] h-[41px]"
            />
          );
          break;
        default:
          content = null;
      }
    }

    return (
      <Tile
        key={id}
        id={id}
        onClick={() => handleTileClick(id)}
        position={position}
        selectingTile={selectingTile}
        data-star={dataStar}
        data-dice={dataDice}
      >
        {content}
      </Tile>
    );
  };

  return (
    <div className="grid grid-cols-6 grid-rows-6 gap-1 text-xs md:text-base relative">
      {/* Tile rendering */}
      {renderTile(10)}
      {renderTile(9)}
      {renderTile(8)}
      {renderTile(7)}
      {renderTile(6)}
      {renderTile(5)}
      {renderTile(11)}

      {/* Central board */}
      <div className="col-span-4 row-span-4 flex flex-col items-center justify-evenly bg-center rotate-background">
        <div className="w-full flex justify-center mb-4">
          <Gauge gaugeValue={gaugeValue} />
        </div>
        <div className="relative w-[120px] h-[120px] bg-[#F59E0B] rounded-full md:w-44 md:h-44">
          <AnimatePresence>
            {showDiceValue && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 1 }}
                className="absolute flex items-center justify-center w-24 h-24 bg-white rounded-full text-black text-4xl font-bold -top-4 left-3 md:left-10"
                style={{
                  transform: "translate(-50%, -50%)",
                  zIndex: 50,
                }}
              >
                {rolledValue}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {reward && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 1 }}
                className="absolute flex items-center justify-center w-16 h-16 bg-white rounded-full text-black text-sm font-bold border-4 border-yellow-200"
                style={{
                  top: reward.top,
                  left: reward.left,
                  zIndex: 50,
                }}
              >
                {reward.type === "star" && (
                  <div className="flex flex-col items-center">
                    <img src={Images.Star} alt="star" className="h-6" />
                    <span className="mt-1 ">+{reward.value}</span>
                  </div>
                )}
                {reward.type === "dice" && (
                  <div className="flex flex-col items-center">
                    <img src={Images.Dice} alt="dice" className="h-6" />
                    <span className="mt-1">+{reward.value}</span>
                  </div>
                )}
                {reward.type === "airplane" && (
                  <img src={Images.Airplane} alt="airplane" className="h-6" />
                )}
                {reward.type === "lottery" && (
                  <div className="flex flex-col items-center">
                    <img
                      src={Images.LotteryTicket}
                      alt="lottery"
                      className="h-6"
                    />
                    <span className="mt-1">+{reward.value}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="bg-[#FACC15] rounded-full w-[110px] h-[110px] object-center absolute left-[5px] top-[5px] md:left-2 md:top-2 md:w-40 md:h-40"></div>
          <div className="flex flex-col w-full h-full items-center justify-center dice-container">
            <Dice
              ref={diceRef}
              onRollComplete={(value: number) =>
                handleRollComplete(value, gaugeValue)
              }
              gaugeValue={gaugeValue}
            />
          </div>
          <p className="absolute text-white text-sm font-semibold drop-shadow bottom-6 right-5 z-20 md:bottom-11 md:right-9">
            x {diceCount}
          </p>
          {/* "LUCKY" image animation */}
          <AnimatePresence>
            {isLuckyVisible && (
              <motion.img
                src={Images.Lucky}
                alt="Lucky Dice"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute bottom-0 -left-8 md:-left-14 md:-bottom-4 z-10 min-w-[180px] md:min-w-[280px]"
              />
            )}
          </AnimatePresence>

          <Dialog>
            <DialogTrigger>
              <div className="absolute text-white -left-11 -bottom-14 md:-left-24 md:-bottom-28 font-semibold text-xs md:text-sm md:space-y-1">
                {/* NFT display */}
                <div className="flex flex-row gap-1 items-center ">
                  <img
                    src={Images.Gold}
                    alt="gold"
                    className=" w-4 h-4 md:w-6 md:h-6"
                  />
                  <p>x {items.goldCount}</p>
                </div>
                <div className="flex flex-row gap-1 items-center ">
                  <img
                    src={Images.Silver}
                    alt="silver"
                    className=" w-4 h-4 md:w-6 md:h-6"
                  />
                  <p>x {items.silverCount}</p>
                </div>
                <div className="flex flex-row gap-1 items-center ">
                  <img
                    src={Images.Bronze}
                    alt="bronze"
                    className=" w-4 h-4 md:w-6 md:h-6"
                  />
                  <p>x {items.bronzeCount}</p>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className=" bg-[#21212F] border-none rounded-3xl text-white">
              <DialogHeader className="">
                <DialogTitle>Your Current Abilities</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col mt-4 gap-4">
                <div className="flex flex-col bg-[#1F1E27] p-5 rounded-3xl border-2 border-[#35383F] font-medium gap-2">
                  <div className="flex flex-row items-center gap-2">
                    <IoDice className="w-6 h-6" />
                    <p>Dice Generation : x{items.timeDiceTimes}</p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <IoGameController className="w-6 h-6" />
                    <p>Game Board Rewards : x{items.boardRewardTimes}</p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <IoTicket className="w-6 h-6" />
                    <p>Raffle Tickets Rewards: x{items.ticketTimes}</p>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-end gap-1">
                  <p className="text-end text-sm font-medium">
                    How these are calculated?
                  </p>
                  <AiOutlineInfoCircle className=" w-5 h-5" />
                </div>

                {/* Additional information section */}
                <div className="flex flex-col bg-[#1F1E27] p-5 rounded-3xl border-2 border-[#35383F] font-medium gap-4 ">
                  {/* You can add more detailed NFT information here if needed */}
                </div>
                <button className=" font-medium bg-[#0147E5] rounded-full h-14 w-[165px] self-center">
                  Shop NFT
                </button>
              </div>
            </DialogContent>
          </Dialog>

          <div className=" absolute flex flex-col items-center text-white -right-11 md:-right-24 md:-bottom-24 -bottom-14 ">
            <Switch className=" w-[26px] h-4 md:h-6 md:w-11 text-[#0147E5]" />
            <p className=" text-xs font-semibold md:text-sm">Auto</p>
          </div>
          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className={`bg-white rounded-full h-10 w-24 self-center absolute -bottom-5 left-3 md:left-2 md:w-40 md:h-14 border border-[#E5E5E5] text-sm md:text-lg font-medium ${
              buttonDisabled || diceCount < 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={buttonDisabled || diceCount < 1}
          >
            Roll Dice
          </button>
        </div>
        <div className="flex flex-row text-white items-center justify-center gap-1 mt-6">
          <BsDice5Fill className="w-3 h-3" />
          <p>: {timeUntilRefill}</p>
        </div>
      </div>

      {/* Additional tile rendering */}
      {renderTile(4)}
      {renderTile(12)}
      {renderTile(3)}
      {renderTile(13)}
      {renderTile(2)}
      {renderTile(14)}
      {renderTile(1)}
      {renderTile(15)}
      {renderTile(16)}
      {renderTile(17)}
      {renderTile(18)}
      {renderTile(19)}
      {renderTile(0)}
    </div>
  );
};

export default GameBoard;
