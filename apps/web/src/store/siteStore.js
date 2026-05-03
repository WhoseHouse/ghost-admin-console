import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSiteStore = create(
  persist(
    (set) => ({
      selectedSiteId: null,
      setSelectedSiteId: (id) => set({ selectedSiteId: id }),
    }),
    { name: 'ghost-console-site' }
  )
);

export default useSiteStore;
