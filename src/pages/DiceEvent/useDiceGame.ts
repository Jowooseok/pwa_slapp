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
  const { userLv, mainColorClassName, charactorImageSrc } =
    useUserLevel(initialCharacterType);

  // 보상 표시 함수
  const showReward = useCallback((type: string, value: number) => {
    const randomTop = `${Math.random() * 80 + 10}%`;
    const randomLeft = `${Math.random() * 80 + 10}%`;
    setReward({ type, value, top: randomTop, left: randomLeft });
    setTimeout(() => {
      setReward(null);
    }, 1000);
  }, []);

  // 보상 적용 함수 - 먼저 선언
  const applyReward = useCallback(
    (tileNumber: number) => {
      const tile = document.getElementById(tileNumber.toString());
      if (tile) {
        const starReward = parseInt(tile.getAttribute("data-star") || "0", 10);
        const diceReward = parseInt(tile.getAttribute("data-dice") || "0", 10);

        if (starReward > 0) {
          setStarPoints((prev) => prev + starReward);
          showReward("star", starReward);
        }
        if (diceReward > 0) {
          setDiceCount((prev) => prev + diceReward);
          showReward("dice", diceReward);
        }

        if ([2, 8, 13, 18].includes(tileNumber)) {
          showReward("airplane", 0);
        }
      }
    },
    [showReward, setStarPoints, setDiceCount]
  );

  // 이동 함수 - 먼저 선언
  const movePiece = useCallback(
    (steps: number, currentPosition: number, onMoveComplete: () => void) => {
      setMoving(true);

      const moveStep = () => {
        currentPosition = (currentPosition + 1) % 20;
        setPosition(currentPosition);

        if (currentPosition === 0) {
          setStarPoints((prev) => prev + 200);
          showReward("star", 200);
          setDiceCount((prev) => prev + 1);
          setLotteryCount((prev) => prev + 1);
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
                setStarPoints((prev) => prev + 200);
                setDiceCount((prev) => prev + 1);
                setLotteryCount((prev) => prev + 1);
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
      setDiceCount,
      setLotteryCount,
      setMoving,
      setPosition,
      setSelectingTile,
      setStarPoints,
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
    ]
  );

  const rollDice = useCallback(() => {
    if (diceCount > 0) {
      originalRollDice();
      setDiceCount((prev) => prev - 1);
    }
  }, [diceCount, originalRollDice]);

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
          setStarPoints((prev) => prev + 200);
          setDiceCount((prev) => prev + 1);
          setLotteryCount((prev) => prev + 1);
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
      setStarPoints,
      setDiceCount,
      setLotteryCount,
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
        setDiceCount((prev) => prev + winnings);
        showReward("star", winnings);
      }

      setPosition(6);
    },
    [showReward]
  );

  // 스핀 게임 종료 처리 함수
  const handleSpinGameEnd = useCallback(() => {
    setIsSpinGameActive(false);
    setSelectingTile(false);
    setButtonDisabled(false);
    setMoving(false);
    setPosition(16);
  }, []);

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
