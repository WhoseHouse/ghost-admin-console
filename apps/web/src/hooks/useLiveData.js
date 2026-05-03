import { useQuery } from '@tanstack/react-query';
import useSiteStore from '../store/siteStore.js';

async function apiFetch(path) {
  const res = await fetch(path);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

function buildUrl(endpoint, params = {}) {
  const url = new URL(endpoint, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== 'all') url.searchParams.set(k, v);
  });
  return url.pathname + url.search;
}

// Stats: { totals: { posts, published, members, paidMembers }, sites: [...] }
export function useLiveStats() {
  const { dataSource, selectedSiteId } = useSiteStore();
  const isLive = dataSource === 'live';

  return useQuery({
    queryKey: ['stats', dataSource, selectedSiteId],
    queryFn: () => apiFetch(buildUrl('/api/data/stats', {
      siteId: selectedSiteId !== 'all' ? selectedSiteId : undefined,
    })),
    enabled: isLive,
    staleTime: 30_000,
    retry: 1,
  });
}

// Posts: array of post objects
export function useLivePosts({ status = 'all', limit = 20 } = {}) {
  const { dataSource, selectedSiteId } = useSiteStore();
  const isLive = dataSource === 'live';

  return useQuery({
    queryKey: ['posts', dataSource, selectedSiteId, status, limit],
    queryFn: () => apiFetch(buildUrl('/api/data/posts', {
      siteId: selectedSiteId !== 'all' ? selectedSiteId : undefined,
      status,
      limit,
    })),
    enabled: isLive,
    staleTime: 30_000,
    retry: 1,
  });
}

// Members: array of member objects
export function useLiveMembers({ tier = 'all', limit = 20 } = {}) {
  const { dataSource, selectedSiteId } = useSiteStore();
  const isLive = dataSource === 'live';

  return useQuery({
    queryKey: ['members', dataSource, selectedSiteId, tier, limit],
    queryFn: () => apiFetch(buildUrl('/api/data/members', {
      siteId: selectedSiteId !== 'all' ? selectedSiteId : undefined,
      tier,
      limit,
    })),
    enabled: isLive,
    staleTime: 30_000,
    retry: 1,
  });
}
