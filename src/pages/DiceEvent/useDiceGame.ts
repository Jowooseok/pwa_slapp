//src\pages\DiceEvent\useDiceGame.ts

import { useState, useCallback } from "react";
import { useDice, useGauge } from "@/features/DiceEvent";
import { useRPSGameStore } from "../RPSGame/store";
import { useUserStore } from '@/entities/User/model/userModel';

export interface Reward {
  type: string;
  value: number;
  top: string;
  left: string;
}

export const useDiceGame = () => {
  const {
    position,
    setPosition,
    diceCount,
    incrementDiceCount,
    starPoints,
    incrementStarPoints,
    lotteryCount,
    incrementLotteryCount,
    userLv,
  } = useUserStore();

  const [moving, setMoving] = useState<boolean>(false);
  const [selectingTile, setSelectingTile] = useState<boolean>(false);
  const [showDiceValue, setShowDiceValue] = useState<boolean>(false);
  const [rolledValue, setRolledValue] = useState<number>(0);
  const [reward, setReward] = useState<Reward | null>(null);

  // RPS 게임 및 스핀 게임 상태
  const [isRPSGameActive, setIsRPSGameActive] = useState(false);
  const [isSpinGameActive, setIsSpinGameActive] = useState(false);

  // RPS 게임 스토어 사용
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

  // 보상 표시 함수
  const showReward = useCallback((type: string, value: number) => {
    const randomTop = `${Math.random() * 80 + 10}%`;
    const randomLeft = `${Math.random() * 80 + 10}%`;
    setReward({ type, value, top: randomTop, left: randomLeft });
    setTimeout(() => {
      setReward(null);
    }, 1000);
  }, []);

  // 보상 적용 함수
  const applyReward = useCallback(
    (tileNumber: number) => {
      const tile = document.getElementById(tileNumber.toString());
      if (tile) {
        const starReward = parseInt(tile.getAttribute("data-star") || "0", 10);
        const diceReward = parseInt(tile.getAttribute("data-dice") || "0", 10);

        if (starReward > 0) {
          incrementStarPoints(starReward);
          showReward("star", starReward);
        }
        if (diceReward > 0) {
          incrementDiceCount(diceReward);
          showReward("dice", diceReward);
        }

        if ([2, 8, 13, 18].includes(tileNumber)) {
          showReward("airplane", 0);
        }
      }
    },
    [showReward, incrementStarPoints, incrementDiceCount]
  );

  // 이동 함수
  const movePiece = useCallback(
    (steps: number, currentPosition: number, onMoveComplete: () => void) => {
      setMoving(true);

      const moveStep = () => {
        currentPosition = (currentPosition + 1) % 20;
        setPosition(currentPosition);

        if (currentPosition === 0) {
          incrementStarPoints(200);
          showReward("star", 200);
          incrementDiceCount(1);
          incrementLotteryCount(1);
          setTimeout(() => showReward("lottery", 1), 200);
        }

        if (steps > 1) {
          steps--;
          setTimeout(moveStep, 300);
        } else {
          applyReward(currentPosition);

          switch (currentPosition) {
            case 2:
              setTimeout(() => {
                setPosition(15);
                applyReward(15);
                setMoving(false);
                onMoveComplete();
              }, 300);
              break;
            case 8:
              setTimeout(() => {
                setPosition(5);
                incrementStarPoints(200);
                incrementDiceCount(1);
                incrementLotteryCount(1);
                showReward("star", 200);
                setTimeout(() => showReward("lottery", 1), 200);
                applyReward(5);
                setMoving(false);
                onMoveComplete();
              }, 300);
              break;
            case 13:
              setTimeout(() => {
                setPosition(0);
                applyReward(0);
                setMoving(false);
                onMoveComplete();
              }, 300);
              break;
            case 18:
              setSelectingTile(true);
              setMoving(false);
              break;
            default:
              setMoving(false);
              onMoveComplete();
              break;
          }
        }
      };
      moveStep();
    },
    [
      applyReward,
      incrementDiceCount,
      incrementLotteryCount,
      setMoving,
      setPosition,
      setSelectingTile,
      incrementStarPoints,
      showReward,
    ]
  );

  // 주사위 결과 처리 함수
  const handleRollComplete = useCallback(
    (value: number) => {
      setRolledValue(value);
      setShowDiceValue(true);
      setTimeout(() => {
        setShowDiceValue(false);
      }, 1000);
      originalHandleRollComplete(value);
      setButtonDisabled(true);

      movePiece(value, position, () => {
        const newPosition = (position + value) % 20;

        if (newPosition === 5) {
          setIsRPSGameActive(true);
          rpsGameStore.setBetAmount(diceCount);
        } else if (newPosition === 15) {
          setIsSpinGameActive(true);
        } else {
          setButtonDisabled(false);
        }
      });
    },
    [
      position,
      originalHandleRollComplete,
      diceCount,
      rpsGameStore,
      movePiece,
      setButtonDisabled,
      setRolledValue,
      setShowDiceValue,
      setIsRPSGameActive,
      setIsSpinGameActive,
    ]
  );

  const rollDice = useCallback(() => {
    if (diceCount > 0) {
      originalRollDice();
      incrementDiceCount(-1);
    }
  }, [diceCount, originalRollDice, incrementDiceCount]);

  // 타일 클릭 핸들러
  const handleTileClick = useCallback(
    (tileId: number) => {
      if (!selectingTile || tileId === 18) return;

      if (tileId === 5) {
        if (!rpsGameStore.isGameStarted) {
          setIsRPSGameActive(true);
          rpsGameStore.setBetAmount(diceCount);
        }
      } else if (tileId === 15) {
        if (!isSpinGameActive) {
          setIsSpinGameActive(true);
        }
      } else {
        setPosition(tileId);
        setSelectingTile(false);
        setMoving(false);
        setButtonDisabled(false);

        if (tileId !== 19) {
          incrementStarPoints(200);
          incrementDiceCount(1);
          incrementLotteryCount(1);
          showReward("star", 200);
          setTimeout(() => showReward("lottery", 1), 500);
        }

        applyReward(tileId);
      }
    },
    [
      selectingTile,
      showReward,
      diceCount,
      rpsGameStore,
      isSpinGameActive,
      applyReward,
      setPosition,
      setSelectingTile,
      setMoving,
      setButtonDisabled,
      incrementStarPoints,
      incrementDiceCount,
      incrementLotteryCount,
    ]
  );

  // 가위바위보 게임 종료 처리 함수
  const handleRPSGameEnd = useCallback(
    (result: "win" | "lose", winnings: number) => {
      setIsRPSGameActive(false);
      setSelectingTile(false);
      setButtonDisabled(false);
      setMoving(false);

      if (result === "win") {
        incrementDiceCount(winnings);
        showReward("star", winnings);
      }

      setPosition(6);
    },
    [showReward, incrementDiceCount, setPosition]
  );

  // 스핀 게임 종료 처리 함수
  const handleSpinGameEnd = useCallback(() => {
    setIsSpinGameActive(false);
    setSelectingTile(false);
    setButtonDisabled(false);
    setMoving(false);
    setPosition(16);
  }, [setPosition]);

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
    showReward,
    handleRollComplete,
    handleTileClick,
    handleMouseDown,
    handleMouseUp,
    setPosition,
    setMoving,
    setSelectingTile,
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
