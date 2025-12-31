import jsPDF from 'jspdf';
import config from '../config/environment';

export interface DiagnosticResult {
  category: string;
  status: 'good' | 'warning' | 'error' | 'running';
  message: string;
  details?: string;
  recommendation?: string;
  duration?: number;
}

export interface NetworkInfo {
  publicIp: string;
  localIp: string;
  wifiSSID: string;
}

export function generateDiagnosticPDF(
  results: DiagnosticResult[],
  networkInfo: NetworkInfo,
  speedTestData?: { download: number; upload: number; ping: number }
): void {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPos = 20;

  // Background gradient effect (using rectangles)
  pdf.setFillColor(240, 242, 255);
  pdf.rect(0, 0, pageWidth, 50, 'F');
  
  // Header with modern design
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246); // Blue
  pdf.text('WiFi Diagnostic Report', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 116, 139); // Gray
  const dateStr = new Date().toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  pdf.text(dateStr, pageWidth / 2, yPos, { align: 'center' });
  
  // Network Info Section with card design
  yPos += 15;
  
  // Card background
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(226, 232, 240);
  pdf.roundedRect(14, yPos - 5, pageWidth - 28, 22, 3, 3, 'FD');
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 41, 59);
  pdf.text('Network Information', 20, yPos);
  
  yPos += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(71, 85, 105);
  
  const ssid = networkInfo.wifiSSID || 'Not connected';
  
  pdf.text(`WiFi Network: ${ssid}`, 20, yPos);
  yPos += 6;
  pdf.text(`Public IP: ${networkInfo.publicIp}`, 20, yPos);
  yPos += 6;
  pdf.text(`Local IP: ${networkInfo.localIp}`, 20, yPos);

  // Speed Test Section (if available)
  if (speedTestData) {
    yPos += 12;
    
    // Card background
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(14, yPos - 5, pageWidth - 28, 26, 3, 3, 'FD');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 41, 59);
    pdf.text('Speed Test Results', 20, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(71, 85, 105);
    
    pdf.text(`Download: ${speedTestData.download.toFixed(2)} Mbps`, 20, yPos);
    yPos += 6;
    pdf.text(`Upload: ${speedTestData.upload.toFixed(2)} Mbps`, 20, yPos);
    yPos += 6;
    pdf.text(`Ping: ${speedTestData.ping} ms`, 20, yPos);
  }

  // Diagnostics Section
  yPos += 15;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 41, 59);
  pdf.text('Diagnostic Tests', 14, yPos);

  results.forEach((result, index) => {
    yPos += 12;
    
    // Check if we need a new page
    if (yPos > 260) {
      pdf.addPage();
      yPos = 20;
    }

    // Test card background
    let bgColor: [number, number, number] = [255, 255, 255];
    let borderColor: [number, number, number] = [226, 232, 240];
    
    if (result.status === 'good') {
      bgColor = [240, 253, 244];
      borderColor = [134, 239, 172];
    } else if (result.status === 'warning') {
      bgColor = [254, 252, 232];
      borderColor = [253, 224, 71];
    } else if (result.status === 'error') {
      bgColor = [254, 242, 242];
      borderColor = [252, 165, 165];
    }
    
    const cardHeight = result.recommendation ? 28 : (result.details ? 20 : 14);
    pdf.setFillColor(...bgColor);
    pdf.setDrawColor(...borderColor);
    pdf.roundedRect(14, yPos - 5, pageWidth - 28, cardHeight, 2, 2, 'FD');

    // Status icon and category
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    
    // Status color and icon
    let statusText = '';
    if (result.status === 'good') {
      pdf.setTextColor(22, 163, 74);
      statusText = 'PASS';
    } else if (result.status === 'warning') {
      pdf.setTextColor(234, 179, 8);
      statusText = 'WARN';
    } else if (result.status === 'error') {
      pdf.setTextColor(239, 68, 68);
      statusText = 'FAIL';
    }
    
    pdf.text(`[${statusText}]`, 20, yPos);
    
    pdf.setTextColor(30, 41, 59);
    pdf.text(result.category, 38, yPos);
    
    // Message
    yPos += 6;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(71, 85, 105);
    const messageLines = pdf.splitTextToSize(result.message, pageWidth - 50);
    pdf.text(messageLines, 20, yPos);
    yPos += messageLines.length * 4;
    
    // Details
    if (result.details) {
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      const detailLines = pdf.splitTextToSize(result.details, pageWidth - 50);
      pdf.text(detailLines, 20, yPos);
      yPos += detailLines.length * 3.5;
    }
    
    // Recommendation
    if (result.recommendation) {
      yPos += 2;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(234, 88, 12);
      const recLines = pdf.splitTextToSize(`Recommendation: ${result.recommendation}`, pageWidth - 50);
      pdf.text(recLines, 20, yPos);
      yPos += recLines.length * 3.5;
    }
  });

  // Summary section with visual stats
  yPos += 15;
  if (yPos > 230) {
    pdf.addPage();
    yPos = 20;
  }

  // Summary card
  pdf.setFillColor(59, 130, 246);
  pdf.roundedRect(14, yPos - 5, pageWidth - 28, 45, 3, 3, 'F');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('Test Summary', 20, yPos);
  
  yPos += 10;
  
  const goodCount = results.filter(r => r.status === 'good').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const totalTests = results.length;
  
  // Draw mini progress bars
  const barWidth = 50;
  const barX = 20;
  
  // Passed bar
  pdf.setFillColor(34, 197, 94);
  pdf.rect(barX, yPos, (goodCount / totalTests) * barWidth, 4, 'F');
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text(`${goodCount} Passed`, barX + barWidth + 5, yPos + 3);
  
  yPos += 8;
  
  // Warnings bar
  pdf.setFillColor(234, 179, 8);
  pdf.rect(barX, yPos, (warningCount / totalTests) * barWidth, 4, 'F');
  pdf.text(`${warningCount} Warnings`, barX + barWidth + 5, yPos + 3);
  
  yPos += 8;
  
  // Errors bar
  pdf.setFillColor(239, 68, 68);
  pdf.rect(barX, yPos, (errorCount / totalTests) * barWidth, 4, 'F');
  pdf.text(`${errorCount} Errors`, barX + barWidth + 5, yPos + 3);
  
  yPos += 10;
  
  // Overall status
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  if (errorCount === 0 && warningCount === 0) {
    pdf.setTextColor(34, 197, 94);
    pdf.text('Network Status: EXCELLENT', 20, yPos);
  } else if (errorCount === 0) {
    pdf.setTextColor(234, 179, 8);
    pdf.text('Network Status: GOOD (with warnings)', 20, yPos);
  } else {
    pdf.setTextColor(239, 68, 68);
    pdf.text('Network Status: NEEDS ATTENTION', 20, yPos);
  }

  // Footer
  yPos = pageHeight - 20;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(148, 163, 184);
  pdf.text(`Generated by ${config.app.name}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 4;
  pdf.text(config.app.description, pageWidth / 2, yPos, { align: 'center' });

  // Save PDF
  const filename = `WiFi-Report-${networkInfo.wifiSSID || 'Network'}-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
}

