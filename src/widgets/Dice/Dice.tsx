//src\widgets\Dice\Dice.tsx

import React, { useState, forwardRef, useImperativeHandle } from "react";
import { motion, useAnimation } from "framer-motion";
import "./Dice.css";
import Images from "@/shared/assets/images"; // 이미지 경로에 맞게 수정

interface DiceProps {
  onRollComplete?: (value: number) => void;
}

const Dice = forwardRef(({ onRollComplete }: DiceProps, ref) => {
  const controls = useAnimation();
  const [rotation, setRotation] = useState({ rotateX: -30, rotateY: 30 });
  const [faceOrder, setFaceOrder] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [frontFace, setFrontFace] = useState(1); // 앞면 상태값

  useImperativeHandle(ref, () => ({
    roll: () => handleRoll(),
  }));

  const handleRoll = () => {
    const randomX = (Math.floor(Math.random() * 4) + 1) * 360;
    const randomY = (Math.floor(Math.random() * 4) + 1) * 360;

    const newFaceOrder = faceOrder.slice().sort(() => Math.random() - 0.5);

    controls
      .start({
        y: [0, -100, 0],
        rotateX: [
          rotation.rotateX,
          rotation.rotateX + randomX,
          rotation.rotateX + randomX + 360,
        ],
        rotateY: [
          rotation.rotateY,
          rotation.rotateY + randomY,
          rotation.rotateY + randomY + 360,
        ],
        transition: {
          duration: 1,
          ease: "linear",
        },
      })
      .then(() => {
        setRotation({
          rotateX: (rotation.rotateX + randomX + 360) % 360,
          rotateY: (rotation.rotateY + randomY + 360) % 360,
        }); // 최종 회전 값 업데이트
        const front = newFaceOrder[4];

        setFrontFace(front); // 앞면 상태값 업데이트
        if (onRollComplete) {
          // onRollComplete(front); 
          onRollComplete(5); // 콜백 함수 호출
        }
      });

    // 주사위가 공중에 떠있는 동안 숫자 변경
    setTimeout(() => {
      setFaceOrder(newFaceOrder);
    }, 777); // 숫자 변경 시간 조정
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
        >
          <div className="cube__face cube__face--front">
            <img src={getFaceImage(faceOrder[0])} alt="1" />
          </div>
          <div className="cube__face cube__face--back">
            <img src={getFaceImage(faceOrder[1])} alt="2" />
          </div>
          <div className="cube__face cube__face--right">
            <img src={getFaceImage(faceOrder[2])} alt="3" />
          </div>
          <div className="cube__face cube__face--left">
            <img src={getFaceImage(faceOrder[3])} alt="4" />
          </div>
          <div className="cube__face cube__face--top">
            <img src={getFaceImage(faceOrder[4])} alt="5" />
          </div>
          <div className="cube__face cube__face--bottom">
            <img src={getFaceImage(faceOrder[5])} alt="6" />
          </div>
        </motion.div>
      </div>
    </div>
  );
});

export default Dice;
