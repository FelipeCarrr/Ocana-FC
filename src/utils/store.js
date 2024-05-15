import { create } from "zustand";

export const useStore = create((set) => ({
  logged: false,
  loading: false,
  loadingValue: 0,
  loadingItem: "",
  ChangeLogged: (value) => set((state) => ({ logged: value })),
  ChangeLoading: (value) => set((state) => ({ loading: value })),
  ChangeLoadingValue: (value) => set((state) => ({ loadingValue: value })),
  ChangeLoadingItem: (value) => set((state) => ({ loadingItem: value })),
}));
