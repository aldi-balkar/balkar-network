import { useState } from 'react';

interface SpeedTestResult {
  ping: number;
  downloadSpeed: number;
  uploadSpeed: number;
  timestamp?: Date;
}

type TestStage = 'idle' | 'ping' | 'download' | 'upload' | 'complete';

export const SpeedTestCard: React.FC = () => {
  const [stage, setStage] = useState<TestStage>('idle');
  const [result, setResult] = useState<SpeedTestResult | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [progress, setProgress] = useState(0);

  const startTest = async () => {
    setStage('ping');
    setProgress(0);
    setResult(null);

    try {
      // Stage 1: Ping Test
      console.log('📡 Stage 1: Testing ping...');
      const pingStart = performance.now();
      await fetch('/api/network/info');
      const pingEnd = performance.now();
      const ping = Math.round(pingEnd - pingStart);
      setProgress(33);

      await new Promise(resolve => setTimeout(resolve, 500));

      // Stage 2: Download Test
      setStage('download');
      console.log('⬇️ Stage 2: Testing download speed...');
      const downloadSpeed = await testDownloadSpeed();
      setProgress(66);

      await new Promise(resolve => setTimeout(resolve, 500));

      // Stage 3: Upload Test
      setStage('upload');
      console.log('⬆️ Stage 3: Testing upload speed...');
      const uploadSpeed = await testUploadSpeed();
      setProgress(100);

      // Complete
      setStage('complete');
      const finalResult: SpeedTestResult = {
        ping,
        downloadSpeed,
        uploadSpeed,
        timestamp: new Date()
      };
      setResult(finalResult);
      console.log('✅ Speed test complete:', finalResult);

    } catch (error) {
      console.error('❌ Speed test failed:', error);
      setStage('idle');
      alert('Speed test failed. Please try again.');
    }
  };

  const testDownloadSpeed = async (): Promise<number> => {
    const startTime = performance.now();
    let totalBytes = 0;

    // Test download with multiple requests
    for (let i = 0; i < 5; i++) {
      try {
        const response = await fetch('/api/speedtest/download', {
          method: 'GET',
          cache: 'no-cache'
        });
        const data = await response.blob();
        totalBytes += data.size;

        // Update speed in real-time
        const elapsed = (performance.now() - startTime) / 1000; // seconds
        const mbps = (totalBytes * 8) / (elapsed * 1000000); // Convert to Mbps
        setCurrentSpeed(Math.round(mbps * 10) / 10);

        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Download test error:', error);
      }
    }

    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000; // seconds
    const speedMbps = (totalBytes * 8) / (duration * 1000000); // Mbps

    return Math.round(speedMbps * 10) / 10;
  };

  const testUploadSpeed = async (): Promise<number> => {
    const startTime = performance.now();
    const testData = new Blob([new ArrayBuffer(1024 * 100)]); // 100KB
    let totalBytes = 0;

    // Test upload with multiple requests
    for (let i = 0; i < 5; i++) {
      try {
        await fetch('/api/speedtest/upload', {
          method: 'POST',
          body: testData,
          headers: {
            'Content-Type': 'application/octet-stream'
          }
        });
        totalBytes += testData.size;

        // Update speed in real-time
        const elapsed = (performance.now() - startTime) / 1000;
        const mbps = (totalBytes * 8) / (elapsed * 1000000);
        setCurrentSpeed(Math.round(mbps * 10) / 10);

        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Upload test error:', error);
      }
    }

    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000;
    const speedMbps = (totalBytes * 8) / (duration * 1000000);

    return Math.round(speedMbps * 10) / 10;
  };

  const resetTest = () => {
    setStage('idle');
    setResult(null);
    setCurrentSpeed(0);
    setProgress(0);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
      {/* Header - Responsive */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8 gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 truncate">Internet Speed Test</h2>
          <p className="text-gray-300 text-xs sm:text-sm truncate">
            Real-time speed test mirip Speedtest.net
          </p>
        </div>
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      {/* Main Speed Display - Responsive */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        {stage === 'idle' && !result && (
          <div className="py-6 sm:py-8 md:py-12">
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-4 sm:mb-5 md:mb-6 relative">
              <svg className="transform -rotate-90 w-full h-full">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-1 sm:mb-2">⚡</div>
                  <div className="text-white text-sm sm:text-base md:text-lg font-semibold">Ready</div>
                </div>
              </div>
            </div>
            <button
              onClick={startTest}
              className="px-6 sm:px-8 md:px-12 py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-sm sm:text-base md:text-lg rounded-full hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span className="flex items-center justify-center space-x-1.5 sm:space-x-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold">START TEST</span>
              </span>
            </button>
          </div>
        )}

        {(stage === 'ping' || stage === 'download' || stage === 'upload') && (
          <div className="py-6 sm:py-8 md:py-12">
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-4 sm:mb-5 md:mb-6 relative">
              <svg className="transform -rotate-90 w-full h-full">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(progress / 100) * 553} 553`}
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#9333EA" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">
                    {stage === 'download' || stage === 'upload' ? currentSpeed : '...'}
                  </div>
                  <div className="text-gray-300 text-sm sm:text-base md:text-lg">
                    {stage === 'ping' && 'Testing Ping'}
                    {stage === 'download' && 'Mbps ⬇️'}
                    {stage === 'upload' && 'Mbps ⬆️'}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-white text-xs sm:text-sm font-semibold animate-pulse">
              {stage === 'ping' && '📡 Measuring latency...'}
              {stage === 'download' && '⬇️ Testing download speed...'}
              {stage === 'upload' && '⬆️ Testing upload speed...'}
            </div>
          </div>
        )}

        {stage === 'complete' && result && (
          <div className="py-4 sm:py-6 md:py-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/40 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6">
                <div className="text-blue-400 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">PING</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-0.5 sm:mb-1">{result.ping}</div>
                <div className="text-blue-300 text-xs">milliseconds</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/40 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6">
                <div className="text-green-400 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">DOWNLOAD</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-0.5 sm:mb-1">{result.downloadSpeed}</div>
                <div className="text-green-300 text-xs">Mbps</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/40 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6">
                <div className="text-purple-400 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">UPLOAD</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-0.5 sm:mb-1">{result.uploadSpeed}</div>
                <div className="text-purple-300 text-xs">Mbps</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={startTest}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-sm sm:text-base rounded-lg sm:rounded-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 touch-manipulation"
              >
                Test Again
              </button>
              <button
                onClick={resetTest}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm sm:text-base rounded-lg sm:rounded-xl active:scale-95 transition-all duration-300 touch-manipulation"
              >
                Reset
              </button>
            </div>

            {result.timestamp && (
              <div className="mt-3 sm:mt-4 text-gray-400 text-xs">
                Tested at {result.timestamp.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar - Responsive */}
      {stage !== 'idle' && stage !== 'complete' && (
        <div className="mt-4 sm:mt-5 md:mt-6">
          <div className="bg-white/10 rounded-full h-1.5 sm:h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Info - Responsive */}
      <div className="mt-4 sm:mt-5 md:mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg md:rounded-xl p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-blue-200">
          <strong>💡 How it works:</strong> Test menggunakan real download/upload requests ke server untuk mengukur kecepatan internet aktual kamu.
        </p>
      </div>
    </div>
  );
};

export default SpeedTestCard;
