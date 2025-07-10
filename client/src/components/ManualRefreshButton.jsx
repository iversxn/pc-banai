import React, { useState } from 'react';

export default function ManualRefreshButton() {
  const [status, setStatus] = useState(null);

  const refreshData = async () => {
    setStatus('Loading...');
    try {
      const res = await fetch('/api/cron/update');
      const json = await res.json();
      if (json.success) {
        setStatus('✅ Refreshed successfully!');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setStatus(`❌ Failed: ${json.error}`);
      }
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="my-4">
      <button
        onClick={refreshData}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
      >
        🔄 Manually Refresh Data
      </button>
      {status && <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{status}</p>}
    </div>
  );
}
