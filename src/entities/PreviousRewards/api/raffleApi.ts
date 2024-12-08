// src/entities/PreviousRewards/api/raffleApi.ts
import api from '@/shared/api/axiosInstance';

export interface RaffleInitialDataResponse {
  myRankings: Array<{
    userId: string;
    rank: number;
    slRewards: number;
    usdtRewards: number;
    nftType: string | null;
    selectedRewardType: string | null;
  }>;
  rankings: Array<{
    userId: string;
    rank: number;
    slRewards: number;
    usdtRewards: number;
    nftType: string | null;
    itsMe?: boolean;
    selectedRewardType: string | null;
  }>;
}

// 래플 초기 데이터 조회 API
export const fetchInitialRaffleAPI = async (): Promise<RaffleInitialDataResponse> => {
  const response = await api.get("/leader/raffle/initial");
  console.log("rapple = ", response);
  return response.data.data as RaffleInitialDataResponse;
};

export interface RaffleRangeRankingData {
  userId: string;
  rank: number;
  slRewards: number;
  usdtRewards: number;
  nftType: string | null;
  selectedRewardType?: string | null;
}

// 래플 범위별 랭킹 조회 API
export const fetchRaffleRangeRankingAPI = async (rangeStart: number, rangeEnd: number): Promise<RaffleRangeRankingData[]> => {
  const response = await api.post("/leader/raffle/range", { rangeStart, rangeEnd });
  return response.data.data as RaffleRangeRankingData[];
};
