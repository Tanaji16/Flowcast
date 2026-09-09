import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  activeSimulationId: string | null;
  toggleSidebar: () => void;
  setActiveSimulationId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  activeSimulationId: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveSimulationId: (id) => set({ activeSimulationId: id }),
}));