export function generateShareText(results: DiagnosticResult[], networkInfo: NetworkInfo): string {
  const goodCount = results.filter(r => r.status === 'good').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  const issues = results.filter(r => r.status === 'warning' || r.status === 'error');
  
  let text = `========================================\n`;
  text += `WiFi DIAGNOSTIC REPORT\n`;
  text += `========================================\n\n`;
  
  text += `Network: *${networkInfo.wifiSSID || 'Unknown'}*\n`;
  text += `Date: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}\n\n`;
  
  text += `========================================\n`;
  text += `TEST RESULTS\n`;
  text += `========================================\n\n`;
  
  text += `Passed: *${goodCount}*\n`;
  text += `Warnings: *${warningCount}*\n`;
  text += `Errors: *${errorCount}*\n\n`;

  if (issues.length > 0) {
    text += `========================================\n`;
    text += `ISSUES FOUND\n`;
    text += `========================================\n\n`;
    
    issues.forEach((issue, index) => {
      const icon = issue.status === 'warning' ? '[!]' : '[X]';
      text += `${icon} *${issue.category}*\n`;
      text += `${issue.message}\n`;
      if (issue.details) {
        text += `Details: ${issue.details}\n`;
      }
      if (issue.recommendation) {
        text += `Recommendation: ${issue.recommendation}\n`;
      }
      text += `\n`;
    });
  } else {
    text += `========================================\n`;
    text += `ALL TESTS PASSED!\n`;
    text += `========================================\n\n`;
    text += `Your network is healthy!\n\n`;
  }

  text += `========================================\n`;
  text += `Generated by ${config.app.name}\n`;
  text += `${config.app.description}\n`;

  return text;
}
