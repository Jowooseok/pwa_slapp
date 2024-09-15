import { useState, useCallback, useRef } from "react";
import { useDice, useGauge, useUserLevel } from "@/features/DiceEvent";
import { movePiece, applyReward } from "./diceEventHandlers";
import { useRPSGameStore } from "../RPSGame/store"; // 새로 추가: RPSGame 스토어 import

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

  // 새로 추가: RPS 게임 활성화 상태
  const [isRPSGameActive, setIsRPSGameActive] = useState(false);
  // 새로 추가: RPS 게임 스토어 사용
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
    setTimeout(() => {
      setReward(null);
    }, 1000);
  }, []);

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
        () => {
          if (position + value === 5) {
            // 5번 칸에 도착했을 때 RPS 게임 활성화만 하고 startGame은 하지 않음
            setIsRPSGameActive(true);
            rpsGameStore.setBetAmount(diceCount); // 베팅 금액만 설정
          } else {
            setButtonDisabled(false);
          }
        }
      );
    },
    [position, originalHandleRollComplete, showReward, diceCount, rpsGameStore]
  );

  const rollDice = useCallback(() => {
    if (diceCount > 0) {
      originalRollDice();
      setDiceCount((prev) => prev - 1);
    }
  }, [diceCount, originalRollDice]);

  const handleTileClick = useCallback(
    (tileId: number) => {
      if (!selectingTile || tileId === 18) return; // 선택 중이 아닌 경우 클릭 동작 중단

      if (tileId === 5) {
        // 5번 타일 클릭 시 가위바위보 게임 시작
        if (!rpsGameStore.isGameStarted) {
          setIsRPSGameActive(true); // RPS 게임 활성화
          rpsGameStore.setBetAmount(diceCount); // 베팅 금액 설정
        }
      } else {
        // 다른 타일을 클릭했을 때의 동작
        setPosition(tileId);
        setSelectingTile(false); // 타일 선택 상태 종료
        setMoving(false); // 이동 상태 해제
        setButtonDisabled(false); // 버튼 비활성화 해제

        if (tileId !== 19) {
          setStarPoints((prev) => prev + 200);
          setDiceCount((prev) => prev + 1);
          setLotteryCount((prev) => prev + 1);
          showReward("star", 200);
          setTimeout(() => showReward("lottery", 1), 500);
        }

        applyReward(tileId, setStarPoints, setDiceCount, showReward);
      }
    },
    [selectingTile, showReward, diceCount, rpsGameStore]
  );

  // 가위바위보 게임 종료 처리 함수 수정
  const handleRPSGameEnd = useCallback(
    (result: "win" | "lose", winnings: number) => {
      setIsRPSGameActive(false); // RPS 게임 비활성화
      setSelectingTile(false); // 타일 선택 비활성화 (RPS 게임 후에 다시 타일을 선택할 수 없게 설정)
      setButtonDisabled(false); // 버튼 활성화
      setMoving(false); // 이동 상태 해제

      if (result === "win") {
        setDiceCount((prev) => prev + winnings); // 이긴 경우 상금 추가
        showReward("star", winnings);
      }

      setPosition(6); // 예시로 6번 타일로 이동
    },
    [setDiceCount, showReward]
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
    // 새로 추가: RPS 게임 관련 상태와 함수
    isRPSGameActive,
    handleRPSGameEnd,
  };
};
