import React, { useEffect } from "react";
import Images from "@/shared/assets/images";
import { motion } from "framer-motion";
import { formatNumber } from "@/shared/utils/formatNumber";
import RPSResultDialog from "./ui/RPSResultDialog";
import RPSGameStart from "./ui/RPSGameStart";
import { useRPSGameStore } from "./store";

interface RPSGameProps {
  onGameEnd: (result: "win" | "lose", winnings: number) => void;
  onCancel: () => void; // 새로 추가: onCancel 속성
}

const rpsImages = {
  rock: Images.Rock,
  paper: Images.Paper,
  scissors: Images.Scissors,
};

const RPSGame: React.FC<RPSGameProps> = ({ onGameEnd, onCancel }) => {
  const {
    betAmount,
    isSpinning,
    slotResults,
    winMultiplier,
    isGameStarted,
    isDialogOpen,
    currentRound,
    gameResult,
    userPoints,
    consecutiveWins,
    setBetAmount,
    startGame,
    spin,
    stopSpin,
    checkResult,
    continueGame,
    endGame,
    closeDialog,
  } = useRPSGameStore();

  const handleSpin = (choice: string) => {
    if (isSpinning) return; // 이미 스핀 중이라면 다시 클릭 불가

    spin(); // 게임 시작 (회전 시작)

    setTimeout(() => {
      // 컴퓨터의 선택을 랜덤으로 결정
      const computerChoice = ["rock", "paper", "scissors"][
        Math.floor(Math.random() * 3)
      ];

      stopSpin(choice, computerChoice); // 유저와 컴퓨터 선택을 전달
      checkResult(choice, computerChoice); // 승리/패배/무승부 결정
    }, 2000); // 2초 후 컴퓨터 선택 및 결과 확인
  };

  const handleGameStart = (amount: number) => {
    setBetAmount(amount);
    startGame();
  };

  const handleContinue = () => {
    if (consecutiveWins > 3) {
      handleQuit();
    } else {
      continueGame();
    }
  };

  const handleQuit = () => {
    endGame();
    if (gameResult !== null) {
      onGameEnd(gameResult, betAmount * winMultiplier);
    } else {
      onGameEnd("lose", 0);
    }
  };

  useEffect(() => {
    // 수평 스크롤 막기
    document.body.style.overflowX = 'hidden';
  
    // 컴포넌트 언마운트 시 원래대로 복구
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, []);

  useEffect(() => {
    if (consecutiveWins > 3) {
      setTimeout(() => {
        handleQuit();
      }, 0);
    }
  }, [consecutiveWins]);

  return (
    <div
      className="flex flex-col z-50 bg-white h-screen justify-items-center drop-shadow overflow-x-hidden"
      style={{
        backgroundImage: `url(${Images.BGRPSGame})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!isGameStarted ? (
        <RPSGameStart
          onStart={handleGameStart}
          userPoints={userPoints}
          onCancel={onCancel} // 취소 기능 추가
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-[600px] overflow-hidden mx-auto">
          <div className="flex flex-row items-center justify-center h-[86px] w-[264px] border-2 border-[#21212f] rounded-3xl bg-white gap-3">
            <div className="flex flex-row items-center gap-1">
              <img src={Images.Star} alt="star" className="w-9 h-9" />
              <p className="text-3xl font-semibold">
                {formatNumber(betAmount * winMultiplier)}
              </p>
            </div>
            <div className="bg-[#21212f] rounded-full flex items-center justify-center h-8 w-11 text-sm font-semibold text-white">
              x {winMultiplier}
            </div>
          </div>
          <div className="mt-8 relative">
            <img
              src={Images.RPSGame}
              alt="RPSGame"
              className="w-[352px] mx-auto"
            />
            {[
              { id: "First-RPS", left: "32px" },
              { id: "Second-RPS", left: "120px" },
              { id: "Third-RPS", left: "210px" },
            ].map((slot, index) => (
              <div
                key={slot.id}
                style={{
                  left: slot.left,
                  position: "absolute",
                  bottom: "204px",
                }}
                className="gap-2 flex flex-row items-center justify-center pl-1 w-[87px] overflow-y-hidden h-[80px] transform"
              >
                <motion.div
                  className="flex flex-col items-center justify-center h-full"
                  initial={{ y: 0 }}
                  animate={{
                    y:
                      isSpinning && index === currentRound - 1
                        ? ["-100%", "0%"]
                        : "0%",
                  }}
                  transition={{
                    duration:
                      isSpinning && index === currentRound - 1 ? 0.1 : 0.5,
                    ease: "linear",
                    repeat:
                      isSpinning && index === currentRound - 1 ? Infinity : 0,
                  }}
                >
                  {slotResults[index] ? (
                    <div
                      className="slot-item text-5xl flex items-center justify-center"
                      style={{ height: "100%", width: "100%" }}
                    >
                      {/* 컴퓨터의 선택을 표시 */}
                      <img
                        src={
                          rpsImages[
                            slotResults[index]
                              .computerChoice as keyof typeof rpsImages
                          ]
                        }
                        alt={`slot-${index}`}
                        className="h-[70px] min-w-[50px] self-center"
                      />
                    </div>
                  ) : (
                    <div
                      className="slot-item text-5xl flex items-center justify-center"
                      style={{ height: "100%", width: "100%" }}
                    >
                      <img
                        src={Images.Scissors}
                        alt={`slot-${index}`}
                        className="h-[70px] min-w-[50px] self-center"
                      />
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
            {/* 하단 버튼을 절대 위치로 설정하여 동일한 위치에 표시 */}
            <div
              style={{
                position: "absolute",
                bottom: "80px",
                left: "54px",
              }}
              className="flex flex-row gap-2 items-center"
            >
              <img
                src={Images.RockButton}
                alt="rock"
                className="w-[68px] h-[68px]"
                onClick={() => handleSpin("rock")}
              />
              <img
                src={Images.PaperButton}
                alt="paper"
                className="w-[68px] h-[68px]"
                onClick={() => handleSpin("paper")}
              />
              <img
                src={Images.ScissorsButton}
                alt="scissors"
                className="w-[68px] h-[68px]"
                onClick={() => handleSpin("scissors")}
              />
            </div>
          </div>
        </div>
      )}
      <RPSResultDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        result={gameResult}
        winnings={betAmount * winMultiplier}
        onContinue={handleContinue}
        onQuit={handleQuit}
        consecutiveWins={consecutiveWins}
      />
    </div>
  );
};

export default RPSGame;
