// src/entities/PreviousRewards/model/raffleEntityModel.ts
import create from 'zustand';
import { fetchInitialRaffleAPI, RaffleInitialDataResponse } from '../api/raffleApi';

interface RaffleEntityState {
  myRankings: RaffleInitialDataResponse['myRankings'] | null;
  topRankings: RaffleInitialDataResponse['rankings'];
  isLoadingInitialRaffle: boolean;
  errorInitialRaffle: string | null;
  loadInitialRaffle: () => Promise<void>;
}

export const useRaffleEntityStore = create<RaffleEntityState>((set) => ({
  myRankings: null,
  topRankings: [],
  isLoadingInitialRaffle: false,
  errorInitialRaffle: null,
  loadInitialRaffle: async () => {
    set({ isLoadingInitialRaffle: true, errorInitialRaffle: null });
    try {
      const { myRankings, rankings } = await fetchInitialRaffleAPI();
      set({
        myRankings,
        topRankings: rankings,
        isLoadingInitialRaffle: false,
        errorInitialRaffle: null,
      });
    } catch (error: any) {
      set({
        isLoadingInitialRaffle: false,
        errorInitialRaffle: error.message || 'Failed to load initial raffle data',
      });
    }
  },
}));
