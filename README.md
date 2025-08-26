# FlowPay - AI-Powered Web3 Expense Management

FlowPay is a modern expense management platform that combines Human-Centric Design, AI Intelligence, and Web3 technology to revolutionize expense tracking for modern businesses.

## 🚀 Live Demo

**[https://your-vercel-deployment-url.vercel.app](https://flow-ai-pay.vercel.app/)**

## ✨ Features

### 🖌 Human-Centric Design (UX/UI)
- **Responsive Dashboard**: Clean, intuitive interface that works on all devices
- **Real-time Search**: Functional search bar with live filtering across expenses
- **Smart Navigation**: Seamless user experience with persistent state
- **Custom Branding**: Professional design with custom logo and theming
- **Accessibility**: WCAG compliant design for inclusive user experience

### 🤖 AI Implementations & Integrations
- **Gemini AI Integration**: Advanced expense categorization and insights
- **AI Chat Assistant**: Natural language processing for expense queries with discoverable UI
- **Smart Categorization**: Automatic expense classification with intelligent fallbacks
- **Duplicate Detection**: AI-powered anomaly detection and spending analysis
- **Predictive Analytics**: Budget forecasting and personalized recommendations

### 🌐 Web3 & Decentralised Solutions
- **Multi-Wallet Support**: Wagmi integration with persistent connection state
- **Real-time Balance Tracking**: Live crypto balance monitoring and display
- **Secure Wallet Management**: Safe connect/disconnect with local storage persistence
- **Token Integration**: Support for multiple cryptocurrencies and tokens
- **Web3-Native UX**: Seamless crypto payment experience

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui, Tailwind CSS, Framer Motion
- **AI Integration**: Google Gemini API
- **Web3**: Wagmi, Viem, Web3 wallet connectivity
- **State Management**: React Hooks with localStorage persistence
- **Deployment**: Vercel (Edge Functions + CDN)
- **Charts & Analytics**: Recharts, Custom data visualization

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Web3 wallet (MetaMask, WalletConnect, etc.) for Web3 features
- Google Gemini API key for AI functionality

### Installation

```bash
# Clone the repository
git clone https://github.com/yazzy01/Flow-AI-Pay.git
cd Flow-AI-Pay

# Install dependencies
npm install

# Set up environment variables
# Create .env file in root directory
echo "VITE_GEMINI_API_KEY=your_gemini_api_key_here" > .env

# Start development server
npm run dev
```

### Environment Variables

```bash
# Required for AI functionality
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set Environment Variables**:
   - Add `VITE_GEMINI_API_KEY` in Vercel dashboard
   - Configure build settings: Framework = Vite, Build Command = `npm run build`

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Alternative Platforms

#### Netlify
```bash
# Build for production
npm run build

# Deploy dist/ folder to Netlify
# Configure environment variables in Netlify dashboard
```

#### GitHub Pages
```bash
# Build for production
npm run build

# Deploy using GitHub Actions or manual upload
```

#### Manual Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy dist/ folder to any static hosting service
```

## 🌟 Key Implementations

- **✅ Functional Search**: Real-time expense filtering connected to header search
- **✅ AI Assistant**: Enhanced with discoverable UI, tooltips, and animations  
- **✅ Web3 Integration**: Persistent wallet state with proper disconnect functionality
- **✅ Custom Branding**: Replaced default icons with custom FlowPay branding
- **✅ Responsive Design**: Mobile-first approach with comprehensive breakpoints
- **✅ Data Persistence**: localStorage integration for expense data and settings

## 📱 Browser Support

- Chrome 90+
- Firefox 88+  
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
