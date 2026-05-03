import useSiteStore from '../store/siteStore.js';

export default function Dashboard() {
  const selectedSiteId = useSiteStore((s) => s.selectedSiteId);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-500 text-sm">
        Active site: <code className="bg-gray-100 px-1 rounded">{selectedSiteId ?? '—'}</code>
      </p>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {['Posts', 'Members', 'Newsletter'].map((label) => (
          <div key={label} className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}
