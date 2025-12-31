import { useState, useEffect, useRef } from 'react';
import { generateDiagnosticPDF, generateShareText } from '../utils/pdfGenerator';
import html2canvas from 'html2canvas';
import config from '../config/environment';

interface DiagnosticResult {
  category: string;
  status: 'good' | 'warning' | 'error';
  message: string;
  details?: string;
  recommendation?: string;
  duration?: number;
}

interface NetworkInfo {
  publicIp: string;
  localIp: string;
  wifiSSID: string;
}

interface DiagnosticsCardProps {
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const DiagnosticsCard: React.FC<DiagnosticsCardProps> = ({ addToast }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    publicIp: '',
    localIp: '',
    wifiSSID: ''
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  // Fetch network info on mount
  useEffect(() => {
    fetch('/api/network/info')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNetworkInfo({
            publicIp: data.publicIp || '',
            localIp: data.localIp || '',
            wifiSSID: data.wifiSSID || ''
          });
        }
      })
      .catch(err => console.error('Failed to fetch network info:', err));
  }, []);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    try {
      console.log('🔧 Starting network diagnostics...');
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 95));
      }, 500);

      const response = await fetch('/api/diagnostics/run');
      const data = await response.json();

      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        console.log('✅ Diagnostics complete:', data.results);
        setResults(data.results);
      } else {
        console.error('❌ Diagnostics failed:', data.error);
        setResults([{
          category: 'Error',
          status: 'error',
          message: 'Failed to run diagnostics: ' + data.error
        }]);
      }

    } catch (error) {
      console.error('❌ Diagnostics error:', error);
      setProgress(100);
      setResults([{
        category: 'Error',
        status: 'error',
        message: 'Cannot connect to diagnostics service'
      }]);
    } finally {
      setTimeout(() => {
        setIsRunning(false);
      }, 500);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400 bg-green-500/20 border-green-500/40';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
      case 'error': return 'text-red-400 bg-red-500/20 border-red-500/40';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/40';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return '✓';
      case 'warning': return '⚠️';
      case 'error': return '✗';
      default: return '?';
    }
  };

  const handleDownloadPDF = () => {
    if (results.length === 0) {
      alert('Run diagnostics first before downloading report');
      return;
    }
    generateDiagnosticPDF(results, networkInfo);
  };

  const handleShareWhatsApp = () => {
    if (results.length === 0) {
      alert('Run diagnostics first before sharing');
      return;
    }
    
    const shareText = generateShareText(results, networkInfo);
    const encodedText = encodeURIComponent(shareText);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareInstagram = async () => {
    if (results.length === 0) {
      alert('Run diagnostics first before sharing');
      return;
    }
    
    try {
      // Create Instagram-friendly card
      const card = document.createElement('div');
      card.style.cssText = `
        position: fixed;
        top: -10000px;
        left: 0;
        width: 1080px;
        padding: 80px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      `;

      const goodCount = results.filter(r => r.status === 'good').length;
      const warningCount = results.filter(r => r.status === 'warning').length;
      const errorCount = results.filter(r => r.status === 'error').length;
      const issues = results.filter(r => r.status === 'warning' || r.status === 'error');

      card.innerHTML = `
        <div style="background: white; border-radius: 30px; padding: 60px; box-shadow: 0 30px 60px rgba(0,0,0,0.3);">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 50px;">
            <div style="width: 120px; height: 120px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 30px; margin: 0 auto 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 20px 40px rgba(102, 126, 234, 0.4);">
              <svg width="70" height="70" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 style="font-size: 48px; font-weight: 800; color: #1e293b; margin: 0 0 15px 0;">WiFi Diagnostic Report</h1>
            <p style="font-size: 28px; color: #64748b; margin: 0;">Network: <strong>${networkInfo.wifiSSID || 'Unknown'}</strong></p>
          </div>

          <!-- Test Results -->
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 20px; padding: 40px; margin-bottom: 40px;">
            <h2 style="font-size: 36px; font-weight: 700; color: #0c4a6e; margin: 0 0 30px 0; text-align: center;">Test Results</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
              <div style="text-align: center;">
                <div style="font-size: 64px; font-weight: 800; color: #10b981; margin-bottom: 10px;">${goodCount}</div>
                <div style="font-size: 24px; color: #059669; font-weight: 600;">Passed</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 64px; font-weight: 800; color: #f59e0b; margin-bottom: 10px;">${warningCount}</div>
                <div style="font-size: 24px; color: #d97706; font-weight: 600;">Warnings</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 64px; font-weight: 800; color: #ef4444; margin-bottom: 10px;">${errorCount}</div>
                <div style="font-size: 24px; color: #dc2626; font-weight: 600;">Errors</div>
              </div>
            </div>
          </div>

          ${issues.length > 0 ? `
            <!-- Issues -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 20px; padding: 40px; margin-bottom: 40px;">
              <h2 style="font-size: 36px; font-weight: 700; color: #92400e; margin: 0 0 25px 0;">Issues Found</h2>
              ${issues.slice(0, 2).map(issue => `
                <div style="background: white; border-radius: 15px; padding: 25px; margin-bottom: 20px;">
                  <div style="font-size: 28px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">${issue.category}</div>
                  <div style="font-size: 22px; color: #475569; margin-bottom: 8px;">${issue.message}</div>
                  ${issue.recommendation ? `<div style="font-size: 20px; color: #ea580c; font-style: italic;">💡 ${issue.recommendation}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 20px; padding: 40px; margin-bottom: 40px; text-align: center;">
              <div style="font-size: 42px; font-weight: 700; color: #065f46;">All Tests Passed!</div>
              <div style="font-size: 28px; color: #047857; margin-top: 10px;">Your network is healthy 🎉</div>
            </div>
          `}

          <!-- Footer -->
          <div style="text-align: center; padding-top: 30px; border-top: 3px solid #e2e8f0;">
            <div style="font-size: 24px; color: #64748b; margin-bottom: 8px;">Generated by</div>
            <div style="font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${config.app.name}</div>
          </div>
        </div>
      `;

      document.body.appendChild(card);

      // Show loading
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'fixed top-4 right-4 bg-pink-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      loadingMsg.textContent = '📸 Creating Instagram image...';
      document.body.appendChild(loadingMsg);

      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture screenshot
      const canvas = await html2canvas(card, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        width: 1080,
        height: card.scrollHeight
      });

      // Remove temporary card
      document.body.removeChild(card);

      // Convert to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Failed to create image');
          document.body.removeChild(loadingMsg);
          return;
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `wifi-diagnostic-instagram-${Date.now()}.png`;
        link.href = url;
        link.click();
        
        document.body.removeChild(loadingMsg);
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successMsg.innerHTML = '✅ Instagram image saved!<br><small>Upload to Instagram Story/Post</small>';
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
          document.body.removeChild(successMsg);
        }, 3000);
        
        URL.revokeObjectURL(url);
      }, 'image/png');

    } catch (error) {
      console.error('Screenshot error:', error);
      alert('Failed to create Instagram image. Please try again.');
    }
  };

  const handleCopyText = () => {
    if (results.length === 0) {
      addToast('Run diagnostics first', 'error');
      return;
    }
    
    const shareText = generateShareText(results, networkInfo);
    navigator.clipboard.writeText(shareText)
      .then(() => addToast('✅ Report copied to clipboard!', 'success'))
      .catch(() => addToast('❌ Failed to copy', 'error'));
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Network Diagnostics</h2>
          <p className="text-gray-300 text-sm">
            Analisa masalah WiFi kos kamu dan dapatkan rekomendasi
          </p>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Run Diagnostics Button */}
      {!isRunning && results.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <button
            onClick={runDiagnostics}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Run Diagnostics</span>
            </span>
          </button>
          <p className="text-gray-400 text-sm mt-4">
            Klik untuk memulai analisa network
          </p>
        </div>
      )}

      {/* Progress Bar */}
      {isRunning && (
        <div className="py-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="bg-white/10 rounded-full h-3 overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-300 text-sm">
            Running diagnostics... {progress}%
          </p>
        </div>
      )}

      {/* Results */}
      {!isRunning && results.length > 0 && (
        <div ref={resultsRef} className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border backdrop-blur-sm ${getStatusColor(result.status)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl flex-shrink-0 mt-0.5">
                  {getStatusIcon(result.status)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-1">{result.category}</h4>
                  <p className="text-sm opacity-90 mb-2">{result.message}</p>
                  
                  {result.details && (
                    <p className="text-xs opacity-70 mb-2 font-mono">{result.details}</p>
                  )}
                  
                  {result.duration && (
                    <p className="text-xs opacity-60 mb-2">⏱️ {result.duration}ms</p>
                  )}
                  
                  {result.recommendation && (
                    <div className="bg-white/10 rounded-lg p-3 mt-2">
                      <p className="text-xs font-semibold mb-1">💡 Recommendation:</p>
                      <p className="text-xs opacity-90">{result.recommendation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-white font-bold mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Diagnostic Summary
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {results.filter(r => r.status === 'good').length}
                </div>
                <div className="text-xs text-gray-400">Good</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {results.filter(r => r.status === 'warning').length}
                </div>
                <div className="text-xs text-gray-400">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {results.filter(r => r.status === 'error').length}
                </div>
                <div className="text-xs text-gray-400">Errors</div>
              </div>
            </div>
            <button
              onClick={runDiagnostics}
              className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all duration-300 text-sm font-semibold mb-3"
            >
              Run Again
            </button>

            {/* Share and Export Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg transition-all duration-300 text-sm font-semibold flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download PDF</span>
              </button>

              <button
                onClick={handleCopyText}
                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 text-sm font-semibold flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Text</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 text-sm font-semibold flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleShareInstagram}
                className="px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-lg transition-all duration-300 text-sm font-semibold flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticsCard;
