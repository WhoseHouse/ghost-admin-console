import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import useSiteStore from '../store/siteStore.js';

async function fetchSites() {
  const res = await fetch('/api/sites');
  if (!res.ok) throw new Error('Failed to fetch sites');
  return res.json();
}

export default function SiteSelector() {
  const { selectedSiteId, setSelectedSiteId } = useSiteStore();
  const { data: sites = [], isLoading, isError } = useQuery({
    queryKey: ['sites'],
    queryFn: fetchSites,
  });

  // Auto-select first site when the list loads and nothing is selected yet
  useEffect(() => {
    if (sites.length > 0 && !selectedSiteId) {
      setSelectedSiteId(sites[0].id);
    }
  }, [sites, selectedSiteId, setSelectedSiteId]);

  if (isLoading) return <span className="text-sm text-gray-400">Loading sites…</span>;
  if (isError) return <span className="text-sm text-red-500">Could not load sites</span>;

  return (
    <select
      value={selectedSiteId ?? ''}
      onChange={(e) => setSelectedSiteId(e.target.value)}
      className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {sites.map((site) => (
        <option key={site.id} value={site.id}>
          {site.label}
        </option>
      ))}
    </select>
  );
}
