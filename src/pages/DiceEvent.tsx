import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/shared/components/ui";

const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

const DiceEvent: React.FC = () => {
  const [diceValue, setDiceValue] = useState<number>(1);
  const [rolling, setRolling] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const [moving, setMoving] = useState<boolean>(false);

  const rollDice = () => {
    setRolling(true);
    setTimeout(() => {
      const randomValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(randomValue);
      setRolling(false);
      movePiece(randomValue);
    }, 1000);
  };

  const movePiece = (steps: number) => {
    setMoving(true);
    let currentPosition = position;
    const moveInterval = setInterval(() => {
      currentPosition = (currentPosition + 1) % 24;
      setPosition(currentPosition);
      steps--;
      if (steps === 0) {
        clearInterval(moveInterval);
        setMoving(false);
      }
    }, 300);
  };

  const getTileStyle = (tileNumber: number) => {
    const baseStyle =
      "flex items-center justify-center w-10 h-10 lg:w-24 lg:h-24 p-2 text-center ";
    const activeStyle = "bg-blue-200";
    const inactiveStyle = "bg-white";
    const edgeTileStyle = "bg-violet-600 from-violet-500";
    return `${baseStyle} ${
      position === tileNumber ? activeStyle : inactiveStyle
    } ${tileNumber === (0 || 6 || 12 || 18) ? edgeTileStyle : ""}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Card className="grid grid-cols-7 grid-rows-7 gap-2 p-4 ">
        <Card className={getTileStyle(12)}>13</Card>
        <Card className={getTileStyle(11)}>12</Card>
        <Card className={getTileStyle(10)}>11</Card>
        <Card className={getTileStyle(9)}>10</Card>
        <Card className={getTileStyle(8)}>9</Card>
        <Card className={getTileStyle(7)}>8</Card>
        <Card className={getTileStyle(6)}>7</Card>

        <Card className={getTileStyle(13)}>14</Card>
        <Card className="col-span-5 row-span-5 flex flex-col items-center justify-center border">
          <motion.div
            className="text-9xl"
            animate={{ rotate: rolling ? 360 : 0 }}
            transition={{ duration: 1 }}
          >
            {diceFaces[diceValue - 1]}
          </motion.div>
          <button
            className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={rollDice}
            disabled={rolling || moving}
          >
            Roll Dice
          </button>
        </Card>
        <Card className={getTileStyle(5)}>6</Card>

        <Card className={getTileStyle(14)}>15</Card>
        <Card className={getTileStyle(4)}>5</Card>
        <Card className={getTileStyle(15)}>16</Card>
        <Card className={getTileStyle(3)}>4</Card>
        <Card className={getTileStyle(16)}>17</Card>

        <Card className={getTileStyle(2)}>3</Card>
        <Card className={getTileStyle(17)}>18</Card>
        <Card className={getTileStyle(1)}>2</Card>
        <Card className={getTileStyle(18)}>19</Card>
        <Card className={getTileStyle(19)}>20</Card>
        <Card className={getTileStyle(20)}>21</Card>
        <Card className={getTileStyle(21)}>22</Card>
        <Card className={getTileStyle(22)}>23</Card>
        <Card className={getTileStyle(23)}>24</Card>
        <Card className={getTileStyle(0)}>1</Card>
      </Card>
    </div>
  );
};

export default DiceEvent;
