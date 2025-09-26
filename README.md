# 🏠 RentChain - Decentralized Web3 Rental Marketplace

Welcome to the **future of renting**! Hanumo is a decentralized rental platform where users can rent properties or list their properties for rent using blockchain technology. No intermediaries. No hidden fees. 100% decentralized.

## 🌌 Features

### 🔑 **Wallet-based Authentication**
- Seamless login with MetaMask, WalletConnect, and other Web3 wallets
- RainbowKit integration for smooth wallet connection experience
- Support for multiple chains (Ethereum, Polygon, Arbitrum, Sepolia)

### 🌍 **Borderless Marketplace**
- Rent or host properties across the globe
- Crypto payments in ETH and USDC
- Smart contract-powered rental agreements

### 🛡️ **Trustless System**
- Powered by smart contracts and on-chain verification
- ENS integration for Web3 identity
- Transparent and immutable rental history

### 🏛️ **DAO Governance**
- Community-owned alternative to Web2 rental giants
- Vote on platform improvements
- Shape the future of decentralized living

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or other Web3 wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd projectfront
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your actual values:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_RENTAL_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_CHAIN_ID=1
   ```

4. **Get WalletConnect Project ID**
   - Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project
   - Copy the Project ID to your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # User dashboard
│   ├── list/              # Property listing page
│   ├── rentals/           # Rental history page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Web3 providers
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── PropertyCard.tsx   # Property display card
│   ├── PropertyManagement.tsx # Property listing form
│   ├── RentalModal.tsx    # Rental booking modal
│   ├── SearchFilters.tsx  # Property search filters
│   └── UserDashboard.tsx # User dashboard component
├── lib/                   # Utility libraries
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # Utility functions
│   └── wagmi.ts          # Wagmi configuration
└── contracts/            # Smart contracts
    └── RentalMarketplace.sol # Main rental contract
```

## 🔧 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi, RainbowKit, Viem
- **Blockchain**: Ethereum, Polygon, Arbitrum
- **State Management**: React Query (TanStack Query)
- **UI Components**: Radix UI, Lucide React

## 📱 Pages & Features

### 🏠 **Home Page** (`/`)
- Hero section with Web3 rental messaging
- Property search and filtering
- Featured crypto-themed properties
- Why decentralized rentals section

### 📊 **Dashboard** (`/dashboard`)
- User statistics and analytics
- Rental history overview
- Quick actions for property management
- Performance metrics

### 🏡 **List Property** (`/list`)
- Property listing form
- Upload property details and images
- Set pricing in ETH/USDC
- Smart contract integration

### 📋 **My Rentals** (`/rentals`)
- Upcoming, active, and completed rentals
- Rental history tracking
- Payment and transaction details
- Status management

## 🔗 Smart Contract Integration

The platform includes a comprehensive Solidity smart contract (`RentalMarketplace.sol`) with:

- **Property Listing**: List properties with metadata
- **Rental Requests**: Request rentals with dates and deposits
- **Agreement Management**: Confirm and complete rentals
- **Payment Handling**: Secure crypto payments
- **Dispute Resolution**: On-chain rental agreements

### Contract Functions
- `listProperty()` - List a new property
- `requestRental()` - Request to rent a property
- `confirmRental()` - Confirm rental agreement
- `completeRental()` - Complete rental period
- `updatePropertyAvailability()` - Update property status

## 🌐 Web3 Features

### **Supported Networks**
- Ethereum Mainnet
- Polygon
- Arbitrum
- Sepolia Testnet

### **Supported Wallets**
- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow Wallet
- And more via RainbowKit

### **Payment Tokens**
- ETH (Ethereum)
- USDC (USD Coin)
- Custom token support via smart contracts

## 🎨 Design System

The platform uses a modern, Web3-focused design with:
- **Color Scheme**: Blue and purple gradients for Web3 feel
- **Typography**: Clean, modern fonts (Geist Sans/Mono)
- **Icons**: Lucide React icons with emoji accents
- **Layout**: Responsive grid system
- **Components**: Reusable, accessible components

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Manual Deployment**
```bash
npm run build
npm start
```

## 🔒 Security Considerations

- **Smart Contract Audits**: Contracts should be audited before mainnet deployment
- **Private Key Management**: Never expose private keys in client-side code
- **Environment Variables**: Keep sensitive data in environment variables
- **Input Validation**: All user inputs are validated and sanitized

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Open an issue on GitHub
- **Discord**: Join our community Discord
- **Twitter**: Follow us for updates

## 🌟 Roadmap

- [ ] IPFS integration for property images
- [ ] ENS domain integration
- [ ] Mobile app (React Native)
- [ ] Advanced search filters
- [ ] Property verification system
- [ ] Insurance integration
- [ ] Multi-language support
- [ ] DAO token launch

---

**Built with ❤️ for the Web3 community**

*The future of real estate is on-chain.* 🏠✨