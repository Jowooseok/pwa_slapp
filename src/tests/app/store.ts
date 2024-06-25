import create from 'zustand';

interface Store {
  ethAddress: string;
  icpAddress: string;
  setEthAddress: (address: string) => void;
  setIcpAddress: (address: string) => void;
}

export const useStore = create<Store>((set) => ({
  ethAddress: '',
  icpAddress: '',
  setEthAddress: (address) => set({ ethAddress: address }),
  setIcpAddress: (address) => set({ icpAddress: address }),
}));
