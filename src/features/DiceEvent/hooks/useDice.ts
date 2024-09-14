import { useState, useRef } from 'react';

const useDice = () => {
  const diceRef = useRef<any>(null);
  const [diceValue, setDiceValue] = useState<number>(0);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  const rollDice = () => {
    setButtonDisabled(true);
    diceRef.current?.roll();
  };

  const handleRollComplete = (value: number) => {
    setDiceValue(value);
    setButtonDisabled(false);
  };

  return {
    diceRef,
    diceValue,
    rollDice,
    handleRollComplete,
    buttonDisabled,
    setButtonDisabled,
  };
};

export default useDice;
