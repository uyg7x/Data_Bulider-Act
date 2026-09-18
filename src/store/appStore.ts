import { create } from 'zustand';

interface AppState {
  currentTab: 'dashboard' | 'builder' | 'logs';
  selectedPipelineId: string | null;
  setCurrentTab: (tab: 'dashboard' | 'builder' | 'logs') => void;
  setSelectedPipelineId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentTab: 'dashboard',
  selectedPipelineId: null,
  setCurrentTab: (tab) => set({ currentTab: tab }),
  setSelectedPipelineId: (id) => set({ selectedPipelineId: id }),
}));
