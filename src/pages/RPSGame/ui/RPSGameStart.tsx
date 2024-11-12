import React, { useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui";
import Images from "@/shared/assets/images";
import { formatNumber } from "@/shared/utils/formatNumber";

interface RPSGameStartProps {
  onStart: (betAmount: number) => void;
  userPoints: number;
  onCancel: () => void; // 캔슬 버튼을 위한 콜백 추가
}

const RPSGameStart: React.FC<RPSGameStartProps> = ({
  onStart,
  userPoints,
  onCancel,
}) => {
  const [betAmount, setBetAmount] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (
      value === "" ||
      (/^\d+$/.test(value) && parseInt(value) <= userPoints)
    ) {
      setBetAmount(value);
    }
  };

  const handleStartClick = (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // 기본 폼 제출을 막습니다.
    const amount = parseInt(betAmount);
    if (amount > 0 && amount <= userPoints) {
      onStart(amount); // 베팅 금액으로 게임 시작
    }
  };

  const handleCancelClick = () => {
    onCancel(); // 취소 시 호출하여 주사위 게임으로 돌아감
  };

  return (
    <div className=" h-screen md:min-w-[600px] flex flex-col items-center justify-center px-12">
      <h1 className="text-[#E20100] font-jalnan text-center text-[26px] mt-4  ">
      Triple or Nothing!
        <br />
        Spin for Your Chance!
       
      </h1>

      <div className="flex flex-col items-center justify-center mt-4">
        <img
          src={Images.RPSGameExample}
          alt="RPSGameExample"
          className="w-[240px]"
        />

        <div className="flex flex-row gap-3 mt-4">
          <Popover>
            <PopoverTrigger className="flex flex-row gap-1 border-2 border-[#21212f] rounded-3xl text-center bg-white text-[#171717] font-medium w-[165px] h-[72px] items-center justify-center">
              <AiFillQuestionCircle className="w-6 h-6" />
              <p>How to play</p>
            </PopoverTrigger>
            <PopoverContent
              className="rounded-3xl border-2 border-[#21212f] bg-white"
              style={{
                maxHeight: "65vh",
                overflowY: "auto",
              }}
            >
              <div className="text-black p-4 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold text-center mb-4">
                  ✼ Game Instructions ✼
                </h2>
                <ol className="text-sm leading-loose space-y-4">
                  <li>
                    <strong>Enter Your Bet Amount</strong>
                    <ul className="list-disc pl-5">
                      <li>You can bet up to your total balance.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Play Rock-Paper-Scissors</strong>
                    <ul className="list-disc pl-5">
                      <li>Choose rock, paper, or scissors for each round.</li>
                      <li>You'll play up to 3 rounds.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Win Rewards</strong>
                    <ul className="list-disc pl-5">
                      <li>Win a round: Your bet is doubled.</li>
                      <li>Win 2 rounds in a row: Your bet is quadrupled.</li>
                      <li>Win 3 rounds in a row: Your bet is octupled.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Continue or Cash Out</strong>
                    <ul className="list-disc pl-5">
                      <li>After winning a round, you can continue or stop.</li>
                      <li>If you lose any round, you lose your bet.</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </PopoverContent>
          </Popover>
          <div className="flex flex-col gap-1 border-2 border-[#21212f] rounded-3xl text-center bg-white text-[#171717] font-medium w-[165px] h-[72px] items-center justify-center">
            <p className="text-sm text-[#737373]">My points</p>
            <div className="flex flex-row items-center justify-center gap-3">
              <img src={Images.Star} alt="star" className="w-6 h-6" />
              <p>{formatNumber(userPoints)}</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleStartClick}>
        <input
          placeholder="How many stars would you like to bet?"
          type="number"
          value={betAmount}
          onChange={handleInputChange}
          className="border-2 border-[#21212f] rounded-2xl h-12 text-sm font-medium px-4 mt-4 w-[342px]"
        />
      
        <div className="flex flex-row mt-4 gap-3">
          <button
            className="bg-gray-200 text-[#171717] rounded-full font-medium h-14 w-[165px]"
            type="button"
            onClick={handleCancelClick} // 취소 버튼 클릭 시 onCancel 호출
          >
            Cancel
          </button>
          <button
          type="submit"
            className={`${
              betAmount && parseInt(betAmount) > 0
                ? "bg-[#21212F] text-white"
                : " bg-[#21212F] opacity-70 text-white cursor-not-allowed"
            } rounded-full font-medium h-14 w-[165px]`}
            disabled={!betAmount || parseInt(betAmount) <= 0}
            onClick={handleStartClick} // 베팅 금액으로 게임 시작
          >
            Bet
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default RPSGameStart;
