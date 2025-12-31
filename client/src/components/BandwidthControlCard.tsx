import { useState } from 'react';
import config from '../config/environment';

interface RouterCredentials {
  routerIp: string;
  username: string;
  password: string;
  routerType: 'auto' | 'tplink' | 'mikrotik' | 'ubiquiti' | 'dlink' | 'asus' | 'huawei' | 'other';
}

interface BandwidthSettings {
  enabled: boolean;
  maxSpeed: number;
}

interface BandwidthControlCardProps {
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const BandwidthControlCard: React.FC<BandwidthControlCardProps> = ({ addToast }) => {
  const [step, setStep] = useState<'credentials' | 'control'>('credentials');
  const [routerConnected, setRouterConnected] = useState(false);
  
  const [credentials, setCredentials] = useState<RouterCredentials>({
    routerIp: config.router.defaultIp,
    username: config.router.defaultUsername,
    password: '',
    routerType: 'auto'
  });

  const [globalSettings, setGlobalSettings] = useState<BandwidthSettings>({
    enabled: false,
    maxSpeed: 100
  });
  const [deviceSettings, setDeviceSettings] = useState<BandwidthSettings>({
    enabled: false,
    maxSpeed: 50
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  const addScanLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('id-ID');
    setScanLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleScanSecurity = async () => {
    setIsScanning(true);
    setScanResult(null);
    setScanLogs([]);
    setScanProgress(0);
    
    addScanLog('🔍 Starting router security scan...');
    addScanLog(`📡 Target: ${credentials.routerIp}`);
    addScanLog('🔐 Testing default credentials...');
    
    try {
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Scan timeout after 60 seconds')), config.security.scanTimeout)
      );

      // Simulate progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + 5, 95));
      }, 1000);

      console.log('🔒 Starting router security scan...');
      
      const scanPromise = fetch(`${config.api.baseUrl}/bandwidth/scan-router-security`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routerIp: credentials.routerIp })
      });

      // Race between scan and timeout
      const response = await Promise.race([scanPromise, timeoutPromise]) as Response;
      
      clearInterval(progressInterval);
      setScanProgress(100);
      
      const data = await response.json();
      
      console.log('✅ Security scan complete:', data);
      setScanResult(data);
      
      if (data.found) {
        addScanLog('');
        addScanLog('⚠️  VULNERABILITY FOUND!');
        addScanLog(`📝 Router: ${data.routerBrand || 'Unknown'}`);
        addScanLog(`👤 Username: ${data.credentials?.username || 'N/A'}`);
        addScanLog(`🔑 Password: ${data.credentials?.password || 'N/A'}`);
        addScanLog('');
        addScanLog('✅ Credentials auto-filled!');
        
        // If vulnerability found, auto-fill credentials
        if (data.credentials) {
          setCredentials(prev => ({
            ...prev,
            username: data.credentials.username,
            password: data.credentials.password
          }));
        }
      } else {
        addScanLog('');
        addScanLog('✅ No default credentials found');
        addScanLog('🔒 Router is secure!');
      }
      
    } catch (error: any) {
      console.error('❌ Security scan failed:', error);
      
      if (error.message?.includes('timeout')) {
        addScanLog('');
        addScanLog('⏱️  TIMEOUT!');
        addScanLog('❌ Scan took too long (>60s)');
        addScanLog('💡 Check router IP or network connection');
        
        setScanResult({
          success: false,
          message: 'Scan timeout after 60 seconds. Router may be unreachable.'
        });
      } else {
        addScanLog('');
        addScanLog('❌ Scan failed');
        addScanLog(`Error: ${error.message || 'Unknown error'}`);
        
        setScanResult({
          success: false,
          message: 'Security scan failed. Make sure router IP is correct.'
        });
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleConnectRouter = async () => {
    setIsSaving(true);
    try {
      console.log('🔌 Connecting to router:', credentials);
      const response = await fetch('/api/bandwidth/connect-router', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Router connected:', data);
        setRouterConnected(true);
        setStep('control');
        alert(`Connected to ${data.routerType || 'router'} successfully!`);
      } else {
        alert('Failed to connect: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Failed to connect to router:', error);
      alert('Failed to connect to router. Check credentials and IP.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGlobalSave = async () => {
    setIsSaving(true);
    try {
      console.log('🌍 Setting global bandwidth:', globalSettings);
      const response = await fetch('/api/bandwidth/global', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(globalSettings)
      });
      const data = await response.json();
      console.log('✅ Global bandwidth updated:', data);
      alert('Global bandwidth settings saved successfully!');
    } catch (error) {
      console.error('❌ Failed to save global bandwidth:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeviceSave = async () => {
    setIsSaving(true);
    try {
      const deviceId = 'current-device'; // In real app, get from cookie/header
      console.log('📱 Setting device bandwidth:', { deviceId, ...deviceSettings });
      const response = await fetch('/api/bandwidth/device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, ...deviceSettings })
      });
      const data = await response.json();
      console.log('✅ Device bandwidth updated:', data);
      alert('Device bandwidth settings saved successfully!');
    } catch (error) {
      console.error('❌ Failed to save device bandwidth:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Bandwidth Control</h2>
          <p className="text-gray-300 text-sm">
            {step === 'credentials' ? 'Connect to your router first' : 'Optimize WiFi kos dengan mengatur bandwidth limit'}
          </p>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
      </div>

      {/* Router Connection Form */}
      {step === 'credentials' && (
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-500/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">🔐</span>
            Router Credentials
          </h3>
          <p className="text-gray-300 text-sm mb-6">
            Enter your router admin credentials to enable bandwidth control
          </p>

          <div className="space-y-4">
            {/* Router Type */}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Router Type</label>
              <select
                value={credentials.routerType}
                onChange={(e) => setCredentials(prev => ({ ...prev, routerType: e.target.value as any }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="auto">🔍 Auto Detect</option>
                <option value="tplink">TP-Link</option>
                <option value="mikrotik">MikroTik</option>
                <option value="ubiquiti">Ubiquiti (UniFi)</option>
                <option value="dlink">D-Link</option>
                <option value="asus">ASUS</option>
                <option value="huawei">Huawei</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Router IP */}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Router IP Address</label>
              <input
                type="text"
                value={credentials.routerIp}
                onChange={(e) => setCredentials(prev => ({ ...prev, routerIp: e.target.value }))}
                placeholder="192.168.1.1"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-gray-400 text-xs mt-1">Usually 192.168.1.1 or 192.168.0.1</p>
            </div>

            {/* Username */}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Admin Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                placeholder="admin"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Admin Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter router admin password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Security Scanner Button */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-start mb-3">
                <span className="text-2xl mr-3">🔒</span>
                <div className="flex-1">
                  <h4 className="text-red-300 font-semibold text-sm mb-1">Router Security Test</h4>
                  <p className="text-gray-300 text-xs">
                    Tidak tau username/password? Test apakah router masih pakai default credentials (untuk security check)
                  </p>
                </div>
              </div>
              <button
                onClick={handleScanSecurity}
                disabled={isScanning || !credentials.routerIp}
                className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScanning ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scanning... {scanProgress}%
                  </span>
                ) : '🔍 Scan Default Credentials'}
              </button>
            </div>

            {/* Terminal Log Box */}
            {(isScanning || scanLogs.length > 0) && (
              <div className="bg-black/80 rounded-xl border border-green-500/30 shadow-2xl overflow-hidden">
                {/* Terminal Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 flex items-center border-b border-green-500/20">
                  <div className="flex space-x-2 mr-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-green-400 text-xs font-mono">
                    security-scanner.log
                  </span>
                  {isScanning && (
                    <div className="ml-auto">
                      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300"
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Terminal Body */}
                <div className="p-4 h-64 overflow-y-auto font-mono text-xs text-green-400 space-y-1 custom-scrollbar">
                  {scanLogs.length === 0 && isScanning && (
                    <div className="flex items-center space-x-2">
                      <span className="animate-pulse">▋</span>
                      <span>Initializing scanner...</span>
                    </div>
                  )}
                  {scanLogs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`${
                        log.includes('❌') || log.includes('⚠️') ? 'text-red-400' :
                        log.includes('✅') ? 'text-green-400' :
                        log.includes('💡') ? 'text-yellow-400' :
                        'text-gray-400'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                  {isScanning && (
                    <div className="flex items-center space-x-2 text-green-400">
                      <span className="animate-pulse">▋</span>
                      <span>Scanning...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Scan Result */}
            {scanResult && (
              <div className={`p-4 rounded-xl border ${
                scanResult.found 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : 'bg-green-500/10 border-green-500/30'
              }`}>
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{scanResult.found ? '⚠️' : '✅'}</span>
                  <div className="flex-1">
                    <h4 className={`font-bold text-sm mb-2 ${
                      scanResult.found ? 'text-red-300' : 'text-green-300'
                    }`}>
                      {scanResult.found ? 'VULNERABILITY FOUND!' : 'Router Secure'}
                    </h4>
                    <p className={`text-xs mb-2 ${
                      scanResult.found ? 'text-red-200' : 'text-green-200'
                    }`}>
                      {scanResult.message}
                    </p>
                    {scanResult.found && scanResult.credentials && (
                      <div className="mt-3 p-3 bg-black/30 rounded-lg">
                        <p className="text-white text-xs font-mono">
                          Username: <strong>{scanResult.credentials.username}</strong><br/>
                          Password: <strong>{scanResult.credentials.password || '(empty)'}</strong>
                        </p>
                        <p className="text-yellow-300 text-xs mt-2">
                          ⚠️ Credentials telah diisi otomatis. Klik "Connect to Router" untuk lanjut, lalu SEGERA GANTI PASSWORD!
                        </p>
                      </div>
                    )}
                    <p className="text-gray-400 text-xs mt-2">
                      Tested {scanResult.attemptCount} combinations • Router: {scanResult.routerIp}
                      {scanResult.detectedBrand && ` • Detected: ${scanResult.detectedBrand}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleConnectRouter}
              disabled={isSaving || !credentials.password}
              className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '🔄 Connecting...' : '🔌 Connect to Router'}
            </button>

            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <p className="text-yellow-200 text-xs">
                ⚠️ <strong>Security Note:</strong> Your credentials are only used to connect to the router and are not stored permanently. Make sure you're connected to the same network as the router.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bandwidth Control Interface (shown after connection) */}
      {step === 'control' && (
        <>
          {/* Connection Status */}
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <p className="text-green-400 font-semibold">Router Connected</p>
                <p className="text-gray-300 text-xs">{credentials.routerIp}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setStep('credentials');
                setRouterConnected(false);
                setCredentials(prev => ({ ...prev, password: '' }));
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-sm transition-all"
            >
              Disconnect
            </button>
          </div>

          {/* Global Bandwidth Settings */}
          <div className="mb-8 bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1 flex items-center">
              <span className="mr-2">🌍</span>
              Global Bandwidth Limit
            </h3>
            <p className="text-gray-300 text-xs">Applies to all devices on network</p>
          </div>
          <button
            onClick={() => setGlobalSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              globalSettings.enabled ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                globalSettings.enabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="mb-4">
          <label className="text-white text-sm font-semibold mb-2 block">
            Max Speed (Mbps)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="200"
              value={globalSettings.maxSpeed}
              onChange={(e) => setGlobalSettings(prev => ({ ...prev, maxSpeed: Number(e.target.value) }))}
              className="flex-1 h-3 bg-white/10 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #9333EA ${(globalSettings.maxSpeed / 200) * 100}%, rgba(255,255,255,0.1) ${(globalSettings.maxSpeed / 200) * 100}%)`,
              }}
            />
            <div className="w-20 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center font-bold">
              {globalSettings.maxSpeed}
            </div>
          </div>
        </div>

        <button
          onClick={handleGlobalSave}
          disabled={isSaving}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Apply Global Settings'}
        </button>
      </div>

      {/* Device-Specific Settings */}
      <div className="bg-gradient-to-br from-green-500/10 to-teal-600/10 border border-green-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1 flex items-center">
              <span className="mr-2">📱</span>
              This Device Only
            </h3>
            <p className="text-gray-300 text-xs">Limit bandwidth for current browser</p>
          </div>
          <button
            onClick={() => setDeviceSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              deviceSettings.enabled ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                deviceSettings.enabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="mb-4">
          <label className="text-white text-sm font-semibold mb-2 block">
            Max Speed (Mbps)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="100"
              value={deviceSettings.maxSpeed}
              onChange={(e) => setDeviceSettings(prev => ({ ...prev, maxSpeed: Number(e.target.value) }))}
              className="flex-1 h-3 bg-white/10 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #10B981 0%, #14B8A6 ${(deviceSettings.maxSpeed / 100) * 100}%, rgba(255,255,255,0.1) ${(deviceSettings.maxSpeed / 100) * 100}%)`,
              }}
            />
            <div className="w-20 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center font-bold">
              {deviceSettings.maxSpeed}
            </div>
          </div>
        </div>

        <button
          onClick={handleDeviceSave}
          disabled={isSaving}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Apply Device Settings'}
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          💡 Cara Fix WiFi Lemot di Kos
        </h4>
        <ul className="text-yellow-100/80 text-xs space-y-1 ml-6 list-disc">
          <li>Set <strong>Global Bandwidth</strong> sesuai kecepatan internet yang dibayar (misal 100 Mbps)</li>
          <li>Jika device kamu perlu prioritas, atur <strong>Device Settings</strong> lebih tinggi</li>
          <li>Test speed setelah apply settings untuk verifikasi perubahan</li>
        </ul>
      </div>
        </>
      )}
    </div>
  );
};

export default BandwidthControlCard;
