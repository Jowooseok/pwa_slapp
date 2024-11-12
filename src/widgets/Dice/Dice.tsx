import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './Dice.css';
import Images from '@/shared/assets/images'; // 이미지 경로에 맞게 수정

interface DiceProps {
  onRollComplete?: (value: number) => void;
  targetFace?: number;
}

const Dice = forwardRef(({ onRollComplete, targetFace }: DiceProps, ref) => {
  const controls = useAnimation();
  const [rotation, setRotation] = useState({ rotateX: -30, rotateY: 30 });

  useImperativeHandle(ref, () => ({
    roll: () => handleRoll(),
  }));

  // 각 면에 해당하는 회전 각도 정의 (front 면에 원하는 숫자가 오도록)
  const faceRotations: { [key: number]: { rotateX: number; rotateY: number } } = {
    1: { rotateX: 270, rotateY: 0 },  // 윗면이 front로 오도록
    2: { rotateX: 0, rotateY: 0 },    // 앞면이 front로 오도록
    3: { rotateX: 0, rotateY: 90 },   // 오른쪽 면이 front로 오도록
    4: { rotateX: 0, rotateY: -90 },  // 왼쪽 면이 front로 오도록
    5: { rotateX: 180, rotateY: 0 },  // 뒷면이 front로 오도록
    6: { rotateX: 90, rotateY: 0 },   // 아랫면이 front로 오도록
  };

  const handleRoll = () => {
    const animationDuration = 1; // 초 단위

    const targetRotation = faceRotations[targetFace || 1];

    const randomX = (Math.floor(Math.random() * 4) + 1) * 360;
    const randomY = (Math.floor(Math.random() * 4) + 1) * 360;

    const finalRotationX = rotation.rotateX + randomX + targetRotation.rotateX;
    const finalRotationY = rotation.rotateY + randomY + targetRotation.rotateY;

    controls.start({
      y: [0, -100, 0], // 위로 던졌다가 내려오는 애니메이션
      rotateX: [rotation.rotateX, finalRotationX],
      rotateY: [rotation.rotateY, finalRotationY],
      transition: {
        duration: animationDuration,
        ease: 'easeOut',
      },
    });

    setTimeout(() => {
      if (onRollComplete) {
        onRollComplete(targetFace || 1);
      }
    }, animationDuration * 1000);

    // 회전 값 업데이트
    setRotation({
      rotateX: finalRotationX % 360,
      rotateY: finalRotationY % 360,
    });
  };

  const getFaceImage = (face: number) => {
    switch (face) {
      case 1:
        return Images.Dice1;
      case 2:
        return Images.Dice2;
      case 3:
        return Images.Dice3;
      case 4:
        return Images.Dice4;
      case 5:
        return Images.Dice5;
      case 6:
        return Images.Dice6;
      default:
        return Images.Dice1;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-16 h-screen">
      <div className="scene">
        <motion.div
          className="cube"
          animate={controls}
          initial={{ rotateX: rotation.rotateX, rotateY: rotation.rotateY }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="cube__face cube__face--front">
            <img src={getFaceImage(2)} alt="front" />
          </div>
          <div className="cube__face cube__face--back">
            <img src={getFaceImage(5)} alt="back" />
          </div>
          <div className="cube__face cube__face--right">
            <img src={getFaceImage(3)} alt="right" />
          </div>
          <div className="cube__face cube__face--left">
            <img src={getFaceImage(4)} alt="left" />
          </div>
          <div className="cube__face cube__face--top">
            <img src={getFaceImage(1)} alt="top" />
          </div>
          <div className="cube__face cube__face--bottom">
            <img src={getFaceImage(6)} alt="bottom" />
          </div>
        </motion.div>
      </div>
    </div>
  );
});

export default Dice;
