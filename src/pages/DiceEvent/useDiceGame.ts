// src/pages/DiceEvent/useDiceGame.ts

import { useState, useCallback, useRef } from "react";
import { useGauge } from "@/features/DiceEvent";
import { useRPSGameStore } from "../RPSGame/store";
import { useUserStore } from "@/entities/User/model/userModel";
import { rollDiceAPI } from "@/features/DiceEvent/api/rollDiceApi";

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
    setDiceCount,
    starPoints,
    setStarPoints,
    lotteryCount,
    setLotteryCount,
    userLv,
    setRank,
    setSlToken,
  } = useUserStore();

  const [moving, setMoving] = useState<boolean>(false);
  const [selectingTile, setSelectingTile] = useState<boolean>(false);
  const [showDiceValue, setShowDiceValue] = useState<boolean>(false);
  const [rolledValue, setRolledValue] = useState<number>(0);
  const [reward, setReward] = useState<Reward | null>(null);
  const [tileSequence, setTileSequence] = useState<number>(position);

  // RPS 게임 및 스핀 게임 상태
  const [isRPSGameActive, setIsRPSGameActive] = useState(false);
  const [isSpinGameActive, setIsSpinGameActive] = useState(false);

  // 주사위 굴리는 중인지 상태
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  // RPS 게임 스토어 사용
  const rpsGameStore = useRPSGameStore();

  // 주사위 참조
  const diceRef = useRef<any>(null);
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
          setStarPoints((prev: number) => prev + starReward); // prev에 타입 지정
          showReward('star', starReward);
        }
        if (diceReward > 0) {
          setDiceCount((prev: number) => prev + diceReward); // prev에 타입 지정
          showReward('dice', diceReward);
        }

        if ([2, 8, 13, 18].includes(tileNumber)) {
          showReward("airplane", 0);
        }
      }
    },
    [showReward, setStarPoints, setDiceCount]
  );

  // 이동 함수
  const movePiece = useCallback(
    (startPosition: number, endPosition: number, onMoveComplete: () => void) => {
      setMoving(true);
      console.log('movePiece 호출됨:', startPosition, endPosition);
      let currentPosition = startPosition;

      const moveStep = () => {
        currentPosition = (currentPosition + 1) % 20;
        console.log('현재 위치:', currentPosition);
        setPosition(currentPosition);

        if (currentPosition === 0) {
          setStarPoints((prev: number) => prev + 200); // prev에 타입 지정
          showReward('star', 200);
          setDiceCount((prev: number) => prev + 1); // prev에 타입 지정
          setLotteryCount((prev: number) => prev + 1); // prev에 타입 지정
          setTimeout(() => showReward('lottery', 1), 200);
        }

        if (currentPosition !== endPosition) {
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
              onMoveComplete(); // 추가
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
      setMoving,
      setPosition,
      setSelectingTile,
      showReward,
      setStarPoints,
      setDiceCount,
      setLotteryCount,
    ]
  );

  // 주사위 결과 처리 함수
  const handleRollComplete = useCallback(
    (value: number) => {
      console.log('handleRollComplete 호출됨');
      setShowDiceValue(true);
      setTimeout(() => {
        setShowDiceValue(false);
      }, 1000);
      setButtonDisabled(true);
      
      const newPosition = (position + value) % 20; // 새로운 위치 계산 const newPosition = tileSequence;
      const currentPosition = position;

      movePiece(currentPosition, newPosition, () => {
        if (newPosition === 5) {
          setIsRPSGameActive(true);
          rpsGameStore.setBetAmount(diceCount);
        } else if (newPosition === 15) {
          setIsSpinGameActive(true);
        } else {
          setButtonDisabled(false);
        }
          // 모든 경우에 버튼 활성화
    setButtonDisabled(false);
        setIsRolling(false); // 주사위 굴리기 완료 후 상태 리셋
      });
    },
    [
      position,
      diceCount,
      rpsGameStore,
      movePiece,
      setButtonDisabled,
      setRolledValue,
      setShowDiceValue,
      setIsRPSGameActive,
      setIsSpinGameActive,
      setIsRolling,
      tileSequence,
    ]
  );

  // 주사위 굴리기 함수
  const rollDice = useCallback(async () => {
    if (diceCount > 0 && !isRolling) {
      setIsRolling(true);
      setButtonDisabled(true);

      try {
        // gaugeValue 검증 및 제한
        const validGaugeValue = Math.max(1, Math.min(6, gaugeValue));

        // 서버에 주사위 굴리기 API 호출
        const data = await rollDiceAPI(validGaugeValue);

        // 서버 응답 데이터에서 필요한 값 추출
        const {
          diceResult,
          tileSequence: newTileSequence,
          rank,
          star,
          ticket,
          dice: newDiceCount,
          slToken,
        } = data;

        // 상태 업데이트
        setRolledValue(diceResult);
        setTileSequence(newTileSequence); // 새로운 위치를 상태로 저장
        setRank(rank);
        setStarPoints(star);
        setLotteryCount(ticket);
        setDiceCount(newDiceCount);
        setSlToken(slToken);

        // 주사위 애니메이션 시작
        diceRef.current?.roll(diceResult);

      } catch (error) {
        console.error("주사위 굴리기 에러:", error);
        alert("주사위 굴리기에 실패했습니다. 다시 시도해주세요.");
        setIsRolling(false);
        setButtonDisabled(false);
      }
    }
  }, [
    diceCount,
    isRolling,
    gaugeValue,
    setRolledValue,
    setTileSequence,
    setRank,
    setStarPoints,
    setLotteryCount,
    setDiceCount,
    setSlToken,
    diceRef,
  ]);

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
    [showReward, setDiceCount, setPosition]
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
    rollDice,
    setDiceCount,
    setStarPoints,
    setLotteryCount,
    setRank,
    setSlToken,
  };
};
