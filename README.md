# FlowPay - AI-Powered Web3 Expense Management

FlowPay is a modern expense management platform for remote teams, featuring AI-powered categorization and Web3 payment integration.

## Features

- **AI Expense Categorization**: Automatic expense classification using advanced AI
- **Web3 Wallet Integration**: Connect MetaMask and manage crypto payments
- **Real-time Budget Tracking**: Live budget monitoring and insights
- **Interactive Dashboard**: Modern, responsive UI with smooth animations
- **Smart Analytics**: AI-generated spending insights and recommendations

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Animations**: Framer Motion
- **AI Integration**: Hugging Face API
- **Web3**: MetaMask integration
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension (for Web3 features)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd flowpay

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Hugging Face API token to .env

# Start development server
npm run dev
```

### Environment Variables

```bash
VITE_HUGGING_FACE_TOKEN=your_hugging_face_token_here
```

## Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Deploy to Vercel, Netlify, or any static hosting service.
