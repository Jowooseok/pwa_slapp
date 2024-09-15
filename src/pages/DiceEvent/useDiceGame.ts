import { useState, useCallback, useRef } from "react";
import { useDice, useGauge, useUserLevel } from "@/features/DiceEvent";
import { movePiece, applyReward } from "./diceEventHandlers";

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
    setTimeout(() => {
      setReward(null);
    }, 1000);
  }, []);

  const handleRollComplete = useCallback(
    (value: number) => {
      setRolledValue(value);
      setShowDiceValue(true);
      setTimeout(() => {
        setShowDiceValue(false);
      }, 1000);
      originalHandleRollComplete(value);
      setButtonDisabled(true);
      movePiece(
        value,
        position,
        setPosition,
        setMoving,
        setSelectingTile,
        setStarPoints,
        setDiceCount,
        setLotteryCount,
        showReward,
        () => setButtonDisabled(false)
      );
    },
    [position, originalHandleRollComplete, showReward]
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
        setTimeout(() => showReward("lottery", 1), 500);
      }

      applyReward(tileId, setStarPoints, setDiceCount, showReward);
    },
    [selectingTile, showReward]
  );

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
  };
};
