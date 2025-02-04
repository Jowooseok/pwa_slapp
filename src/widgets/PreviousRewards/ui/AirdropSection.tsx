// src/widgets/PreviousRewards/ui/AirdropSection.tsx

import React from "react";
import Images from "@/shared/assets/images";
import LoadingSpinner from "@/shared/components/ui/loadingSpinner";
import ErrorMessage from "@/shared/components/ui/ErrorMessage";

/**
 * AirdropWinner: 에어드롭 당첨자 정보
 *  - rank: 1~16
 *  - userId: 유저 아이디
 *  - slRewards: 지급될 SL량
 */
interface AirdropWinner {
  rank: number;
  userId: string;
  slRewards: number;
}

/**
 * AirdropMyReward: 내 에어드롭 보상 정보
 *  - rank: 당첨된 순위 (없으면 null)
 *  - userId: 나의 아이디
 *  - slRewards: 보상 SL량
 */
interface AirdropMyReward {
  rank: number | null;
  userId: string;
  slRewards: number;
}

interface AirdropSectionProps {
  winners: AirdropWinner[];         // 최대 16명 당첨자 목록
  myReward: AirdropMyReward | null; // 내 에어드롭 보상 (없으면 null)
  isLoadingAirdrop: boolean;        // 로딩 상태
  errorAirdrop: string | null;      // 에러 메시지 (있으면 표시)
  onLoadAirdrop?: () => void;       // 필요 시 상위에서 API 다시 호출할 함수
  hasLoadedAirdrop?: boolean;       // 이미 불러왔는지 여부
}

const AirdropSection: React.FC<AirdropSectionProps> = ({
  winners,
  myReward,
  isLoadingAirdrop,
  errorAirdrop,
}) => {
  // 1) 로딩 중이면 스피너 노출
  if (isLoadingAirdrop) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <LoadingSpinner />
      </div>
    );
  }

  // 2) 에러 발생 시 에러 메시지 표시
  if (errorAirdrop) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <ErrorMessage message={errorAirdrop} />
      </div>
    );
  }

  // 3) 지난 달 에어드롭이 없거나, 내 보상/당첨자 데이터 모두 없는 경우
  if (!myReward && winners.length === 0) {
    return (
      <div className="p-6 bg-[#0D1226] text-white w-full h-svh">
        <div className="relative flex flex-col box-bg rounded-3xl border-2 border-[#0147E5] p-5 h-24 justify-center items-center">
          <p className="font-semibold text-sm text-center">
            There was no airdrop last month. <br />
            Better luck next time!
          </p>
        </div>
      </div>
    );
  }

  // 4) myReward가 존재할 때, rank가 null인지 아닌지 분기
  //   - rank != null => 당첨됨
  //   - rank == null => 당첨 실패
  const isWinner = myReward && myReward.rank !== null;

  return (
    <div className="p-6 bg-[#0D1226] text-white w-full">
      {/* 내 보상 정보 영역 */}
      {myReward ? (
        isWinner ? (
          // rank가 null이 아닌 경우 (당첨)
          <div className="relative flex flex-col box-bg rounded-3xl border-2 border-[#0147E5] p-5 gap-2">
            <p className="font-semibold text-center text-lg">
              Congratulations!
            </p>
            <p className="text-center text-sm">
              You got an airdrop of{" "}
              <span className="font-bold text-[#FDE047]">
                {myReward.slRewards.toLocaleString()} SL
              </span>{" "}
              for finishing{" "}
              <span className="font-bold text-[#FDE047]">
                #{myReward.rank}
              </span>{" "}
              in last month’s event!
            </p>
          </div>
        ) : (
          // rank가 null인 경우 (미당첨)
          <div className="relative flex flex-col box-bg rounded-3xl border-2 border-[#0147E5] p-5 h-full justify-center items-center">
            <p className="font-semibold text-sm text-center">
              You didn’t get the airdrop this time. <br />
              Better luck next time!
            </p>
          </div>
        )
      ) : (
        // 혹시라도 myReward가 undefined/null 이면 (위에서 처리했으니 거의 없겠지만)
        <></>
      )}

      {/* 당첨자 목록 (최대 16명) */}
      {winners.length > 0 && (
        <div className="flex flex-col mt-8">
          <p className="font-semibold">Airdrop Winners</p>
          {winners.map((w) => (
            <div
              key={w.rank}
              className="relative flex flex-row items-center p-4 border-b gap-4"
            >
              <p>#{w.rank}</p>
              <div className="flex flex-col gap-1">
                <p>{w.userId}</p>
                <div className="flex flex-row items-center gap-1">
                  <img
                    src={Images.TokenReward}
                    alt="token"
                    className="w-5 h-5"
                  />
                  <p className="text-sm font-semibold">
                    {w.slRewards.toLocaleString()} SL
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AirdropSection;
