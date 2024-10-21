import create from 'zustand';

interface SignupState {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

const useSignupStore = create<SignupState>((set) => ({
  email: 'qopqop55@naver.com',
  password: '',
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
}));

export default useSignupStore;
