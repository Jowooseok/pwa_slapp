import React, { useState, useEffect } from "react";

const StepCounter: React.FC = () => {
  const [steps, setSteps] = useState<number>(0);
  const [lastPeakTime, setLastPeakTime] = useState<number>(0);
  const stepThreshold = 12;
  const stepTimeThreshold = 500; // milliseconds

  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (acceleration) {
        const vectorMagnitude = Math.sqrt(
          (acceleration.x || 0) ** 2 +
            (acceleration.y || 0) ** 2 +
            (acceleration.z || 0) ** 2
        );
        const now = Date.now();

        console.log("Acceleration:", acceleration);
        console.log("Vector Magnitude:", vectorMagnitude);

        if (
          vectorMagnitude > stepThreshold &&
          now - lastPeakTime > stepTimeThreshold
        ) {
          setSteps((steps) => steps + 1);
          setLastPeakTime(now);
        }
      }
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [lastPeakTime]);

  return (
    <div className="p-5 text-center flex flex-col h-full justify-center">
      <h1 className="text-3xl font-bold text-blue-600">Step Counter</h1>
      <p className="text-xl mt-5">
        Steps: <span className="font-semibold">{steps}</span>
      </p>
    </div>
  );
};

export default StepCounter;
