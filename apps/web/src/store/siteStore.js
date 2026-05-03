import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSiteStore = create(
  persist(
    (set) => ({
      selectedSiteId: 'all',
      setSelectedSiteId: (id) => set({ selectedSiteId: id }),

      ddOpen: false,
      setDdOpen: (v) => set({ ddOpen: v }),

      sidebarCollapsed: false,
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

      accent: 'coral',
      setAccent: (v) => set({ accent: v }),

      density: 'comfortable',
      setDensity: (v) => set({ density: v }),

      // 'live' uses sites.json / .env; 'mock' uses hardcoded demo data
      dataSource: 'live',
      setDataSource: (v) => set({ dataSource: v }),
    }),
    {
      name: 'ghost-console-prefs',
      partialize: (s) => ({
        selectedSiteId: s.selectedSiteId,
        sidebarCollapsed: s.sidebarCollapsed,
        accent: s.accent,
        density: s.density,
        dataSource: s.dataSource,
      }),
    }
  )
);

export default useSiteStore;
