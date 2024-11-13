// src/widgets/Dice.tsx

import React, { useState, forwardRef, useImperativeHandle } from "react";
import { motion, useAnimation } from "framer-motion";
import "./Dice.css";
import Images from "@/shared/assets/images";
import { rollDiceAPI } from "@/features/DiceEvent/api/rollDiceApi"; // 서버 API 가져오기

interface DiceProps {
  onRollComplete?: (value: number) => void;
  gaugeValue: number; // 서버에 전달할 게이지 값
}

const Dice = forwardRef(({ onRollComplete, gaugeValue }: DiceProps, ref) => {
  const controls = useAnimation();
  const [rotation, setRotation] = useState({ rotateX: -30, rotateY: 30 });
  const [faceOrder, setFaceOrder] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [isRolling, setIsRolling] = useState(false);

  useImperativeHandle(ref, () => ({
    roll: () => handleRoll(),
  }));

  const handleRoll = async () => {
    if (isRolling) return; // 이미 굴리고 있다면 중복 실행 방지

    setIsRolling(true); // 굴리기 상태 설정

    try {
      // 서버에 주사위 결과 요청
      const data = await rollDiceAPI(gaugeValue);
      const targetFace = data.diceResult; // 서버에서 받은 결과 값

      // 임의 회전 애니메이션으로 시작
      const randomX = (Math.floor(Math.random() * 4) + 1) * 360;
      const randomY = (Math.floor(Math.random() * 4) + 1) * 360;

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
          setRotation({ rotateX: -30, rotateY: 30 }); // 최종 회전 값 초기화

          // faceOrder 배열을 업데이트하여 targetFace를 윗면에 배치
          const newFaceOrder = Array.from({ length: 6 }, (_, i) => i + 1).filter(
            (face) => face !== targetFace
          );
          newFaceOrder.splice(4, 0, targetFace); // 윗면 위치에 targetFace 설정

          setFaceOrder(newFaceOrder); // 새 faceOrder 설정

          setIsRolling(false); // 굴리기 종료 상태로 설정

          if (onRollComplete) {
            onRollComplete(targetFace); // 최종 결과 콜백 호출
          }
        });
    } catch (error) {
      console.error("주사위 굴리기 오류:", error);
      alert("주사위 굴리기에 실패했습니다. 다시 시도해주세요.");
      setIsRolling(false);
    }
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
