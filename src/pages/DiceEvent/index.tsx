import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Board,
  Gauge,
  StarTile,
  DiceTile,
  AirplaneTile,
  useDice,
  useGauge,
  useUserLevel,
} from '@/features/DiceEvent';
import UserLevel from '@/entities/User/components/UserLevel';
import '@/features/DiceEvent/DiceEvent.css';
import Dice from '@/widgets/Dice';
import Images from '@/shared/assets/images';
import { WeeklyPrize } from '@/entities/WeeklyPrize';
import {
  handleMouseDown,
  handleMouseUp,
  movePiece,
  handleTileClick,
  applyReward,
} from '@/features/DiceEvent/components/diceEventHandlers';
import Attendance from '@/widgets/Attendance';
import MyRankingWidget from '@/widgets/MyRanking/MyRankingWidget';
import MissionWidget from '@/widgets/MissionWidget/MissionWidget';
import { BsDice5Fill } from 'react-icons/bs';
import RPSGame from '../RPSGame';
import SpinGame from '../SpinGame';

const DiceEventPage: React.FC = () => {
  const initialCharacterType: 'dog' | 'cat' = 'dog';
  const [position, setPosition] = useState<number>(0);
  const [moving, setMoving] = useState<boolean>(false);
  const [selectingTile, setSelectingTile] = useState<boolean>(false);
  const [diceCount, setDiceCount] = useState<number>(100);
  const [starPoints, setStarPoints] = useState<number>(0);
  const [lotteryCount, setLotteryCount] = useState<number>(0);
  const [showDiceValue, setShowDiceValue] = useState<boolean>(false);
  const [rolledValue, setRolledValue] = useState<number>(0);
  const [reward, setReward] = useState<{
    type: string;
    value: number;
    top: string;
    left: string;
  } | null>(null);

  const {
    diceRef,
    diceValue,
    rollDice,
    handleRollComplete: originalHandleRollComplete,
    buttonDisabled,
    setButtonDisabled,
  } = useDice();
  const { gaugeValue, isHolding, setIsHolding } = useGauge();
  const { userLv, mainColorClassName, charactorImageSrc } =
    useUserLevel(initialCharacterType);

  const [initialX, setInitialX] = useState<number>(140);
  const [initialY, setInitialY] = useState<number>(474);
  const [delta, setDelta] = useState<number>(56);

  const [weeklyPrizeData, setWeeklyPrizeData] = useState<{
    week: string;
    prizeName: string;
    prizeValue: string;
  }>({
    week: 'Week 2',
    prizeName: 'SL Coin',
    prizeValue: 'Approx. $8,000',
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
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showReward = (type: string, value: number) => {
    const randomTop = `${Math.random() * 80 + 10}%`;
    const randomLeft = `${Math.random() * 80 + 10}%`;
    setReward({ type, value, top: randomTop, left: randomLeft });
    setTimeout(() => {
      setReward(null);
    }, 1000);
  };

  const handleRollComplete = (value: number) => {
    setRolledValue(value);
    setShowDiceValue(true);
    setTimeout(() => {
      setShowDiceValue(false);
    }, 1000);
    originalHandleRollComplete(value);
    setButtonDisabled(true); // 주사위 버튼 비활성화
    movePiece(
      value,
      position,
      setPosition,
      setMoving,
      setSelectingTile,
      setStarPoints,
      setDiceCount,
      setLotteryCount, // 새로운 인수 추가
      showReward,
      () => setButtonDisabled(false), // 이동 완료 후 버튼 활성화
    );
  };

  const getTileStyle = (tileNumber: number) => {
    const baseStyle =
      'flex items-center justify-center w-[52px] h-[52px] md:w-24 md:h-24 text-center font-semibold text-xs md:text-sm cursor-pointer';
    const startStyle = `${baseStyle} start-tile text-white text-sm md:text-base font-jalnan`;
    const airplaneStyle = `${baseStyle} airplane-tile`;
    const gameStyle = `${baseStyle} game-tile`;
    const starStyle = `${baseStyle} star-tile`;
    const diceStyle = `${baseStyle} dice-tile`;
    const activeStyle = 'active-tile';

    let zIndex = selectingTile ? 'z-30' : 'z-10';
    switch (tileNumber) {
      case 0:
        return `${startStyle} ${
          position === tileNumber ? activeStyle : ''
        } ${zIndex}`;
      case 2:
      case 8:
      case 13:
      case 18:
        return `${airplaneStyle} ${
          position === tileNumber ? activeStyle : ''
        } ${zIndex}`;
      case 1:
      case 4:
      case 6:
      case 9:
      case 11:
      case 14:
      case 16:
      case 19:
        return `${starStyle} ${
          position === tileNumber ? activeStyle : ''
        } ${zIndex}`;
      case 5:
      case 10:
      case 15:
        return `${gameStyle} ${
          position === tileNumber ? activeStyle : ''
        } ${zIndex}`;
      default:
        return `${diceStyle} ${
          position === tileNumber ? activeStyle : ''
        } ${zIndex}`;
    }
  };

  return (
    <div className="flex flex-col items-center md:h-screen bg-[#0D1226] relative">
      {/* <SpinGame /> */}
      <RPSGame />
      {/* <div className="w-full flex justify-center mb-4 mt-8 gap-4">
        <UserLevel
          userLv={userLv}
          charactorImageSrc={charactorImageSrc}
          mainColorClassName={mainColorClassName}
        />
        <WeeklyPrize
          week={weeklyPrizeData.week}
          prizeName={weeklyPrizeData.prizeName}
          prizeValue={weeklyPrizeData.prizeValue}
        />
      </div>
      <div className="grid grid-cols-6 grid-rows-6 gap-1 text-xs md:text-base">
        <div
          id="10"
          className={getTileStyle(10)}
          onClick={() =>
            handleTileClick(
              10,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="0"
          data-dice="0"
        >
          11
        </div>
        <div
          id="9"
          className={getTileStyle(9)}
          onClick={() =>
            handleTileClick(
              9,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="100"
          data-dice="0"
        >
          <StarTile count={100} />
        </div>
        <div
          id="8"
          className={getTileStyle(8)}
          onClick={() =>
            handleTileClick(
              8,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="0"
          data-dice="0"
        >
          <AirplaneTile text="Go Game" />
        </div>
        <div
          id="7"
          className={getTileStyle(7)}
          onClick={() =>
            handleTileClick(
              7,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="0"
          data-dice="1"
        >
          <DiceTile count={1} />
        </div>
        <div
          id="6"
          className={getTileStyle(6)}
          onClick={() =>
            handleTileClick(
              6,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="30"
          data-dice="0"
        >
          <StarTile count={30} />
        </div>
        <div
          id="5"
          className={getTileStyle(5)}
          onClick={() =>
            handleTileClick(
              5,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="0"
          data-dice="0"
        >
          6
        </div>
        <div
          id="11"
          className={getTileStyle(11)}
          onClick={() =>
            handleTileClick(
              11,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="30"
          data-dice="0"
        >
          <StarTile count={30} />
        </div>
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
                    transform: 'translate(-50%, -50%)',
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
                  {reward.type === 'star' && (
                    <div className="flex flex-col items-center">
                      <img src={Images.Star} alt="star" className="h-6" />
                      <span className="mt-1 ">+{reward.value}</span>
                    </div>
                  )}
                  {reward.type === 'dice' && (
                    <div className="flex flex-col items-center">
                      <img src={Images.Dice} alt="dice" className="h-6" />
                      <span className="mt-1">+{reward.value}</span>
                    </div>
                  )}
                  {reward.type === 'airplane' && (
                    <img src={Images.Airplane} alt="airplane" className="h-6" />
                  )}
                  {reward.type === 'lottery' && (
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
              onMouseDown={(event) =>
                handleMouseDown(event, buttonDisabled, diceCount, setIsHolding)
              }
              onMouseUp={(event) =>
                handleMouseUp(
                  event,
                  buttonDisabled,
                  diceCount,
                  setIsHolding,
                  rollDice,
                  setDiceCount,
                )
              }
              onTouchStart={(event) =>
                handleMouseDown(event, buttonDisabled, diceCount, setIsHolding)
              }
              onTouchEnd={(event) =>
                handleMouseUp(
                  event,
                  buttonDisabled,
                  diceCount,
                  setIsHolding,
                  rollDice,
                  setDiceCount,
                )
              }
              className={`bg-white rounded-full h-10 w-24 self-center absolute -bottom-5 left-2 md:w-40 md:h-14 border border-[#E5E5E5] text-sm md:text-lg font-medium ${
                buttonDisabled || diceCount < 1
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              disabled={buttonDisabled || diceCount < 1}
            >
              Roll Dice
            </button>
          </div>
          <div className="flex flex-row text-white items-center justify-center gap-1 mt-6">
            <BsDice5Fill className=" w-3 h-3" /> <p> : 1h 20m</p>{' '}
          </div>
        </div>
        <div
          id="4"
          className={getTileStyle(4)}
          onClick={() =>
            handleTileClick(
              4,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="30"
          data-dice="0"
        >
          <StarTile count={30} />
        </div>
        <div
          id="12"
          className={getTileStyle(12)}
          onClick={() =>
            handleTileClick(
              12,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="0"
          data-dice="1"
        >
          <DiceTile count={1} />
        </div>
        <div
          id="3"
          className={getTileStyle(3)}
          onClick={() =>
            handleTileClick(
              3,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="0"
          data-dice="1"
        >
          <DiceTile count={1} />
        </div>
        <div
          id="13"
          className={getTileStyle(13)}
          onClick={() =>
            handleTileClick(
              13,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="0"
          data-dice="0"
        >
          <AirplaneTile text="Go Home" />
        </div>
        <div
          id="2"
          className={getTileStyle(2)}
          onClick={() =>
            handleTileClick(
              2,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="0"
          data-dice="0"
        >
          <AirplaneTile text="Go Spin" />
        </div>
        <div
          id="14"
          className={getTileStyle(14)}
          onClick={() =>
            handleTileClick(
              14,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="50"
          data-dice="0"
        >
          <StarTile count={50} />
        </div>
        <div
          id="1"
          className={getTileStyle(1)}
          onClick={() =>
            handleTileClick(
              1,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="30"
          data-dice="0"
        >
          <StarTile count={30} />
        </div>
        <div
          id="15"
          className={getTileStyle(15)}
          onClick={() =>
            handleTileClick(
              15,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="0"
          data-dice="0"
        >
          16
        </div>
        <div
          id="16"
          className={getTileStyle(16)}
          onClick={() =>
            handleTileClick(
              16,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="50"
          data-dice="0"
        >
          <StarTile count={50} />
        </div>
        <div
          id="17"
          className={getTileStyle(17)}
          onClick={() =>
            handleTileClick(
              17,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="0"
          data-dice="2"
        >
          <DiceTile count={2} />
        </div>
        <div id="18" className={getTileStyle(18)}>
          <AirplaneTile text="Anywhere" />
        </div>
        <div
          id="19"
          className={getTileStyle(19)}
          onClick={() =>
            handleTileClick(
              19,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="50"
          data-dice="0"
        >
          <StarTile count={50} />
        </div>
        <div
          id="0"
          className={getTileStyle(0)}
          onClick={() =>
            handleTileClick(
              0,
              selectingTile,
              setPosition,
              setSelectingTile,
              setMoving,
              setButtonDisabled,
              (tileNumber) =>
                applyReward(
                  tileNumber,
                  setStarPoints,
                  setDiceCount,
                  showReward,
                ),
              setStarPoints, // 추가
              setDiceCount, // 추가
              setLotteryCount, // 추가
              showReward, // 추가
            )
          }
          data-star="200"
          data-dice="0"
          data-lottery="1"
        >
          Home
        </div>
      </div>
      {selectingTile && (
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
        position={position}
        charactorImageSrc={charactorImageSrc}
        initialX={initialX}
        initialY={initialY}
        delta={delta}
      />
      <div className=" hidden md:block md:mb-40"> &nbsp;</div> */}
    </div>
  );
};

export default DiceEventPage;
