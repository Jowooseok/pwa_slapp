// src/pages/PreviousRewards/index.tsx

import React, { useEffect, useState } from "react";
import { TopTitle } from "@/shared/components/ui";
import Images from "@/shared/assets/images";
import "./PreviousRewards.css";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { IoCaretDown } from "react-icons/io5";

// 랭킹탭용
import { usePreviousRewardsEntityStore } from '@/entities/PreviousRewards/model/previousRewardsModel';
import { usePreviousRewardsFeatureStore } from '@/features/PreviousRewards/model/previousRewardsModel';

// 래플탭용
import { useRaffleEntityStore } from '@/entities/PreviousRewards/model/raffleEntityModel';
import { useRaffleFeatureStore } from '@/features/PreviousRewards/model/raffleFeatureModel';

// Swiper 관련 import
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const PreviousRewards: React.FC = () => {
  // Ranking Tab Stores
  const {
    myRanking,
    topRankings,
    isLoadingInitial,
    errorInitial,
    loadInitialRanking,
  } = usePreviousRewardsEntityStore();

  const {
    dialogRankings,
    isLoadingRange,
    rangeError,
    loadRangeRanking,
  } = usePreviousRewardsFeatureStore();

  // Raffle Tab Stores
  const {
    myRankings,
    topRankings: raffleTopRankings,
    isLoadingInitialRaffle,
    errorInitialRaffle,
    loadInitialRaffle,
  } = useRaffleEntityStore();

  const {
    dialogRaffleRankings,
    isLoadingRaffleRange,
    raffleRangeError,
    loadRaffleRangeRanking,
  } = useRaffleFeatureStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [currentTab, setCurrentTab] = useState<"ranking" | "raffle">("ranking");

  // 래플 슬라이드 인덱스 상태
  const [currentRaffleIndex, setCurrentRaffleIndex] = useState(0);

  useEffect(() => {
    // 페이지 로드시 초기 랭킹 데이터 로딩
    loadInitialRanking();
  }, [loadInitialRanking]);

  // Raffle 탭 접근 시 초기 로딩
  useEffect(() => {
    if (currentTab === "raffle") {
      loadInitialRaffle();
    }
  }, [currentTab, loadInitialRaffle]);

  const handleGetReward = () => {
    alert("Rewarded! (예시)");
  };

  const handleRangeClick = async (start: number, end: number) => {
    if (currentTab === "ranking") {
      await loadRangeRanking(start, end);
    } else {
      await loadRaffleRangeRanking(start, end);
    }
    setDialogTitle(`${start}-${end}`);
    setDialogOpen(true);
  };

  // Ranking 탭 로딩/에러 처리
  if (currentTab === "ranking") {
    if (isLoadingInitial) {
      return <div className="text-white">Loading...</div>;
    }
    if (errorInitial) {
      return <div className="text-red-500">{errorInitial}</div>;
    }
  }

  const myData = myRanking && myRanking[0] ? myRanking[0] : null;
  const myRank = myData?.rank;
  const myUserId = myData?.userId;
  const mySl = myData?.slRewards;
  const myUsdt = myData?.usdtRewards;
  const myNft = myData?.nftType;
  const mySelectedRewardType = myData?.selectedRewardType;

  // 현재 슬라이드 된 래플 아이템
  const currentRaffleItem = myRankings && myRankings.length > 0 ? myRankings[currentRaffleIndex] : null;

  const raffleSl = currentRaffleItem?.slRewards ?? 0;
  const raffleUsdt = currentRaffleItem?.usdtRewards ?? 0;
  const raffleNft = currentRaffleItem?.nftType;
  const raffleSelectedRewardType = currentRaffleItem?.selectedRewardType;
  const raffleUserId = currentRaffleItem?.userId;
  const raffleRank = currentRaffleItem?.rank;

  return (
    <div className="flex flex-col mb-44 text-white items-center w-full">
      <TopTitle title="Last month's results" />

      <Tabs defaultValue="ranking" className=" w-full rounded-none" onValueChange={(val) => setCurrentTab(val as "ranking"|"raffle")}>
        <TabsList className="grid w-full grid-cols-2 rounded-none outline-none bg-[#0D1226]">
          <TabsTrigger
            value="ranking"
            className="rounded-none bg-[#0D1226] data-[state=active]:border-b-2 data-[state=active]:border-[#0147E5] data-[state=active]:bg-[#0D1226] text-[#A3A3A3] data-[state=active]:text-white font-normal data-[state=active]:font-semibold text-lg transition-colors border-b-2 border-transparent duration-300 ease-in-out"
          >
            Ranking
          </TabsTrigger>
          <TabsTrigger
            value="raffle"
            className="rounded-none bg-[#0D1226] data-[state=active]:border-b-2 data-[state=active]:border-[#0147E5] data-[state=active]:bg-[#0D1226] text-[#A3A3A3] data-[state=active]:text-white font-normal data-[state=active]:font-semibold text-lg transition-colors border-b-2 border-transparent duration-300 ease-in-out"
          >
            Raffle
          </TabsTrigger>
        </TabsList>

        {/* Ranking Tab */}
        <TabsContent
          value="ranking"
          className="p-6 bg-[#0D1226] text-white w-full h-full"
        >
          <div>
            {myData && myRank && (
              <>
                <p className=" font-semibold">
                  {myUserId === null
                    ? "No ranking data for you."
                    : "Congratulations! Here’s your reward : "}
                </p>
                {myUserId && (
                  <div className="flex flex-row items-center box-bg rounded-3xl h-24 border-2 border-[#0147E5] mt-3 p-5 gap-3 ">
                    <p>{myRank}</p>
                    <div className="flex flex-col gap-1">
                      <p>{myUserId}</p>
                      <div className="flex flex-row items-center gap-1">
                        <img
                          src={Images.TokenReward}
                          alt="token"
                          className="w-5 h-5"
                        />
                        <p className="text-sm font-semibold">
                          {(mySl ?? 0).toLocaleString()}{" "}
                          <span className="font-normal text-[#a3a3a3]">
                            (or {(myUsdt ?? 0).toLocaleString()} USDT)
                          </span>{" "}
                          {myNft ? `+ ${myNft} NFT` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {myUserId && (
                  <button
                    className="bg-[#0147E5] rounded-full w-full h-14 mt-3 font-medium"
                    onClick={handleGetReward}
                    disabled={mySelectedRewardType === "USDT" || mySelectedRewardType === "SL"}
                  >
                    {mySelectedRewardType === null
                      ? "Get Rewarded"
                      : `Reward Selected (${mySelectedRewardType})`}
                  </button>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col mt-8">
            {topRankings.slice(0, 20).map((r) => (
              <div
                key={r.rank}
                className="flex flex-row items-center p-4 border-b gap-4 "
              >
                <p>{r.rank}</p>
                <div className="flex flex-col gap-1">
                  <p>{r.userId}</p>
                  <div className="flex flex-row items-center gap-1">
                    <img
                      src={Images.TokenReward}
                      alt="token"
                      className="w-5 h-5"
                    />
                    <p
                      className={`text-sm font-semibold ${
                        r.itsMe ? "text-[#fde047]" : ""
                      }`}
                    >
                      {(r.slRewards ?? 0).toLocaleString()}{" "}
                      <span className="font-normal text-[#a3a3a3]">
                        (or {(r.usdtRewards ?? 0).toLocaleString()} USDT)
                      </span>{" "}
                      {r.nftType ? `+ ${r.nftType} NFT` : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14 space-y-4">
            {/* 범위별 랭킹 조회 */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger
                className="w-full"
                onClick={() => handleRangeClick(21, 100)}
              >
                <div className="flex flex-row justify-between items-center ">
                  <div className="flex flex-row items-center gap-2">
                    21-100 <IoCaretDown className={"w-5 h-5"} />
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <img
                      src={Images.TokenReward}
                      alt="token"
                      className="w-5 h-5"
                    />
                    <p className="text-sm font-semibold">
                      500{" "}
                      <span className="font-normal text-[#a3a3a3]">
                        (or 50 USDT)
                      </span>{" "}
                    </p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="text-white rounded-3xl w-[80%] md:w-full border-none bg-[#21212F] max-h-[80%] overflow-y-auto text-sm">
                <DialogHeader>
                  <DialogTitle>{dialogTitle}</DialogTitle>
                </DialogHeader>
                {isLoadingRange && <div>Loading...</div>}
                {rangeError && <div className="text-red-500">{rangeError}</div>}
                {!isLoadingRange &&
                  !rangeError &&
                  dialogRankings.map((r) => (
                    <div
                      key={r.rank}
                      className={`flex flex-row gap-10 border-b pb-2 truncate ${
                        r.userId === myUserId ? "text-[#fde047] font-bold" : ""
                      }`}
                    >
                      <p>{r.rank}</p>
                      <p>{r.userId}</p>
                    </div>
                  ))}
              </DialogContent>
            </Dialog>

            <div className="w-full border-b"></div>
            <div
              className="flex flex-row justify-between items-center  cursor-pointer"
              onClick={() => handleRangeClick(101, 500)}
            >
              <div className="flex flex-row items-center gap-2">
                101-500 <IoCaretDown className={"w-5 h-5"} />
              </div>
              <div className="flex flex-row items-center gap-1">
                <img src={Images.TokenReward} alt="token" className="w-5 h-5" />
                <p className="text-sm font-semibold">
                  25{" "}
                  <span className="font-normal text-[#a3a3a3]">
                    (or 2.5 USDT)
                  </span>{" "}
                </p>
              </div>
            </div>
            <div className="w-full border-b"></div>
            <div
              className="flex flex-row justify-between items-center cursor-pointer"
              onClick={() => handleRangeClick(501, 1000)}
            >
              <div className="flex flex-row items-center gap-2">
                501-1000 <IoCaretDown className={"w-5 h-5"} />
              </div>
              <div className="flex flex-row items-center gap-1">
                <img src={Images.TokenReward} alt="token" className="w-5 h-5" />
                <p className="text-sm font-semibold">
                  10{" "}
                  <span className="font-normal text-[#a3a3a3]">
                    (or 1 USDT)
                  </span>{" "}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Raffle Tab */}
        <TabsContent value="raffle" className="p-6 bg-[#0D1226] text-white w-full h-full">
          {isLoadingInitialRaffle && <div className="text-white">Loading Raffle...</div>}
          {errorInitialRaffle && <div className="text-red-500">{errorInitialRaffle}</div>}

          {!isLoadingInitialRaffle && !errorInitialRaffle && (
            <>
              <div>
                {myRankings && myRankings.length > 0 ? (
                  <>
                    <p className="font-semibold text-sm">
                      You’ve won {myRankings.length} tickets! Swipe to view details -&gt;
                    </p>

              
                    <div className="mt-4">
                      <Swiper
                        modules={[Pagination]}
                        // pagination.el에 원하는 셀렉터 지정
                        pagination={{
                          el: '.my-pagination',
                          clickable: true,
                        }}
                        spaceBetween={16}
                        slidesPerView={1}
                        onSlideChange={(swiper) => {
                          setCurrentRaffleIndex(swiper.activeIndex);
                        }}
                      >
                        {myRankings.map((item, index) => (
                          <SwiperSlide key={index}>
                            <div className="flex flex-col box-bg rounded-3xl border-2 border-[#0147E5] p-5 h-full justify-between ">
                              <div className="flex flex-row items-center gap-3">
                                <p>{item.rank}</p>
                                <div className="flex flex-col gap-1">
                                  <p>{item.userId}</p>
                                  <div className="flex flex-row items-center gap-1">
                                    <img
                                      src={Images.TokenReward}
                                      alt="token"
                                      className="w-5 h-5"
                                    />
                                    <p className="text-sm font-semibold">
                                      {(item.slRewards ?? 0).toLocaleString()}{" "}
                                      <span className="font-normal text-[#a3a3a3]">
                                        (or {(item.usdtRewards ?? 0).toLocaleString()} USDT)
                                      </span>{" "}
                                      {item.nftType ? `+ ${item.nftType} NFT` : ""}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                    {/**  */}
                    <div className="my-pagination w-full  flex items-center justify-center mt-4"></div>
                    {currentRaffleItem && (
                      <button
                        className="bg-[#0147E5] rounded-full w-full h-14 mt-6 font-medium"
                        onClick={handleGetReward}
                        disabled={raffleSelectedRewardType === "USDT" || raffleSelectedRewardType === "SL"}
                      >
                        {raffleSelectedRewardType === null
                          ? "Get Rewarded"
                          : `Reward Selected (${raffleSelectedRewardType})`}
                      </button>
                    )}
                  </>
                ) : (
                  <p>No raffle data for you.</p>
                )}
              </div>

              <div className="flex flex-col mt-8">
                {raffleTopRankings.slice(0, 20).map((r) => (
                  <div
                    key={r.rank}
                    className="flex flex-row items-center p-4 border-b gap-4 "
                  >
                    <p>{r.rank}</p>
                    <div className="flex flex-col gap-1">
                      <p>{r.userId}</p>
                      <div className="flex flex-row items-center gap-1">
                        <img
                          src={Images.TokenReward}
                          alt="token"
                          className="w-5 h-5"
                        />
                        <p
                          className={`text-sm font-semibold ${
                            r.itsMe ? "text-[#fde047]" : ""
                          }`}
                        >
                          {(r.slRewards ?? 0).toLocaleString()}{" "}
                          <span className="font-normal text-[#a3a3a3]">
                            (or {(r.usdtRewards ?? 0).toLocaleString()} USDT)
                          </span>{" "}
                          {r.nftType ? `+ ${r.nftType} NFT` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className=" mt-14 space-y-4">
                {/* 범위별 래플 조회 */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger
                    className="w-full"
                    onClick={() => handleRangeClick(21, 100)}
                  >
                    <div className="flex flex-row justify-between items-center ">
                      <div className="flex flex-row items-center gap-2">
                        21-100 <IoCaretDown className={"w-5 h-5"} />
                      </div>
                      <div className="flex flex-row items-center gap-1">
                        <img
                          src={Images.TokenReward}
                          alt="token"
                          className="w-5 h-5"
                        />
                        <p className="text-sm font-semibold">
                          500{" "}
                          <span className="font-normal text-[#a3a3a3]">
                            (or 50 USDT)
                          </span>{" "}
                        </p>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="text-white rounded-3xl w-[80%] md:w-full border-none bg-[#21212F] max-h-[80%] overflow-y-auto text-sm">
                    <DialogHeader>
                      <DialogTitle>{dialogTitle}</DialogTitle>
                    </DialogHeader>
                    {isLoadingRaffleRange && <div>Loading...</div>}
                    {raffleRangeError && <div className="text-red-500">{raffleRangeError}</div>}
                    {!isLoadingRaffleRange &&
                      !raffleRangeError &&
                      dialogRaffleRankings.map((r) => (
                        <div
                          key={r.rank}
                          className={`flex flex-row gap-10 border-b pb-2 truncate ${
                            myRankings?.some((m) => m.userId === r.userId)
                              ? "text-[#fde047] font-bold"
                              : ""
                          }`}
                        >
                          <p>{r.rank}</p>
                          <p>{r.userId}</p>
                        </div>
                      ))}
                  </DialogContent>
                </Dialog>

                <div className="w-full border-b"></div>
                <div
                  className="flex flex-row justify-between items-center  cursor-pointer"
                  onClick={() => handleRangeClick(101, 500)}
                >
                  <div className="flex flex-row items-center gap-2">
                    101-500 <IoCaretDown className={"w-5 h-5"} />
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <img src={Images.TokenReward} alt="token" className="w-5 h-5" />
                    <p className="text-sm font-semibold">
                      25{" "}
                      <span className="font-normal text-[#a3a3a3]">
                        (or 2.5 USDT)
                      </span>{" "}
                    </p>
                  </div>
                </div>
                <div className="w-full border-b"></div>
                <div
                  className="flex flex-row justify-between items-center cursor-pointer"
                  onClick={() => handleRangeClick(501, 1000)}
                >
                  <div className="flex flex-row items-center gap-2">
                    501-1000 <IoCaretDown className={"w-5 h-5"} />
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <img src={Images.TokenReward} alt="token" className="w-5 h-5" />
                    <p className="text-sm font-semibold">
                      10{" "}
                      <span className="font-normal text-[#a3a3a3]">
                        (or 1 USDT)
                      </span>{" "}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreviousRewards;
