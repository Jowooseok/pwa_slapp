// MiniGame.tsx
import React, { useState, useRef } from 'react';
import { TopTitle } from '@/shared/components/ui';
import './MiniGame.css';
import { formatNumber } from '@/shared/utils/formatNumber';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, useGauge } from '@/features/DiceEvent';
import Dice from '@/widgets/Dice';
import Images from '@/shared/assets/images';

const MiniGame: React.FC = () => {
  const [diceCount, setDiceCount] = useState<number>(10);
  const [starPoints, setStarPoints] = useState<number>(10000);
  const [showDiceValue, setShowDiceValue] = useState<boolean>(false);
  const [rolledValue, setRolledValue] = useState<number>(0);
  const diceRef = useRef<any>(null);

  // Use gauge hook
  const { gaugeValue, isHolding, setIsHolding } = useGauge();

  const rollDice = () => {
    if (diceCount > 0) {
      setDiceCount(diceCount - 1);
      diceRef.current?.roll();
    }
  };

  const handleRollComplete = (value: number) => {
    setRolledValue(value);
    setShowDiceValue(true);
    setTimeout(() => setShowDiceValue(false), 1000);
  };

  const handleMouseDown = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (diceCount < 1) return;
    setIsHolding(true);
  };

  const handleMouseUp = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (diceCount < 1) return;
    setIsHolding(false);
    rollDice();
  };

  return (
    <div className="flex flex-col mx-6 mb-44 text-white items-center">
      <TopTitle title="Precision Dice Roll Game" />
      <div className="mt-8 w-40 h-40 rounded-[40px] flex flex-col items-center justify-center bg-gradient-to-t from-[#2660f4] to-[#3937a3]">
        <div className="w-[154px] h-[156px] mt-[1px] rounded-[40px] aim-number-box flex items-center justify-center font-jalnan text-[96px]">
          <span className="pt-4">{rolledValue}</span>
        </div>
      </div>
      <div className="flex mt-4 bg-white rounded-3xl w-40 h-[104px] flex-col gap-2 justify-center items-center text-lg font-semibold">
        <div className="flex flex-row gap-2 items-center justify-start text-[#171717]">
          <img src={Images.Dice} className="w-7 h-7" alt="dice" />
          <p>{formatNumber(diceCount)}</p>
        </div>
        <div className="flex flex-row gap-2 items-center justify-start text-[#171717]">
          <img src={Images.Star} className="w-7 h-7" alt="dice" />
          <p>{formatNumber(starPoints)}</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-evenly bg-center mt-8 relative">
        <div className="w-full flex justify-center mb-12 md:mb-24">
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
                  transform: 'translate(-50%, -50%)',
                  zIndex: 50,
                }}
              >
                {rolledValue}
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
            className={`bg-white rounded-full h-10 w-24 self-center absolute -bottom-5 left-2 md:w-40 md:h-14 border border-[#E5E5E5] text-sm md:text-lg font-medium text-[#171717] ${
              diceCount < 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={diceCount < 1}
          >
            Roll Dice
          </button>
        </div>
        <div> &nbsp;</div>
      </div>
    </div>
  );
};

export default MiniGame;
