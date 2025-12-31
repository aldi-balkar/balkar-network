import { useState, useEffect } from 'react';

interface NetworkInfo {
  publicIp: string;
  localIp: string;
  userAgent: string;
  ssid: string | null;
  explanation: string;
  timestamp: string;
}

export const NetworkInfoCard: React.FC = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-fetch on mount
  useEffect(() => {
    fetchNetworkInfo();
  }, []);

  const fetchNetworkInfo = async () => {
    setLoading(true);
    try {
      console.log('🌐 Fetching network info...');
      const response = await fetch('/api/network/info');
      const data = await response.json();
      setNetworkInfo(data);
      console.log('✅ Network info loaded:', data);
    } catch (error) {
      console.error('❌ Failed to fetch network info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl h-full">
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6 gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-0.5 sm:mb-1 truncate">Network Info</h3>
          <p className="text-gray-300 text-xs truncate">Device & connection details</p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        </div>
      </div>

      {!networkInfo && !loading && (
        <div className="text-center py-6 sm:py-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <button
            onClick={fetchNetworkInfo}
            className="px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 touch-manipulation"
          >
            Get Network Info
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-6 sm:py-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-300 text-xs sm:text-sm">Loading network info...</p>
        </div>
      )}

      {networkInfo && !loading && (
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-white/5 rounded-lg md:rounded-xl p-3 sm:p-4 border border-white/10">
            <div className="text-gray-400 text-xs font-semibold mb-1.5 sm:mb-2 uppercase tracking-wide">Public IP</div>
            <div className="text-white text-base sm:text-lg font-mono break-all">{networkInfo.publicIp}</div>
          </div>

          <div className="bg-white/5 rounded-lg md:rounded-xl p-3 sm:p-4 border border-white/10">
            <div className="text-gray-400 text-xs font-semibold mb-1.5 sm:mb-2 uppercase tracking-wide">Local IP</div>
            <div className="text-white text-base sm:text-lg font-mono break-all">{networkInfo.localIp}</div>
          </div>

          <div className="bg-white/5 rounded-lg md:rounded-xl p-3 sm:p-4 border border-white/10">
            <div className="text-gray-400 text-xs font-semibold mb-1.5 sm:mb-2 uppercase tracking-wide flex items-center">
              WiFi SSID
              <span className="ml-2 text-green-400 text-xs">
                ✓
              </span>
            </div>
            <div className="text-white text-base sm:text-lg font-semibold break-all">
              {networkInfo.ssid || 'Not connected'}
            </div>
          </div>

          <div className="bg-white/5 rounded-lg md:rounded-xl p-3 sm:p-4 border border-white/10">
            <div className="text-gray-400 text-xs font-semibold mb-1.5 sm:mb-2 uppercase tracking-wide">User Agent</div>
            <div className="text-white text-xs font-mono break-all line-clamp-3">
              {networkInfo.userAgent.substring(0, 100)}...
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wide">Last Updated</div>
            <div className="text-white text-sm">
              {new Date(networkInfo.timestamp).toLocaleString()}
            </div>
          </div>

          <button
            onClick={fetchNetworkInfo}
            className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all duration-300 text-sm font-semibold"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default NetworkInfoCard;
