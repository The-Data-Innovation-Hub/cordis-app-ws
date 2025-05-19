import { APP_VERSION, VERSION_HISTORY } from '@/lib/constants/versions';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const VersionInfo = () => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="space-y-4 p-4 rounded-lg bg-white shadow-lg dark:bg-gray-800">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Version Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Frontend Version</p>
            <p className="text-lg font-medium">{APP_VERSION.frontend}</p>
          </div>
          <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Database Version</p>
            <p className="text-lg font-medium">{APP_VERSION.database}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">Last Updated: {APP_VERSION.lastUpdated}</p>
      </div>

      <button
        onClick={() => setShowHistory(!showHistory)}
        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <span>Version History</span>
        {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showHistory && (
        <div className="space-y-4">
          <div>
            <h4 className="text-md font-medium mb-2">Frontend Changes</h4>
            {VERSION_HISTORY.frontend.map((version) => (
              <div key={version.version} className="mb-3 text-sm">
                <p className="font-medium">v{version.version} - {version.date}</p>
                <ul className="list-disc list-inside pl-4 text-gray-600 dark:text-gray-400">
                  {version.changes.map((change, i) => (
                    <li key={i}>{change}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">Database Changes</h4>
            {VERSION_HISTORY.database.map((version) => (
              <div key={version.version} className="mb-3 text-sm">
                <p className="font-medium">v{version.version} - {version.date}</p>
                <ul className="list-disc list-inside pl-4 text-gray-600 dark:text-gray-400">
                  {version.changes.map((change, i) => (
                    <li key={i}>{change}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
