import { useState, useCallback } from "react";
import { useDice, useGauge, useUserLevel } from "@/features/DiceEvent";
import { useRPSGameStore } from "../RPSGame/store"; // RPSGame 스토어 import

export interface Reward {
  type: string;
  value: number;
  top: string;
  left: string;
}

export const useDiceGame = (initialCharacterType: "dog" | "cat") => {
  const [position, setPosition] = useState<number>(0);
  const [moving, setMoving] = useState<boolean>(false);
  const [selectingTile, setSelectingTile] = useState<boolean>(false);
  const [diceCount, setDiceCount] = useState<number>(100);
  const [starPoints, setStarPoints] = useState<number>(0);
  const [lotteryCount, setLotteryCount] = useState<number>(0);
  const [showDiceValue, setShowDiceValue] = useState<boolean>(false);
  const [rolledValue, setRolledValue] = useState<number>(0);
  const [reward, setReward] = useState<Reward | null>(null);

  // RPS, Spin 게임 상태
  const [isRPSGameActive, setIsRPSGameActive] = useState(false);
  const [isSpinGameActive, setIsSpinGameActive] = useState(false);
  const rpsGameStore = useRPSGameStore();

  const {
    diceRef,
    diceValue,
    rollDice: originalRollDice,
    handleRollComplete: originalHandleRollComplete,
    buttonDisabled,
    setButtonDisabled,
  } = useDice();
  const { gaugeValue, isHolding, setIsHolding } = useGauge();
  const { userLv, mainColorClassName, charactorImageSrc } =
    useUserLevel(initialCharacterType);

  const showReward = useCallback((type: string, value: number) => {
    const randomTop = `${Math.random() * 80 + 10}%`;
    const randomLeft = `${Math.random() * 80 + 10}%`;
    setReward({ type, value, top: randomTop, left: randomLeft });
    setTimeout(() => setReward(null), 1000);
  }, []);

  const applyReward = useCallback(
    (tileNumber: number) => {
      const rewards: { [key: number]: number } = { 2: 300, 8: 200, 13: 100 };
      const starReward = rewards[tileNumber] || 0;

      if (starReward > 0) {
        setStarPoints((prev) => prev + starReward);
        showReward("star", starReward);
      }
      if (tileNumber === 5) {
        setIsRPSGameActive(true);
      } else if (tileNumber === 15) {
        setIsSpinGameActive(true);
      }
    },
    [setStarPoints, showReward]
  );

  const movePiece = useCallback(
    (steps: number) => {
      setMoving(true);
      let currentPosition = position;

      const moveStep = () => {
        currentPosition = (currentPosition + 1) % 20;
        setPosition(currentPosition);

        if (currentPosition === 0) {
          setStarPoints((prev) => prev + 200);
          setDiceCount((prev) => prev + 1);
          setLotteryCount((prev) => prev + 1);
          showReward("star", 200);
        }

        if (steps > 1) {
          steps--;
          setTimeout(moveStep, 300);
        } else {
          switch (currentPosition) {
            case 2:
              setTimeout(() => {
                setPosition(15);
                applyReward(15);
              }, 300);
              break;
            case 8:
              setTimeout(() => {
                setPosition(5);
                applyReward(5);
              }, 300);
              break;
            case 13:
              setTimeout(() => {
                setPosition(0);
                applyReward(0);
              }, 300);
              break;
            case 18:
              setSelectingTile(true);
              break;
            default:
              applyReward(currentPosition);
          }

          setMoving(false);
          setButtonDisabled(false);
        }
      };

      moveStep();
    },
    [
      position,
      setPosition,
      setStarPoints,
      setDiceCount,
      setLotteryCount,
      showReward,
      applyReward,
      setButtonDisabled,
      setSelectingTile,
    ]
  );

  const handleRollComplete = useCallback(
    (value: number) => {
      setRolledValue(value);
      setShowDiceValue(true);
      setTimeout(() => setShowDiceValue(false), 1000);
      originalHandleRollComplete(value);
      setButtonDisabled(true);

      movePiece(value);
    },
    [movePiece, originalHandleRollComplete]
  );

  const rollDice = useCallback(() => {
    if (diceCount > 0) {
      originalRollDice();
      setDiceCount((prev) => prev - 1);
    }
  }, [diceCount, originalRollDice]);

  const handleTileClick = useCallback(
    (tileId: number) => {
      if (!selectingTile || tileId === 18) return;

      setPosition(tileId);
      setSelectingTile(false);
      setMoving(false);
      setButtonDisabled(false);

      if (tileId !== 19) {
        setStarPoints((prev) => prev + 200);
        setDiceCount((prev) => prev + 1);
        setLotteryCount((prev) => prev + 1);
        showReward("star", 200);
      }

      applyReward(tileId);
    },
    [
      selectingTile,
      setPosition,
      setSelectingTile,
      setMoving,
      setButtonDisabled,
      setStarPoints,
      setDiceCount,
      setLotteryCount,
      showReward,
      applyReward,
    ]
  );

  const handleRPSGameEnd = useCallback(
    (result: "win" | "lose", winnings: number) => {
      setIsRPSGameActive(false);
      setSelectingTile(false);
      setButtonDisabled(false);
      setMoving(false);

      if (result === "win") {
        setDiceCount((prev) => prev + winnings);
        showReward("star", winnings);
      }

      setPosition(6);
    },
    [setDiceCount, showReward]
  );

  const handleSpinGameEnd = useCallback(() => {
    setIsSpinGameActive(false);
    setSelectingTile(false);
    setButtonDisabled(false);
    setMoving(false);
    setPosition(16);
  }, [setPosition, setButtonDisabled]);

  const handleMouseDown = useCallback(() => {
    if (!buttonDisabled && diceCount > 0) {
      setIsHolding(true);
    }
  }, [buttonDisabled, diceCount, setIsHolding]);

  const handleMouseUp = useCallback(() => {
    setIsHolding(false);
    if (!buttonDisabled && diceCount > 0) {
      rollDice();
    }
  }, [buttonDisabled, diceCount, rollDice, setIsHolding]);

  return {
    position,
    moving,
    selectingTile,
    diceCount,
    starPoints,
    lotteryCount,
    showDiceValue,
    rolledValue,
    reward,
    diceRef,
    diceValue,
    rollDice,
    buttonDisabled,
    gaugeValue,
    isHolding,
    userLv,
    mainColorClassName,
    charactorImageSrc,
    showReward,
    handleRollComplete,
    handleTileClick,
    handleMouseDown,
    handleMouseUp,
    setPosition,
    setMoving,
    setSelectingTile,
    setDiceCount,
    setStarPoints,
    setLotteryCount,
    setShowDiceValue,
    setRolledValue,
    setReward,
    setButtonDisabled,
    isRPSGameActive,
    isSpinGameActive,
    handleRPSGameEnd,
    handleSpinGameEnd,
  };
};
