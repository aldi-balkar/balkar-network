import { useState } from 'react';
import config from '../config/environment';

interface Device {
  ip: string;
  mac: string;
  hostname?: string;
  vendor?: string;
  isCurrentDevice?: boolean;
}

interface ConnectedDevicesCardProps {
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ConnectedDevicesCard: React.FC<ConnectedDevicesCardProps> = ({ addToast }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [totalDevices, setTotalDevices] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const handleScanDevices = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setDevices([]);
    setTotalDevices(0);

    try {
      console.log('[DEVICE SCANNER] Starting device scan');
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + 2, 95));
      }, 200);

      const response = await fetch(`${config.api.baseUrl}/network/scan-devices`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      clearInterval(progressInterval);
      setScanProgress(100);

      const data = await response.json();

      if (data.success && data.devices) {
        console.log('[DEVICE SCANNER] Scan complete:', data.devices);
        setDevices(data.devices);
        setTotalDevices(data.devices.length);
        addToast(`Found ${data.devices.length} device(s) on network`, 'success');
      } else {
        console.error('[DEVICE SCANNER] Scan failed:', data.error);
        addToast('Failed to scan network', 'error');
      }

    } catch (error: any) {
      console.error('[DEVICE SCANNER] Error:', error);
      addToast('Network scan failed', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const getDeviceIcon = (device: Device) => {
    const vendor = device.vendor?.toLowerCase() || '';
    const hostname = device.hostname?.toLowerCase() || '';
    
    // Router/Gateway
    if (device.ip.endsWith('.1') || hostname.includes('router') || hostname.includes('gateway')) {
      return '🌐';
    }
    // Apple devices
    if (vendor.includes('apple') || hostname.includes('iphone') || hostname.includes('ipad') || hostname.includes('macbook')) {
      return '🍎';
    }
    // Android/Samsung
    if (vendor.includes('samsung') || vendor.includes('xiaomi') || vendor.includes('oppo') || hostname.includes('android')) {
      return '📱';
    }
    // Computer/Laptop
    if (hostname.includes('pc') || hostname.includes('laptop') || hostname.includes('desktop')) {
      return '💻';
    }
    // TV/Smart devices
    if (hostname.includes('tv') || vendor.includes('lg') || vendor.includes('sony')) {
      return '📺';
    }
    // IoT/Smart home
    if (hostname.includes('alexa') || hostname.includes('google') || hostname.includes('nest')) {
      return '🏠';
    }
    // Default
    return '📱';
  };

  const getDeviceType = (device: Device) => {
    const vendor = device.vendor?.toLowerCase() || '';
    const hostname = device.hostname?.toLowerCase() || '';
    
    if (device.ip.endsWith('.1') || hostname.includes('router') || hostname.includes('gateway')) {
      return 'Router / Gateway';
    }
    if (vendor.includes('apple') || hostname.includes('iphone') || hostname.includes('ipad') || hostname.includes('macbook')) {
      return 'Apple Device';
    }
    if (vendor.includes('samsung')) return 'Samsung Device';
    if (vendor.includes('xiaomi')) return 'Xiaomi Device';
    if (vendor.includes('oppo')) return 'Oppo Device';
    if (vendor.includes('tp-link')) return 'TP-Link Device';
    if (hostname.includes('android')) return 'Android Device';
    if (hostname.includes('pc') || hostname.includes('laptop') || hostname.includes('desktop')) {
      return 'Computer';
    }
    if (hostname.includes('tv')) return 'Smart TV';
    if (hostname.includes('alexa') || hostname.includes('google') || hostname.includes('nest')) {
      return 'Smart Home Device';
    }
    if (device.vendor) return `${device.vendor} Device`;
    return 'Unknown Device';
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
      .then(() => addToast(`✅ ${label} copied!`, 'success'))
      .catch(() => addToast('❌ Failed to copy', 'error'));
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
      {/* Header - Responsive */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8 gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 truncate">
            Connected Devices
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm truncate">
            Lihat siapa saja yang konek ke WiFi kamu
          </p>
        </div>
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      {/* Scan Button */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={handleScanDevices}
          disabled={isScanning}
          className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-sm sm:text-base rounded-lg sm:rounded-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none touch-manipulation"
        >
          {isScanning ? (
            <span className="flex items-center justify-center space-x-2 sm:space-x-3">
              <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Scanning Network... {scanProgress}%</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>🔍 Scan Devices on Network</span>
            </span>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {isScanning && (
        <div className="mb-4 sm:mb-6">
          <div className="bg-white/10 rounded-full h-2 sm:h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-400 text-xs sm:text-sm mt-2">
            Scanning local network for devices...
          </p>
        </div>
      )}

      {/* Info Banner */}
      <div className="mb-4 sm:mb-6 bg-purple-500/10 border border-purple-500/30 rounded-lg md:rounded-xl p-3 sm:p-4">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <span className="text-lg sm:text-xl">ℹ️</span>
          <div className="flex-1 min-w-0">
            <p className="text-purple-200 text-xs sm:text-sm">
              <strong>Network Scanner:</strong> Tool ini akan scan semua perangkat yang terhubung ke WiFi yang sama dengan kamu.
              Cocok untuk cek apakah ada orang lain yang nebeng WiFi!
            </p>
          </div>
        </div>
      </div>

      {/* Devices List */}
      {devices.length > 0 && (
        <>
          {/* Summary */}
          <div className="mb-4 sm:mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 rounded-lg md:rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2">
                  {totalDevices}
                </div>
                <div className="text-purple-300 text-sm sm:text-base">
                  Device{totalDevices > 1 ? 's' : ''} Connected
                </div>
              </div>
              <div className="text-right">
                <div className="text-purple-200 text-xs sm:text-sm">
                  ✓ Scan Complete
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {new Date().toLocaleTimeString('id-ID')}
                </div>
              </div>
            </div>
          </div>

          {/* Device Cards */}
          <div className="space-y-3 sm:space-y-4">
            {devices.map((device, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br border rounded-lg md:rounded-xl p-3 sm:p-4 md:p-5 transition-all duration-300 cursor-pointer ${
                  device.isCurrentDevice
                    ? 'from-cyan-500/20 to-blue-500/20 border-cyan-500/50 hover:border-cyan-500/70'
                    : 'from-white/5 to-white/10 border-white/20 hover:border-purple-500/40'
                } ${selectedDevice === device ? 'ring-2 ring-purple-500' : 'hover:scale-[1.01]'}`}
                onClick={() => setSelectedDevice(selectedDevice === device ? null : device)}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg sm:rounded-xl flex items-center justify-center text-2xl sm:text-3xl">
                      {getDeviceIcon(device)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white font-bold text-sm sm:text-base md:text-lg truncate">
                          {device.hostname || 'Unknown Device'}
                        </h3>
                        {device.vendor && (
                          <p className="text-gray-400 text-xs sm:text-sm mt-0.5 truncate">
                            {device.vendor}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {device.isCurrentDevice && (
                          <span className="flex-shrink-0 px-2 sm:px-3 py-1 bg-cyan-500/30 text-cyan-300 text-xs font-bold rounded-full border border-cyan-500/50 whitespace-nowrap">
                            You
                          </span>
                        )}
                        <svg 
                          className={`w-5 h-5 text-purple-400 transition-transform ${selectedDevice === device ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Always visible details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {/* IP Address */}
                      <div className="bg-black/30 rounded-lg p-2 sm:p-3">
                        <div className="text-gray-400 text-xs mb-1">IP Address</div>
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-white text-xs sm:text-sm font-mono truncate">
                            {device.ip}
                          </code>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(device.ip, 'IP Address');
                            }}
                            className="flex-shrink-0 text-purple-400 hover:text-purple-300 transition-colors touch-manipulation"
                            title="Copy IP"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* MAC Address */}
                      <div className="bg-black/30 rounded-lg p-2 sm:p-3">
                        <div className="text-gray-400 text-xs mb-1">MAC Address</div>
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-white text-xs sm:text-sm font-mono truncate">
                            {device.mac}
                          </code>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(device.mac, 'MAC Address');
                            }}
                            className="flex-shrink-0 text-purple-400 hover:text-purple-300 transition-colors touch-manipulation"
                            title="Copy MAC"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Device Details Menu */}
                    {selectedDevice === device && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-fadeIn">
                        <h4 className="text-purple-300 font-semibold text-sm mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Device Information
                        </h4>

                        <div className="grid grid-cols-1 gap-2">
                          {/* Device Type */}
                          <div className="bg-black/20 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Device Type</span>
                              <span className="text-white text-sm font-medium">
                                {getDeviceType(device)}
                              </span>
                            </div>
                          </div>

                          {/* Connection Status */}
                          <div className="bg-black/20 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Status</span>
                              <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Online
                              </span>
                            </div>
                          </div>

                          {/* Hostname */}
                          {device.hostname && (
                            <div className="bg-black/20 rounded-lg p-3">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-gray-400 text-xs">Hostname</span>
                                <code className="text-white text-xs font-mono truncate max-w-[60%] text-right">
                                  {device.hostname}
                                </code>
                              </div>
                            </div>
                          )}

                          {/* MAC Vendor */}
                          {device.vendor && (
                            <div className="bg-black/20 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-xs">Manufacturer</span>
                                <span className="text-white text-sm font-medium">
                                  {device.vendor}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* MAC Prefix */}
                          <div className="bg-black/20 rounded-lg p-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-gray-400 text-xs">MAC Prefix</span>
                              <code className="text-purple-300 text-xs font-mono">
                                {device.mac.substring(0, 8)}
                              </code>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`http://${device.ip}`, '_blank');
                            }}
                            className="flex-1 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-xs sm:text-sm font-medium transition-colors border border-purple-500/40 touch-manipulation"
                          >
                            🌐 Open in Browser
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(`IP: ${device.ip}\nMAC: ${device.mac}\nVendor: ${device.vendor || 'Unknown'}`, 'Device Info');
                            }}
                            className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-xs sm:text-sm font-medium transition-colors border border-blue-500/40 touch-manipulation"
                          >
                            📋 Copy All Info
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!isScanning && devices.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
            <span className="text-4xl sm:text-5xl">📡</span>
          </div>
          <h3 className="text-white text-base sm:text-lg font-semibold mb-2">
            No Devices Scanned Yet
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto">
            Click the "Scan Devices" button above to discover all devices connected to your WiFi network
          </p>
        </div>
      )}

      {/* Help */}
      <div className="mt-6 sm:mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-lg md:rounded-xl p-3 sm:p-4">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <span className="text-lg sm:text-xl flex-shrink-0">💡</span>
          <div className="flex-1 min-w-0">
            <h4 className="text-yellow-300 font-semibold text-xs sm:text-sm mb-1 sm:mb-2">Tips:</h4>
            <ul className="text-yellow-100/80 text-xs sm:text-sm space-y-1 list-disc ml-4">
              <li>Scan ini hanya mendeteksi device yang <strong>online</strong> di jaringan saat ini</li>
              <li>Device yang <strong>sleep/mati</strong> tidak akan terdeteksi</li>
              <li>Vendor ditentukan dari <strong>MAC address</strong> (OUI Database)</li>
              <li>Device dengan badge "You" adalah perangkat kamu saat ini</li>
              <li><strong>Klik device</strong> untuk melihat detail lengkap dan opsi tambahan</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConnectedDevicesCard;
