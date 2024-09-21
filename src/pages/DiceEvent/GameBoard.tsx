import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tile from "./tile";
import { StarTile, DiceTile, AirplaneTile, Gauge } from "@/features/DiceEvent";
import Dice from "@/widgets/Dice";
import { BsDice5Fill } from "react-icons/bs";
import Images from "@/shared/assets/images";

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
  handleRollComplete: (value: number) => void;
  reward: { type: string; value: number; top: string; left: string } | null;
  isHolding: boolean;
  handleMouseDown: () => void;
  handleMouseUp: () => void;
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
}) => {
  const renderTile = (
    id: number,
    content: React.ReactNode,
    dataStar: string,
    dataDice: string
  ) => (
    <Tile
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

  return (
    <div className="grid grid-cols-6 grid-rows-6 gap-1 text-xs md:text-base">
      {renderTile(10, <img src={Images.DesertIsland} className="z-0 w-[41px] h-[41px]" />, "0", "0")}
      {renderTile(9, <StarTile count={100} />, "100", "0")}
      {renderTile(8, <AirplaneTile text="Go Game" />, "0", "0")}
      {renderTile(7, <DiceTile count={1} />, "0", "1")}
      {renderTile(6, <StarTile count={30} />, "30", "0")}
      {renderTile(5, <img src={Images.RPSImage} className="z-0 w-[51px] h-[51px]" />, "0", "0")}
      {renderTile(11, <StarTile count={30} />, "30", "0")}
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
            <Dice ref={diceRef} onRollComplete={handleRollComplete} />
          </div>
          <p className="absolute text-white text-sm font-semibold drop-shadow bottom-6 right-5 z-20 md:bottom-11 md:right-9">
            x {diceCount}
          </p>
          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className={`bg-white rounded-full h-10 w-24 self-center absolute -bottom-5 left-2 md:w-40 md:h-14 border border-[#E5E5E5] text-sm md:text-lg font-medium ${
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
          <BsDice5Fill className="w-3 h-3" /> <p> : 1h 20m</p>{" "}
        </div>
      </div>
      {renderTile(4, <StarTile count={30} />, "30", "0")}
      {renderTile(12, <DiceTile count={1} />, "0", "1")}
      {renderTile(3, <DiceTile count={1} />, "0", "1")}
      {renderTile(13, <AirplaneTile text="Go Home" />, "0", "0")}
      {renderTile(2, <AirplaneTile text="Go Spin" />, "0", "0")}
      {renderTile(14, <StarTile count={50} />, "50", "0")}
      {renderTile(1, <StarTile count={30} />, "30", "0")}
      {renderTile(15, <img src={Images.SpinImage} className="z-0 w-[41px] h-[41px]" />, "0", "0")}
      {renderTile(16, <StarTile count={50} />, "50", "0")}
      {renderTile(17, <DiceTile count={2} />, "0", "2")}
      {renderTile(18, <AirplaneTile text="Anywhere" />, "0", "0")}
      {renderTile(19, <StarTile count={50} />, "50", "0")}
      {renderTile(0, "Home", "200", "0")}
    </div>
  );
};

export default GameBoard;
