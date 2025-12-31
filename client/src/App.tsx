import { useState } from 'react';
import { SpeedTestCard } from './components/SpeedTestCard';
import { NetworkInfoCard } from './components/NetworkInfoCard';
import { BandwidthControlCard } from './components/BandwidthControlCard';
import { DiagnosticsCard } from './components/DiagnosticsCard';
import { ConnectedDevicesCard } from './components/ConnectedDevicesCard';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';
import config from './config/environment';

function App() {
  const [activeTab, setActiveTab] = useState<'speedtest' | 'bandwidth' | 'diagnostics' | 'devices'>('speedtest');
  const { toasts, addToast, removeToast } = useToast();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cyan Glow Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-400 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header - Responsive */}
      <header className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg btn-cyan-glow flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight text-cyan-glow truncate">
                  {config.app.name}
                </h1>
                <p className="text-xs sm:text-sm text-cyan-200 mt-0.5 truncate hidden sm:block">
                  {config.app.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <span className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 bg-cyan-500/20 text-cyan-300 rounded-full text-xs sm:text-sm font-semibold border border-cyan-500/40 backdrop-blur-sm">
                <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full mr-1 sm:mr-2 animate-pulse"></span>
                <span className="hidden sm:inline">Connected</span>
                <span className="sm:hidden">●</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Responsive */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Info Banner - Responsive */}
        <div className="mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/30 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl card-glow">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="flex-shrink-0 mt-0.5 sm:mt-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-cyan-300 mb-1.5 sm:mb-2">
                🏠 WiFi Network Management & Diagnostics
              </h3>
              <p className="text-cyan-100/90 text-xs sm:text-sm leading-relaxed">
                Comprehensive WiFi management tool to <strong>diagnose and optimize your network</strong>. 
                Test speed, analyze network quality, scan router security, and export professional reports.
              </p>
              <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                <span className="px-2 py-1 sm:px-3 text-cyan-300 text-xs font-semibold rounded-full bg-cyan-500/20 border border-cyan-500/40">
                  ✓ Real Speed Test
                </span>
                <span className="px-2 py-1 sm:px-3 text-blue-300 text-xs font-semibold rounded-full bg-blue-500/20 border border-blue-500/40">
                  🔒 Security Scanner
                </span>
                <span className="px-2 py-1 sm:px-3 text-cyan-200 text-xs font-semibold rounded-full bg-cyan-400/20 border border-cyan-400/40">
                  📊 Network Diagnostics
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation - Responsive */}
        <div className="mb-4 sm:mb-6 md:mb-8 overflow-x-auto scrollbar-hide">
          <div className="bg-black/20 backdrop-blur-xl rounded-xl md:rounded-2xl p-1.5 sm:p-2 inline-flex min-w-full sm:min-w-0 border border-cyan-500/20 shadow-2xl">
            <button
              onClick={() => setActiveTab('speedtest')}
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap flex-1 sm:flex-none ${
                activeTab === 'speedtest'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg btn-cyan-glow'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center justify-center space-x-1.5 sm:space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="hidden xs:inline">Speed Test</span>
                <span className="xs:hidden">Speed</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('bandwidth')}
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap flex-1 sm:flex-none ${
                activeTab === 'bandwidth'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg btn-cyan-glow'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center justify-center space-x-1.5 sm:space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span className="hidden xs:inline">Router Security</span>
                <span className="xs:hidden">Security</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap flex-1 sm:flex-none ${
                activeTab === 'diagnostics'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg btn-cyan-glow'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center justify-center space-x-1.5 sm:space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden xs:inline">Diagnostics</span>
                <span className="xs:hidden">Diag</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('devices')}
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap flex-1 sm:flex-none ${
                activeTab === 'devices'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg btn-cyan-glow'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center justify-center space-x-1.5 sm:space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <span className="hidden xs:inline">Connected Devices</span>
                <span className="xs:hidden">Devices</span>
              </span>
            </button>
          </div>
        </div>

        {/* Content Area - Responsive */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {activeTab === 'speedtest' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div className="lg:col-span-2">
                <SpeedTestCard />
              </div>
              <div className="lg:col-span-1">
                <NetworkInfoCard />
              </div>
            </div>
          )}

          {activeTab === 'bandwidth' && (
            <BandwidthControlCard addToast={addToast} />
          )}

          {activeTab === 'diagnostics' && (
            <DiagnosticsCard addToast={addToast} />
          )}

          {activeTab === 'devices' && (
            <ConnectedDevicesCard addToast={addToast} />
          )}
        </div>

        {/* Help Section - Responsive */}
        <div className="mt-6 sm:mt-8 bg-black/20 backdrop-blur-xl border border-cyan-500/20 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl card-glow">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Use
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-black/30 rounded-lg md:rounded-xl p-3 sm:p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl">⚡</span>
              </div>
              <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Speed Test</h4>
              <p className="text-xs sm:text-sm text-gray-300">Click "Start Test" to check real-time internet speed with download and upload tests.</p>
            </div>
            <div className="bg-black/30 rounded-lg md:rounded-xl p-3 sm:p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl">🔒</span>
              </div>
              <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Router Security</h4>
              <p className="text-xs sm:text-sm text-gray-300">Scan router for default credentials and security vulnerabilities.</p>
            </div>
            <div className="bg-black/30 rounded-lg md:rounded-xl p-3 sm:p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-400/20 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl">🔍</span>
              </div>
              <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Diagnostics</h4>
              <p className="text-xs sm:text-sm text-gray-300">Analyze WiFi issues and get recommendations with exportable reports.</p>
            </div>
            <div className="bg-black/30 rounded-lg md:rounded-xl p-3 sm:p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl">📱</span>
              </div>
              <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Connected Devices</h4>
              <p className="text-xs sm:text-sm text-gray-300">Scan and identify all devices connected to your WiFi network.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default App;
