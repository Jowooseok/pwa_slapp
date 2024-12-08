import React, { useEffect, useState } from "react";
import { TopTitle } from "@/shared/components/ui";
import "./PreviousRewards.css";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import RankingSection from "@/widgets/PreviousRewards/ui/RankingSection";
import RaffleSection from "@/widgets/PreviousRewards/ui/RaffleSection";
import RewardSelectionDialog from "@/widgets/PreviousRewards/ui/RewardSelectionDialog";
import { usePreviousRewardsEntityStore } from '@/entities/PreviousRewards/model/previousRewardsModel';
import { usePreviousRewardsFeatureStore } from '@/features/PreviousRewards/model/previousRewardsModel';
import { useRaffleEntityStore } from '@/entities/PreviousRewards/model/raffleEntityModel';
import { useRaffleFeatureStore } from '@/features/PreviousRewards/model/raffleFeatureModel';

import { selectRankingReward, selectRaffleReward } from "@/features/PreviousRewards/api/rewardApi";
import { PlayerData } from "@/features/PreviousRewards/types/PlayerData";

interface RewardData {
  rank: number;
  userId: string;
  slRewards: number;
  usdtRewards: number;
  nftType: string | null;
  selectedRewardType: string | null;
}

const PreviousRewards: React.FC = () => {
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

  const [currentTab, setCurrentTab] = useState<"ranking" | "raffle">("ranking");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [currentRaffleIndex, setCurrentRaffleIndex] = useState(0);

  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [selectedMyData, setSelectedMyData] = useState<RewardData | null>(null);

  const round = 1; // 예시

  useEffect(() => {
    loadInitialRanking();
  }, [loadInitialRanking]);

  useEffect(() => {
    // 래플 탭 진입 시 데이터 없으면 로딩
    if (currentTab === "raffle") {
      if (!myRankings || myRankings.length === 0 || !raffleTopRankings || raffleTopRankings.length === 0) {
        loadInitialRaffle();
      }
    }
  }, [currentTab, loadInitialRaffle, myRankings, raffleTopRankings]);

  const handleRangeClick = async (start: number, end: number) => {
    if (currentTab === "ranking") {
      await loadRangeRanking(start, end);
    } else {
      await loadRaffleRangeRanking(start, end);
    }
    setDialogTitle(`${start}-${end}`);
    setDialogOpen(true);
  };

  const myData = myRanking && myRanking[0] ? myRanking[0] : null;
  const isReceived = myData?.selectedRewardType === "USDT" || myData?.selectedRewardType === "SL";

  const currentRaffleItem = myRankings && myRankings.length > 0 ? myRankings[currentRaffleIndex] : null;
  const raffleIsReceived = currentRaffleItem?.selectedRewardType === "USDT" || currentRaffleItem?.selectedRewardType === "SL";

  // dialogRankings, dialogRaffleRankings -> PlayerData 형태 변환
  const dialogRankingsPlayerData = dialogRankings.map(r => ({
    ...r,
    nftType: r.nftType ?? null,
    selectedRewardType: r.selectedRewardType ?? null
  }));

  const dialogRaffleRankingsPlayerData = dialogRaffleRankings.map(r => ({
    ...r,
    nftType: r.nftType ?? null,
    selectedRewardType: r.selectedRewardType ?? null
  }));

  const handleGetReward = async (data: RewardData) => {
    if (data.selectedRewardType !== null) {
      alert("Already received your reward!");
      return;
    }

    if (data.rank <= 20) {
      setSelectedMyData(data);
      setRewardDialogOpen(true);
    } else {
      await handleSelectRewardType("SL", data);
    }
  };

  const handleSelectRewardType = async (type: "USDT" | "SL", overrideData?: RewardData) => {
    const targetData = overrideData ?? selectedMyData;
    if (!targetData) return;

    let updatedData: PlayerData;
    if (currentTab === "ranking") {
      updatedData = await selectRankingReward(round, targetData.rank, type);
      // 상태 업데이트 (Zustand)
      usePreviousRewardsEntityStore.setState((state) => {
        const newMyRanking = state.myRanking ? [...state.myRanking] : [];
        if (newMyRanking.length > 0 && newMyRanking[0].rank === updatedData.rank) {
          newMyRanking[0] = { ...newMyRanking[0], selectedRewardType: updatedData.selectedRewardType };
        }

        const newTopRankings = [...state.topRankings];
        const idx = newTopRankings.findIndex(r => r.rank === updatedData.rank);
        if (idx > -1) {
          newTopRankings[idx] = { ...newTopRankings[idx], selectedRewardType: updatedData.selectedRewardType };
        }

        return {
          myRanking: newMyRanking,
          topRankings: newTopRankings
        };
      });
    } else {
      updatedData = await selectRaffleReward(round, targetData.rank, type);
      // 상태 업데이트 (Zustand)
      useRaffleEntityStore.setState((state) => {
        const newMyRankings = state.myRankings ? [...state.myRankings] : [];
        const idx = newMyRankings.findIndex(r => r.rank === updatedData.rank);
        if (idx > -1) {
          newMyRankings[idx] = { ...newMyRankings[idx], selectedRewardType: updatedData.selectedRewardType };
        }

        const newRaffleTopRankings = [...state.topRankings];
        const topIdx = newRaffleTopRankings.findIndex(r => r.rank === updatedData.rank);
        if (topIdx > -1) {
          newRaffleTopRankings[topIdx] = { ...newRaffleTopRankings[topIdx], selectedRewardType: updatedData.selectedRewardType };
        }

        return {
          myRankings: newMyRankings,
          topRankings: newRaffleTopRankings
        };
      });
    }

    alert("Reward received!");
    setSelectedMyData((prev) => prev ? { ...prev, ...updatedData } : null);
    setRewardDialogOpen(false);
  };

  // 로딩/에러 처리
  if (currentTab === "ranking") {
    if (isLoadingInitial) return <div className="text-white">Loading...</div>;
    if (errorInitial) return <div className="text-red-500">{errorInitial}</div>;
  } else {
    if (isLoadingInitialRaffle) return <div className="text-white">Loading Raffle...</div>;
    if (errorInitialRaffle) return <div className="text-red-500">{errorInitialRaffle}</div>;
  }

  return (
    <div className="flex flex-col mb-44 text-white items-center w-full">
      <TopTitle title="Last month's results" />

      <RewardSelectionDialog
        open={rewardDialogOpen}
        onClose={() => setRewardDialogOpen(false)}
        data={selectedMyData}
        onSelect={(type) => handleSelectRewardType(type)}
      />

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

        <TabsContent value="ranking">
          <RankingSection
            myData={myData ? {
              ...myData,
              nftType: myData.nftType ?? null,
              selectedRewardType: myData.selectedRewardType ?? null
            } : null}
            topRankings={topRankings.map(r => ({...r, nftType: r.nftType ?? null, selectedRewardType: r.selectedRewardType ?? null}))}
            isReceived={isReceived}
            onGetReward={() => {
              if (!myData) return;
              handleGetReward({
                rank: myData.rank,
                userId: myData.userId,
                slRewards: myData.slRewards ?? 0,
                usdtRewards: myData.usdtRewards ?? 0,
                nftType: myData.nftType ?? null,
                selectedRewardType: myData.selectedRewardType ?? null,
              });
            }}
            dialogOpen={dialogOpen}
            onDialogOpenChange={setDialogOpen}
            dialogTitle={dialogTitle}
            dialogRankings={dialogRankingsPlayerData}
            isLoadingRange={isLoadingRange}
            rangeError={rangeError}
            handleRangeClick={handleRangeClick}
          />
        </TabsContent>

        <TabsContent value="raffle">
          <RaffleSection
            myRankings={(myRankings ?? []).map(r=>({...r, nftType: r.nftType ?? null, selectedRewardType: r.selectedRewardType ?? null}))}
            raffleTopRankings={(raffleTopRankings ?? []).map(r=>({...r, nftType: r.nftType ?? null, selectedRewardType: r.selectedRewardType ?? null}))}
            currentRaffleIndex={currentRaffleIndex}
            setCurrentRaffleIndex={setCurrentRaffleIndex}
            raffleIsReceived={raffleIsReceived}
            currentRaffleItem={currentRaffleItem ? {...currentRaffleItem, nftType: currentRaffleItem.nftType ?? null, selectedRewardType: currentRaffleItem.selectedRewardType ?? null} : null}
            onGetReward={() => {
              if (!currentRaffleItem) return;
              handleGetReward({
                rank: currentRaffleItem.rank,
                userId: currentRaffleItem.userId,
                slRewards: currentRaffleItem.slRewards,
                usdtRewards: currentRaffleItem.usdtRewards,
                nftType: currentRaffleItem.nftType ?? null,
                selectedRewardType: currentRaffleItem.selectedRewardType ?? null,
              });
            }}
            dialogOpen={dialogOpen}
            onDialogOpenChange={setDialogOpen}
            dialogTitle={dialogTitle}
            dialogRaffleRankings={dialogRaffleRankingsPlayerData}
            isLoadingRaffleRange={isLoadingRaffleRange}
            raffleRangeError={raffleRangeError}
            handleRangeClick={handleRangeClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreviousRewards;
