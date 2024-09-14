import { useState, useEffect } from 'react';

const useGauge = () => {
  const [gaugeValue, setGaugeValue] = useState<number>(0.5);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [isIncreasing, setIsIncreasing] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isHolding) {
      interval = setInterval(() => {
        setGaugeValue((prev) => {
          if (prev >= 6) {
            setIsIncreasing(false);
            return prev - 0.25;
          } else if (prev <= 0) {
            setIsIncreasing(true);
            return prev + 0.25;
          }
          return isIncreasing ? prev + 0.25 : prev - 0.25;
        });
      }, 21);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isHolding, isIncreasing]);

  return { gaugeValue, isHolding, setIsHolding };
};

export default useGauge;
