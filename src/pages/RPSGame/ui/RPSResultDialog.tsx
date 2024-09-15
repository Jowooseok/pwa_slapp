import React from "react";
import { AlertDialog, AlertDialogContent } from "@/shared/components/ui";
import Images from "@/shared/assets/images";

interface ResultWinProps {
  winnings: number;
  onContinue: () => void;
  onQuit: () => void;
  consecutiveWins: number;
}

interface ResultLoseProps {
  winnings: number;
  onQuit: () => void;
}

const ResultWin: React.FC<ResultWinProps> = ({
  winnings,
  onContinue,
  onQuit,
  consecutiveWins,
}) => {
  const isFinalWin = consecutiveWins === 3;

  return (
    <div>
      <img
        src={Images.Victory}
        alt="rps-result"
        className="w-[250px] h-[157px] absolute -top-[96px] left-1/2 transform -translate-x-1/2"
      />
      <div className="flex flex-col items-center justify-center w-full h-full gap-2">
        <div className="flex bg-white rounded-3xl w-[264px] h-[86px] border-2 border-[#21212f] flex-row items-center justify-center gap-1">
          <p className="font-semibold text-[30px] text-[#171717]">
            +{winnings}
          </p>
          <img src={Images.Star} className="w-9 h-9" />
        </div>
        {isFinalWin ? (
          <div className="font-jalnan text-[24px] text-center">
            Congratulations!
            <br />
            You've won 27x your bet!
          </div>
        ) : (
          <div className="font-jalnan text-[30px]">
            <div className="flex flex-col justify-center items-center">
              Continue with <br />
              <div className="flex flex-row items-center justify-center">
                <div className="flex flex-row items-center justify-center font-semibold font-pretendard text-base w-12 h-8 bg-[#21212F] rounded-full">
                  <p>x{Math.pow(3, consecutiveWins + 1)}</p>
                </div>
                ?
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-row gap-2">
          {isFinalWin ? (
            <button
              className="rounded-full h-14 w-[270px] bg-[#21212f] text-white font-medium"
              onClick={onQuit}
            >
              Finish
            </button>
          ) : (
            <>
              <button
                className="rounded-full h-14 w-32 bg-gray-200 text-[#171717] font-medium"
                onClick={onQuit}
              >
                Stop
              </button>
              <button
                className="rounded-full h-14 w-32 bg-[#21212f] text-white font-medium"
                onClick={onContinue}
              >
                Continue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultLose: React.FC<ResultLoseProps> = ({ winnings, onQuit }) => {
  return (
    <div>
      <img
        src={Images.Defeat}
        alt="rps-result"
        className="w-[250px] h-[157px] absolute -top-[96px] left-1/2 transform -translate-x-1/2"
      />
      <div className="flex flex-col items-center justify-center w-full h-full gap-4">
        <div className="flex bg-white rounded-3xl w-[264px] h-[86px] border-2 border-[#21212f] flex-row items-center justify-center gap-1">
          <p className="font-semibold text-[30px] text-[#171717]">
            -{winnings}
          </p>
          <img src={Images.Star} className="w-9 h-9" />
        </div>
        <div className="font-jalnan text-[20px]">
          <p>
            Too bad,
            <br />
            Better luck next time!
          </p>
        </div>

        <button
          className="rounded-full h-14 w-[270px] bg-[#21212f] text-white font-medium"
          onClick={onQuit}
        >
          Quit
        </button>
      </div>
    </div>
  );
};

interface RPSResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  result: "win" | "lose" | null;
  winnings: number;
  onContinue: () => void;
  onQuit: () => void;
  consecutiveWins: number;
}

const RPSResultDialog: React.FC<RPSResultDialogProps> = ({
  isOpen,
  onClose,
  result,
  winnings,
  onContinue,
  onQuit,
  consecutiveWins,
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent
        className="rounded-3xl bg-[#21212F] text-white border-none w-[342px] h-[384px] "
        style={{
          background: `url(${Images.RPSResultBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {result === "win" ? (
          <ResultWin
            winnings={winnings}
            onContinue={onContinue}
            onQuit={onQuit}
            consecutiveWins={consecutiveWins}
          />
        ) : (
          <ResultLose winnings={winnings} onQuit={onQuit} />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RPSResultDialog;
