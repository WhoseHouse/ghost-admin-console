import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSiteStore = create(
  persist(
    (set) => ({
      selectedSiteId: 'all',
      setSelectedSiteId: (id) => set({ selectedSiteId: id }),

      ddOpen: false,
      setDdOpen: (v) => set({ ddOpen: typeof v === 'function' ? v : v }),

      sidebarCollapsed: false,
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

      accent: 'coral',
      setAccent: (v) => set({ accent: v }),

      density: 'comfortable',
      setDensity: (v) => set({ density: v }),
    }),
    {
      name: 'ghost-console-prefs',
      partialize: (s) => ({
        selectedSiteId: s.selectedSiteId,
        sidebarCollapsed: s.sidebarCollapsed,
        accent: s.accent,
        density: s.density,
      }),
    }
  )
);

export default useSiteStore;
