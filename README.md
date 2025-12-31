# 🌐 Balkar Network Manager

**Professional WiFi Network Management & Diagnostics Tool**

A comprehensive web application for network diagnostics, speed testing, router security scanning, and device monitoring. Built with modern web technologies for real-time network analysis.

[![GitHub](https://img.shields.io/badge/GitHub-aldi--balkar-blue?logo=github)](https://github.com/aldi-balkar/balkar-network)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-18%2B-brightgreen?logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)

---

## ✨ Features

### 🚀 Speed Test
- Real-time internet speed measurement
- Download & upload speed testing
- Ping latency measurement
- Visual progress indicators
- Results export to PDF

### 📡 Network Information
- Public IP address detection
- Local IP detection
- WiFi SSID identification
- ISP information
- Network interface details

### 🔒 Router Security Scanner
- Default credential checker
- Common vulnerability detection
- Security recommendations
- Router admin panel quick access
- Export security report

### 📊 Network Diagnostics
- WiFi signal quality analysis
- Speed consistency testing
- Router distance estimation
- Issue detection & recommendations
- Comprehensive diagnostic reports

### 🌐 Connected Devices Scanner
- WiFi device detection via ARP scanning
- MAC address vendor identification
- Hostname resolution
- Device type detection (Apple, Samsung, TP-Link, etc.)
- Real-time device monitoring
- Click-to-expand device details

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **jsPDF + html2canvas** - PDF report generation

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js** - Web server framework
- **TypeScript** - Type-safe backend
- **ts-node-dev** - Development server with hot reload
- **dotenv** - Environment configuration

### Network Tools
- **speedtest-net** - Speed testing
- **ARP** - Device scanning
- **os.networkInterfaces()** - Network detection
- **DNS** - Hostname resolution

---

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- macOS, Linux, or Windows

### 1. Clone Repository
```bash
git clone https://github.com/aldi-balkar/balkar-network.git
cd balkar-network
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5001
VITE_API_URL=http://localhost:5001
VITE_APP_NAME=Balkar Network Manager
VITE_APP_DESCRIPTION=WiFi Network Management & Diagnostics Tool
```

### 4. Run Development Server
```bash
npm run dev
```

This will start:
- **Backend**: http://localhost:5001
- **Frontend**: http://localhost:3000

### 5. Build for Production
```bash
npm run build
```

---

## 🚀 Usage

### Speed Test
1. Navigate to **Speed Test** tab
2. Click **"Start Test"** button
3. Wait for download/upload tests to complete
4. View results and export to PDF if needed

### Router Security Scan
1. Go to **Router Security** tab
2. Enter your router IP (default: 192.168.1.1)
3. Enter router credentials
4. Click **"Scan Router"**
5. Review security findings and recommendations

### Network Diagnostics
1. Open **Diagnostics** tab
2. Click **"Run Diagnostic"**
3. Wait for all tests to complete
4. Review WiFi quality, speed consistency, and issues
5. Export comprehensive report

### Connected Devices
1. Navigate to **Connected Devices** tab
2. Click **"Scan Network"**
3. View all devices on your WiFi
4. Click device card to see detailed information
5. Copy device info or open in browser

---

## 📁 Project Structure

```
balkar-network/
├── client/                  # Frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── SpeedTestCard.tsx
│   │   │   ├── NetworkInfoCard.tsx
│   │   │   ├── BandwidthControlCard.tsx
│   │   │   ├── DiagnosticsCard.tsx
│   │   │   ├── ConnectedDevicesCard.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Toast.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useSpeedTest.ts
│   │   │   ├── useNetworkInfo.ts
│   │   │   ├── useBandwidth.ts
│   │   │   └── useToast.ts
│   │   ├── utils/          # Utility functions
│   │   │   ├── api.ts
│   │   │   ├── helpers.ts
│   │   │   └── pdfGenerator.ts
│   │   ├── config/         # Configuration
│   │   │   └── environment.ts
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   └── index.html
├── server/                  # Backend application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   │   ├── speedtest.controller.ts
│   │   │   ├── network.controller.ts
│   │   │   ├── bandwidth.controller.ts
│   │   │   ├── diagnostics.controller.ts
│   │   │   └── device-scanner.controller.ts
│   │   ├── services/       # Business logic
│   │   │   ├── speedtest.service.ts
│   │   │   ├── network.service.ts
│   │   │   ├── bandwidth.service.ts
│   │   │   ├── diagnostics.service.ts
│   │   │   ├── router-scanner.service.ts
│   │   │   └── device-scanner.service.ts
│   │   ├── routes/         # API routes
│   │   │   ├── speedtest.routes.ts
│   │   │   ├── network.routes.ts
│   │   │   ├── bandwidth.routes.ts
│   │   │   ├── diagnostics.routes.ts
│   │   │   └── device-scanner.routes.ts
│   │   ├── middlewares/    # Express middlewares
│   │   │   └── bandwidth.middleware.ts
│   │   ├── types/          # TypeScript types
│   │   │   └── index.ts
│   │   ├── config/         # Server configuration
│   │   │   └── environment.ts
│   │   └── app.ts          # Express app setup
│   └── tsconfig.json
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
├── tailwind.config.js      # Tailwind CSS config
└── README.md               # This file
```

---

## 🔧 Configuration

### Environment Variables

#### Server Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | 5001 |
| `NODE_ENV` | Environment mode | development |

#### Frontend Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:5001 |
| `VITE_APP_NAME` | Application name | Balkar Network Manager |
| `VITE_APP_DESCRIPTION` | App description | WiFi Network Management & Diagnostics Tool |

#### Network Services
| Variable | Description | Default |
|----------|-------------|---------|
| `PUBLIC_IP_SERVICE` | Public IP detection service | https://api.ipify.org?format=json |
| `PUBLIC_IP_TIMEOUT` | IP detection timeout (ms) | 5000 |
| `WIFI_DETECTION_TIMEOUT` | WiFi SSID timeout (ms) | 3000 |

#### Router Defaults
| Variable | Description | Default |
|----------|-------------|---------|
| `DEFAULT_ROUTER_IP` | Default router IP | 192.168.1.1 |
| `VITE_DEFAULT_ROUTER_IP` | Router IP (frontend) | 192.168.1.1 |
| `DEFAULT_ROUTER_USERNAME` | Default username | admin |
| `VITE_DEFAULT_ROUTER_USERNAME` | Username (frontend) | admin |

---

## 🌐 API Endpoints

### Network Information
```
GET /api/network/info
Response: { success, data: { publicIp, localIp, ssid, userAgent } }
```

### Speed Test
```
GET /api/speedtest
Response: { success, data: { ping, download, upload, server } }
```

### Router Security Scan
```
POST /api/bandwidth/scan
Body: { routerIp, username, password }
Response: { success, vulnerabilities, recommendations }
```

### Network Diagnostics
```
GET /api/diagnostics
Response: { success, diagnostics: { wifiQuality, speedConsistency, issues } }
```

### Connected Devices
```
GET /api/network/scan-devices
Response: { success, devices: [{ ip, mac, hostname, vendor, isCurrentDevice }] }
```

---

## 🎨 UI Features

### Responsive Design
- **Mobile-first** approach
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Touch-optimized controls
- Safe area support for notches

### Cyan Theme
- Gradient backgrounds with animated blobs
- Glow effects on buttons and cards
- Glassmorphism design
- Dark mode optimized

### Animations
- Smooth transitions
- Progress indicators
- Loading states
- Toast notifications

---

## 🛡️ Security & Legal

### ✅ Safe & Legal Features
- Browser-based network diagnostics
- Public API speed testing
- ARP table reading (local network only)
- Router security scanning (with credentials)
- Device detection via MAC addresses

### ❌ Not Included (Illegal Activities)
- WiFi password cracking
- Packet sniffing/interception
- Man-in-the-middle attacks
- Deauthentication attacks
- Unauthorized router access
- Network traffic monitoring without consent

### Privacy
- No data collection or tracking
- All processing done locally
- No external data storage
- Router credentials not saved

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports 5001 and 3000
lsof -ti:5001,3000 | xargs kill -9

# Then restart
npm run dev
```

### Permission Denied (Device Scanning)
```bash
# macOS/Linux: Run with sudo for ARP access
sudo npm run dev
```

### WiFi SSID Not Detected
- Ensure you're connected to WiFi (not Ethernet)
- Grant location permissions if prompted
- Some systems require elevated privileges

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
- **React 18** + TypeScript
- **Tailwind CSS** untuk styling
- **Vite** sebagai bundler
- Custom hooks untuk state management

### Backend
- **Express.js** + TypeScript
- REST API architecture
- In-memory storage (tanpa database)
- Middleware untuk bandwidth simulation

### Struktur Monolith
```
balkar-network/
├── server/                 # Backend Express.js
│   ├── src/
│   │   ├── app.ts         # Entry point
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route handlers
│   │   ├── services/      # Business logic
│   │   ├── middlewares/   # Custom middleware
│   │   └── types/         # TypeScript types
│   └── tsconfig.json
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Helper functions
│   │   ├── App.tsx        # Main app
│   │   └── main.tsx       # Entry point
│   └── tailwind.config.js
└── package.json           # Monorepo dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

1. **Clone or download project**
```bash
cd /Users/macbook/Documents/Projects/balkar-network
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env file with your preferred settings
nano .env  # or use any text editor
```

**Important environment variables:**
- `PORT`: Backend server port (default: 5001)
- `APP_NAME`: Application name shown in UI
- `VITE_API_BASE_URL`: Frontend API endpoint
- `DEFAULT_ROUTER_IP`: Default router IP for security scanner
- `SECURITY_SCAN_TIMEOUT`: Max time for router security scan (milliseconds)

See `.env.example` for all available configuration options.

4. **Run in development mode** (Frontend & Backend bersamaan)
```bash
npm run dev
```

Atau jalankan terpisah:

**Backend only:**
```bash
npm run dev:server
```

**Frontend only:**
```bash
npm run dev:client
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001/api
- **Health Check:** http://localhost:5001/api/health

## ⚙️ Configuration

### Environment Variables

All configuration is centralized in the `.env` file at the project root. The application follows this pattern:

```
Components → config/environment.ts → .env file
```

**Configuration Structure:**

**Server Configuration:**
- `PORT` - Backend server port (default: 5001)
- `NODE_ENV` - Environment mode (development/production)

**Application Info:**
- `APP_NAME` - Application name displayed in UI
- `APP_VERSION` - Version number
- `APP_DESCRIPTION` - App description for exports

**API Endpoints:**
- `VITE_API_BASE_URL` - Frontend API base URL (must have VITE_ prefix)

**Network Services:**
- `PUBLIC_IP_SERVICE` - Public IP detection service URL
- `PUBLIC_IP_TIMEOUT` - Timeout for IP detection (ms)
- `WIFI_DETECTION_TIMEOUT` - WiFi SSID detection timeout (ms)

**Router Defaults:**
- `DEFAULT_ROUTER_IP` / `VITE_DEFAULT_ROUTER_IP` - Default router IP
- `DEFAULT_ROUTER_USERNAME` / `VITE_DEFAULT_ROUTER_USERNAME` - Default username
- `DEFAULT_ROUTER_PASSWORD` / `VITE_DEFAULT_ROUTER_PASSWORD` - Default password

**Security Scanner:**
- `SECURITY_SCAN_TIMEOUT` / `VITE_SECURITY_SCAN_TIMEOUT` - Max scan time (ms)
- `SECURITY_REQUEST_TIMEOUT` - Per-request timeout (ms)
- `SECURITY_MAX_ATTEMPTS` - Max credential attempts

**Diagnostics:**
- `DIAGNOSTIC_TEST_TIMEOUT` - Test timeout (ms)
- `DIAGNOSTIC_BANDWIDTH_TIMEOUT` - Bandwidth test timeout (ms)
- `DIAGNOSTIC_BANDWIDTH_URL` - Speed test file URL
- `DIAGNOSTIC_PING_SERVER` - Ping test server (default: 8.8.8.8)

**Export & Sharing:**
- `VITE_PDF_TITLE` / `VITE_PDF_FILENAME` - PDF export settings
- `VITE_WHATSAPP_SHARE_TEXT` - WhatsApp share text
- `VITE_INSTAGRAM_CARD_TITLE` - Instagram card title

> **Note:** Variables with `VITE_` prefix are accessible in frontend (Vite requirement). Variables without prefix are backend-only.

### Customization

To customize the application:

1. Copy `.env.example` to `.env`
2. Edit values in `.env` file
3. Restart the development server

**Example: Change Port**
```bash
# Edit .env file
PORT=3001
VITE_API_BASE_URL=http://localhost:3001/api

# Restart server
npm run dev
```

**Example: Change App Name**
```bash
# Edit .env file
APP_NAME="My Network Manager"

# Restart - app name will update in UI
npm run dev
```

## 📡 API Endpoints

### Network Information
```
GET /api/network/info
```
Response:
```json
{
  "publicIp": "123.45.67.89",
  "userAgent": "Mozilla/5.0...",
  "ssid": null,
  "explanation": "WiFi SSID cannot be accessed via browser...",
  "timestamp": "2025-12-31T12:00:00.000Z"
}
```

### Speed Test
```
GET /api/speedtest
```
Response:
```json
{
  "ping": 25,
  "downloadSpeed": 45.2,
  "uploadSpeed": 23.8,
  "timestamp": "2025-12-31T12:00:00.000Z"
}
```

### Bandwidth Control

**Get Global Settings:**
```
GET /api/bandwidth/global
```

**Set Global Bandwidth:**
```
POST /api/bandwidth/global
Content-Type: application/json

{
  "enabled": true,
  "maxSpeed": 50
}
```

**Set Device Bandwidth:**
```
POST /api/bandwidth/device
Content-Type: application/json

{
  "deviceId": "abc123",
  "enabled": true,
  "maxSpeed": 30
}
```

## 🎨 UI Components

### Components dibuat dengan Tailwind CSS:
- `Card` - Container dengan badge status
- `Button` - Button dengan loading state
- `Input` - Form input dengan label dan error
- `Toggle` - Switch toggle untuk enable/disable
- `SpeedTestCard` - Komponen untuk speed testing
- `NetworkInfoCard` - Menampilkan info network
- `BandwidthControlCard` - Kontrol bandwidth

## 🧠 Cara Kerja Bandwidth Simulation

### Konsep Simulasi

Bandwidth limiting di aplikasi ini adalah **SIMULASI EDUKATIF**, bukan kontrol network yang sesungguhnya.

**Backend Middleware (`bandwidth.middleware.ts`):**
```typescript
// Hitung delay berdasarkan ukuran data dan speed limit
const delay = (dataSize * 8) / (maxSpeed * 1000000) * 1000

// Tunda response
setTimeout(() => {
  res.send(data);
}, delay);
```

**Formula:**
```
Delay (ms) = (Data Size in bytes × 8 bits) / (Max Speed in Mbps × 1,000,000) × 1000
```

**Contoh:**
- Data: 10KB = 10,000 bytes
- Speed Limit: 10 Mbps
- Delay: (10000 × 8) / (10 × 1000000) × 1000 = 8ms

### Real Bandwidth Control (Untuk Referensi)

Untuk kontrol bandwidth yang **sesungguhnya** di router, kamu perlu:

1. **Router Admin Access** dengan kredensial yang benar
2. **Router API Integration:**
   - OpenWRT / DD-WRT: REST API
   - TP-Link: Cloud API atau local API
   - Mikrotik: REST API
   - ASUS: ASUSWRT-Merlin API

3. **Network Tools (Linux):**
   - `tc` (traffic control) - memerlukan root access
   - `iptables` - firewall rules
   - `wondershaper` - bandwidth shaping tool

**Contoh (Linux - memerlukan sudo):**
```bash
# Limit bandwidth di interface
sudo tc qdisc add dev eth0 root tbf rate 10mbit burst 32kbit latency 400ms

# QoS dengan iptables
sudo iptables -A OUTPUT -p tcp --dport 80 -j DROP
```

⚠️ **PERINGATAN:** Manipulasi network interface memerlukan:
- Root/admin privileges
- Pemahaman mendalam tentang networking
- Tanggung jawab penuh atas perubahan yang dilakukan

## 🔧 Development

### Build for Production

**Backend:**
```bash
npm run build:server
```

**Frontend:**
```bash
npm run build:client
```

**Run Production:**
```bash
npm start
```

### Type Safety

Semua kode menggunakan TypeScript dengan `strict: true`:
- ✅ No implicit any
- ✅ Strict null checks
- ✅ Full type inference
- ✅ Interface-based architecture

## 📚 Browser Limitations

### Apa yang TIDAK bisa diakses via browser:

1. **WiFi SSID** - Disembunyikan untuk security
2. **Network Interfaces** - Tidak ada akses ke eth0, wlan0, dll
3. **Other Devices on Network** - Tidak bisa scan devices
4. **Router Settings** - Tidak ada akses tanpa credentials
5. **Raw Socket Access** - Tidak ada low-level network access

### Apa yang BISA diakses:

1. ✅ Public IP (via server atau service)
2. ✅ User Agent
3. ✅ Browser APIs (fetch, WebSocket, WebRTC)
4. ✅ Local Storage
5. ✅ Geolocation (dengan permission)

## 🎓 Educational Purpose

Aplikasi ini dibuat untuk:
- ✅ Belajar network monitoring
- ✅ Memahami speed testing
- ✅ Simulasi bandwidth management
- ✅ Memahami batasan browser security
- ✅ Best practices dalam full-stack development

## 🤝 Contributing

Jika kamu ingin menambahkan fitur:
1. Pastikan fitur tersebut **AMAN dan LEGAL**
2. Tidak melanggar ToS provider
3. Tidak membahayakan network orang lain
4. Dokumentasi yang jelas

## 📄 License

MIT License - Gunakan dengan bijak dan bertanggung jawab.

## ⚠️ Disclaimer

- Aplikasi ini untuk **educational purposes** dan **personal use** saja
- Developer tidak bertanggung jawab atas penyalahgunaan
- Selalu patuhi hukum dan regulasi yang berlaku
- Jangan gunakan untuk tujuan illegal
- Bandwidth simulation adalah **MOCK/SIMULASI**, bukan kontrol yang sesungguhnya

## 🔮 Future Improvements (Optional)

Jika kamu ingin extend aplikasi ini:

1. **Real Router Integration** (dengan izin admin):
   - OpenWRT API integration
   - SNMP monitoring
   - Router-specific SDK

2. **Advanced Features**:
   - Historical speed test data
   - Charts & graphs
   - Export reports
   - Multiple device tracking

3. **Real Speed Test**:
   - Serve actual large files
   - Multi-threaded testing
   - WebRTC-based tests

## 📞 Support

Jika ada pertanyaan tentang cara kerja aplikasi atau implementasi yang aman, silakan buka issue atau diskusi.

---

**Made with ❤️ for learning and network management**

**Ingat:** With great power comes great responsibility. Use wisely! 🚀

---

## 📝 Development

### Available Scripts

```bash
# Development (runs both frontend & backend)
npm run dev

# Frontend only
npm run dev:client

# Backend only
npm run dev:server

# Build for production
npm run build

# Build frontend
npm run build:client

# Build backend
npm run build:server
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use Tailwind CSS for styling
- Write clean, documented code
- Use bracket notation for logs: `[CATEGORY] message`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Aldi Balkar**
- GitHub: [@aldi-balkar](https://github.com/aldi-balkar)
- Email: aldibalkar23@gmail.com

---

## 🙏 Acknowledgments

- **React Team** - For the amazing UI library
- **Vite Team** - For the blazing fast build tool
- **Tailwind CSS** - For utility-first CSS framework
- **Express.js** - For robust web server framework
- **speedtest-net** - For speed testing capabilities

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search [existing issues](https://github.com/aldi-balkar/balkar-network/issues)
3. Create a [new issue](https://github.com/aldi-balkar/balkar-network/issues/new)

---

<div align="center">

### Made with ❤️ by [Aldi Balkar](https://github.com/aldi-balkar)

**Star ⭐ this repo if you find it helpful!**

</div>
