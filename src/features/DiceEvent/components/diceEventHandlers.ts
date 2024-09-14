import { Dispatch, SetStateAction } from 'react';

export const handleMouseDown = (
  event:
    | React.MouseEvent<HTMLButtonElement>
    | React.TouchEvent<HTMLButtonElement>,
  buttonDisabled: boolean,
  diceCount: number,
  setIsHolding: Dispatch<SetStateAction<boolean>>,
) => {
  event.preventDefault();
  if (buttonDisabled || diceCount < 1) return;
  setIsHolding(true);
};

export const handleMouseUp = (
  event:
    | React.MouseEvent<HTMLButtonElement>
    | React.TouchEvent<HTMLButtonElement>,
  buttonDisabled: boolean,
  diceCount: number,
  setIsHolding: Dispatch<SetStateAction<boolean>>,
  rollDice: () => void,
  setDiceCount: Dispatch<SetStateAction<number>>,
) => {
  event.preventDefault();
  if (buttonDisabled || diceCount < 1) return;
  setIsHolding(false);
  rollDice();
  setDiceCount((prevCount) => prevCount - 1);
};

export const movePiece = (
  steps: number,
  position: number,
  setPosition: Dispatch<SetStateAction<number>>,
  setMoving: Dispatch<SetStateAction<boolean>>,
  setSelectingTile: Dispatch<SetStateAction<boolean>>,
  setStarPoints: Dispatch<SetStateAction<number>>,
  setDiceCount: Dispatch<SetStateAction<number>>,
  setLotteryCount: Dispatch<SetStateAction<number>>, // 추가
  showReward: (type: string, value: number) => void,
  onMoveComplete: () => void, // 추가
) => {
  setMoving(true);

  let currentPosition = position;
  const moveStep = () => {
    currentPosition = (currentPosition + 1) % 20;
    setPosition(currentPosition);

    if (currentPosition === 0) {
      setStarPoints((prev) => prev + 200);
      showReward('star', 200);
      setDiceCount((prev) => prev + 1);
      setLotteryCount((prev) => prev + 1); // 추첨권 증가
      setTimeout(() => showReward('lottery', 1), 200);
    }

    if (steps > 1) {
      steps--;
      setTimeout(moveStep, 300);
    } else {
      applyReward(currentPosition, setStarPoints, setDiceCount, showReward);

      switch (currentPosition) {
        case 2:
          setTimeout(() => {
            setPosition(15);
            applyReward(15, setStarPoints, setDiceCount, showReward);
            setMoving(false);
            onMoveComplete();
          }, 300);
          break;
        case 8:
          setTimeout(() => {
            setPosition(5);
            setStarPoints((prev) => prev + 200);
            setDiceCount((prev) => prev + 1);
            setLotteryCount((prev) => prev + 1); // 추첨권 증가
            showReward('star', 200);
            setTimeout(() => showReward('lottery', 1), 200);
            applyReward(5, setStarPoints, setDiceCount, showReward);
            setMoving(false);
            onMoveComplete();
          }, 300);
          break;
        case 13:
          setTimeout(() => {
            setPosition(0);
            applyReward(0, setStarPoints, setDiceCount, showReward);
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
};

export const applyReward = (
  tileNumber: number,
  setStarPoints: Dispatch<SetStateAction<number>>,
  setDiceCount: Dispatch<SetStateAction<number>>,
  showReward: (type: string, value: number) => void,
) => {
  const tile = document.getElementById(tileNumber.toString());
  if (tile) {
    const starReward = parseInt(tile.getAttribute('data-star') || '0', 10);
    const diceReward = parseInt(tile.getAttribute('data-dice') || '0', 10);

    if (starReward > 0) {
      setStarPoints((prev) => prev + starReward);
      showReward('star', starReward);
    }
    if (diceReward > 0) {
      setDiceCount((prev) => prev + diceReward);
      showReward('dice', diceReward);
    }

    if ([2, 8, 13, 18].includes(tileNumber)) {
      showReward('airplane', 0);
    }
  }
};
export const handleTileClick = (
  tileNumber: number,
  selectingTile: boolean,
  setPosition: Dispatch<SetStateAction<number>>,
  setSelectingTile: Dispatch<SetStateAction<boolean>>,
  setMoving: Dispatch<SetStateAction<boolean>>,
  setButtonDisabled: Dispatch<SetStateAction<boolean>>,
  applyRewardCallback: (tileNumber: number) => void,
  setStarPoints: Dispatch<SetStateAction<number>>,
  setDiceCount: Dispatch<SetStateAction<number>>,
  setLotteryCount: Dispatch<SetStateAction<number>>,
  showReward: (type: string, value: number) => void,
) => {
  if (!selectingTile || tileNumber === 18) return;
  setPosition(tileNumber);
  setSelectingTile(false);
  setMoving(false);
  setButtonDisabled(false);

  if (tileNumber !== 19) {
    setStarPoints((prev) => prev + 200);
    setDiceCount((prev) => prev + 1);
    setLotteryCount((prev) => prev + 1); // 추첨권 증가
    showReward('star', 200);
    setTimeout(() => showReward('lottery', 1), 500);
  }

  applyRewardCallback(tileNumber);
};
