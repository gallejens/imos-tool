import { create } from 'zustand';

export const useMainStore = create<Main.State & Main.StateActions>(set => ({
  error: null,
  data: {},
  setData: data => set(s => ({ ...s, data })),
  setError: error => set(s => ({ ...s, error })),
  clearError: () => set(s => ({ ...s, error: null })),
}));
