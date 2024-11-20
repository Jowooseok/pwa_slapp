// src/pages/DiceEvent/useDiceGame.ts

import { useState, useCallback, useRef } from "react";
import { useGauge } from "@/features/DiceEvent";
import { useRPSGameStore } from "../RPSGame/store";
import { useUserStore } from "@/entities/User/model/userModel";
import { anywhereAPI } from "@/features/DiceEvent/api/anywhereApi";

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
          setStarPoints((prev: number) => prev + starReward);
          showReward('star', starReward);
        }
        if (diceReward > 0) {
          setDiceCount((prev: number) => prev + diceReward);
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
    (
      startPosition: number,
      endPosition: number,
      onMoveComplete: (finalPosition: number) => void
    ) => {
      setMoving(true);
      console.log('movePiece 호출됨:', startPosition, endPosition);
      let currentPosition = startPosition;

      const moveStep = () => {
        currentPosition = (currentPosition + 1) % 20;
        console.log('현재 위치:', currentPosition);
        setPosition(currentPosition);

        if (currentPosition === 0) {
          // 홈을 지났을 때 래플권만 증가
          setLotteryCount((prev: number) => prev + 1);
          showReward('lottery', 1);
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
                onMoveComplete(15); // 최종 위치 전달
                // 게임 활성화는 handleRollComplete에서 처리
              }, 300);
              break;
            case 8:
              setTimeout(() => {
                // 홈을 지났을 때 래플권만 증가
                setLotteryCount((prev) => prev + 1);
                showReward("lottery", 1);
                setPosition(5);
                setMoving(false);
                onMoveComplete(5); // 최종 위치 전달
              }, 300);
              break;
            case 13:
              setTimeout(() => {
                setPosition(0);
                // applyReward(0)를 제거하여 중복 보상 방지
                setMoving(false);
                onMoveComplete(0); // 최종 위치 전달
              }, 300);
              break;
            case 18:
              setSelectingTile(true);
              setMoving(false);
              onMoveComplete(18); // 최종 위치 전달
              break;
            default:
              setMoving(false);
              onMoveComplete(currentPosition); // 최종 위치 전달
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
      setLotteryCount,
      // setIsRPSGameActive, // 제거: movePiece에서 사용하지 않음
    ]
  );

  // 주사위 결과 처리 함수
  const handleRollComplete = useCallback(
    (value: number) => {
      console.log('handleRollComplete 호출됨');
      setShowDiceValue(true);
      setRolledValue(value);
      setTimeout(() => {
        setShowDiceValue(false);
      }, 1000);
      setButtonDisabled(true);
      const newPosition = (position + value) % 20;
      const currentPosition = position;

      // 주사위를 굴렸으므로 diceCount를 1 감소시킵니다.
      setDiceCount((prev) => prev - 1);

      movePiece(currentPosition, newPosition, (finalPosition) => {
        if (finalPosition === 5) {
          setIsRPSGameActive(true);
          setIsSpinGameActive(false); // SpinGame 비활성화
          rpsGameStore.fetchAllowedBetting();
          console.log("RPSGame 활성화됨.");
        } else if (finalPosition === 15) {
          setIsSpinGameActive(true);
          setIsRPSGameActive(false); // RPSGame 비활성화
          console.log("SpinGame 활성화됨.");
        } else {
          setIsRPSGameActive(false);
          setIsSpinGameActive(false);
          console.log("게임 비활성화됨.");
        }
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
    ]
  );

  // 주사위 굴리기 함수
  const rollDice = useCallback(() => {
    if (diceCount > 0 && !isRolling) {
      setIsRolling(true);
      setButtonDisabled(true);
      diceRef.current?.roll(); // Dice 컴포넌트의 roll 메소드 호출
      console.log("주사위 굴리기 시작됨.");
    }
  }, [diceCount, isRolling]);

  // 타일 클릭 핸들러 수정
  const handleTileClick = useCallback(
    async (tileId: number) => {
      if (!selectingTile) return;

      console.log(`Tile ${tileId} clicked while selecting tile.`);

      if (tileId === 5 || tileId === 15) {
        // tileId가 5 또는 15인 경우에만 게임 활성화
        try {
          setButtonDisabled(true); // 버튼 비활성화
          setMoving(true); // 이동 중 상태 설정

          // anywhereAPI 호출
          const data = await anywhereAPI(tileId);
          console.log('Move via airplane successful:', data);

          // 서버로부터 받은 데이터로 상태 업데이트
          setRank(data.rank);
          setLotteryCount(data.ticket);
          setDiceCount(data.dice);
          setSlToken(data.slToken);
          setRolledValue(data.diceResult);
          setPosition(data.tileSequence);

          // 필요한 경우 추가적인 보상 처리
          applyReward(tileId);

          // 게임 활성화
          if (tileId === 5) {
            setIsRPSGameActive(true);
            setIsSpinGameActive(false);
            rpsGameStore.fetchAllowedBetting();
            console.log("RPSGame 활성화됨 (타일 5 클릭).");
          } else if (tileId === 15) {
            setIsSpinGameActive(true);
            setIsRPSGameActive(false);
            console.log("SpinGame 활성화됨 (타일 15 클릭).");
          }

        } catch (error: any) {
          console.error('Error moving via airplane:', error);
          // 에러 처리 (예: 사용자에게 알림)
          alert(error.message || 'Failed to move via airplane.');
        } finally {
          setSelectingTile(false);
          setMoving(false);
          setButtonDisabled(false);
        }
      } else {
        console.log("Clicked tile is neither 5 nor 15. Ignoring.");
        // 필요에 따라 다른 타일 클릭 시 동작 추가
      }
    },
    [
      selectingTile,
      setButtonDisabled,
      setMoving,
      setRank,
      setLotteryCount,
      setDiceCount,
      setSlToken,
      setRolledValue,
      setPosition,
      applyReward,
      setIsRPSGameActive,
      setIsSpinGameActive,
      rpsGameStore,
    ]
  );

  // RPS 게임 종료 처리 함수
  const handleRPSGameEnd = useCallback(
    (result: "win" | "lose", winnings: number) => {
      console.log(`useDiceGame - RPS Game Ended: ${result}, Winnings: ${winnings}`);
      setIsRPSGameActive(false);
      setIsSpinGameActive(false);
      setSelectingTile(false);
      setButtonDisabled(false);
      setMoving(false);
    },
    []
  );

  // 스핀 게임 종료 처리 함수
  const handleSpinGameEnd = useCallback(() => {
    console.log("useDiceGame - Spin Game Ended");
    setIsSpinGameActive(false);
    setIsRPSGameActive(false);
    setSelectingTile(false);
    setButtonDisabled(false);
    setMoving(false);
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
    handleRPSGameEnd, // 노출
    handleSpinGameEnd,
    rollDice,
    setDiceCount,
    setLotteryCount,
    setRank,
    setSlToken,
  };
};

export default useDiceGame;
