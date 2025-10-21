# MON Transfer Platform

A modern, decentralized token transfer platform built on the Monad blockchain, featuring ERC-4337 Smart Account integration and real-time transaction indexing with Envio.

🌐 **Live Demo:** [https://transfer-smartaccount.vercel.app/](https://transfer-smartaccount.vercel.app/)

## 🚀 Features

### 🔐 Smart Account Integration
- **ERC-4337 Account Abstraction**: Deploy and manage Smart Accounts for gasless transactions
- **Pimlico Bundler Integration**: Seamless transaction processing through Pimlico's infrastructure
- **MetaMask Delegation Toolkit**: Easy wallet connection and account management
- **Automatic Deployment**: One-click Smart Account deployment with status monitoring

### 💸 Advanced Transfer Capabilities
- **Native Token Transfers**: Send MON tokens directly with Smart Account integration
- **ERC-20 Token Support**: Transfer any ERC-20 token with automatic token detection
- **Batch Transfers**: Send tokens to multiple recipients in a single transaction
- **Gas Optimization**: Reduced gas fees through batch processing and Smart Account abstraction

### 📊 Real-time Transaction Monitoring
- **Envio Indexing**: Real-time blockchain data indexing and querying
- **Transfer History**: Comprehensive transaction history with filtering and search
- **Transaction Analytics**: Sent/received statistics and net balance tracking
- **GraphQL API**: Efficient data querying through Envio's GraphQL endpoint

### 🎨 Modern User Interface
- **Dark Theme Design**: Professional dark interface with glass morphism effects
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Sidebar Navigation**: Collapsible sidebar with smooth transitions
- **Progress Indicators**: Visual step-by-step guidance for complex operations
- **Animated Components**: Subtle animations and hover effects for enhanced UX

## 🏗️ Technical Architecture

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom CSS variables
- **State Management**: React hooks and context providers
- **Wallet Integration**: MetaMask with custom provider wrapper

### Blockchain Integration
- **Network**: Monad Testnet (Chain ID: 10143)
- **Smart Contracts**: ERC-4337 EntryPoint and custom TransferEventWrapper
- **Libraries**: Viem for blockchain interactions
- **Bundler**: Pimlico for UserOperation processing

### Data Indexing
- **Envio Indexer**: Real-time blockchain event indexing
- **GraphQL API**: Query interface for transaction data
- **Event Wrapper**: Custom contract for emitting transfer events
- **Database**: PostgreSQL with Envio's managed infrastructure

## 📋 Smart Contract Addresses

### TransferEventWrapper Contract
```
Address: 0xFf71Ff614d6B621541408Adce546bF68Ad399b5d
Network: Monad Testnet
Purpose: Emit standardized events for transfer operations
```

### ERC-4337 EntryPoint
```
Address: 0x0000000071727De22E5E9d8BAf0edAc6f37da032
Network: Monad Testnet
Purpose: ERC-4337 Account Abstraction entry point
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MetaMask wallet
- MON tokens on Monad Testnet

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/mon-metamask-envio.git
cd mon-metamask-envio
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp env.example .env.local
```

4. **Configure environment variables**
```env
NEXT_PUBLIC_PIMLICO_API_KEY=your_pimlico_api_key
NEXT_PUBLIC_CHAIN_ID=10143
NEXT_PUBLIC_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
NEXT_PUBLIC_MONAD_CHAIN_ID=10143
NEXT_PUBLIC_ENVIO_API_URL=https://indexer.dev.hyperindex.xyz/2466180/v1/graphql
NEXT_PUBLIC_TRANSFER_EVENT_WRAPPER=0xFf71Ff614d6B621541408Adce546bF68Ad399b5d
```

5. **Run development server**
```bash
npm run dev
```

6. **Open in browser**
```
http://localhost:3000
```

## 📱 User Journey

### 1. Wallet Connection
- Connect MetaMask wallet
- Automatic network switching to Monad Testnet
- Account verification and balance checking

### 2. Smart Account Setup
- Deploy Smart Account (one-time setup)
- Fund Smart Account with MON tokens for gas fees
- Verify deployment status and balance

### 3. Token Transfers
- **Simple Transfer**: Send tokens to a single recipient
- **Batch Transfer**: Send tokens to multiple recipients simultaneously
- **Token Selection**: Choose between native MON or any ERC-20 token

### 4. Transaction Monitoring
- View real-time transfer history
- Track sent/received amounts and net balance
- Monitor transaction status and confirmations

## 🔧 Smart Contract Architecture

### TransferEventWrapper Contract
A dedicated smart contract that emits standardized events for all transfer operations:

```solidity
contract TransferEventWrapper {
    event TransferExecuted(
        address indexed smartAccount,
        address indexed to,
        uint256 value,
        string transferType,
        address tokenAddress,
        uint256 timestamp,
        bytes32 indexed userOpHash
    );
    
    event BatchTransferExecuted(
        address indexed smartAccount,
        uint256 recipientCount,
        uint256 totalValue,
        string transferType,
        address tokenAddress,
        uint256 timestamp,
        bytes32 indexed userOpHash
    );
}
```

## 🌐 Network Information

- **Network Name**: Monad Testnet
- **Chain ID**: 10143
- **RPC URL**: https://testnet-rpc.monad.xyz
- **Explorer**: https://testnet.monadexplorer.com
- **Currency**: MON (native token)

## 🔒 Security Features

- **Smart Account Validation**: Verify account deployment before operations
- **Transaction Validation**: Check balances and token allowances
- **Error Handling**: Comprehensive error messages and fallback mechanisms
- **Type Safety**: Full TypeScript implementation for compile-time safety

## ⚡ Performance Optimizations

- **Batch Operations**: Reduce gas costs through batch transfers
- **Smart Caching**: Efficient data fetching with React Query patterns
- **Lazy Loading**: Component-level code splitting
- **Optimized Queries**: Efficient GraphQL queries with proper filtering

## 🛠️ Development

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── deploy/           # Smart Account deployment
│   ├── transfer/         # Transfer functionality
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── HeaderNav.tsx     # Navigation sidebar
│   ├── MetaMaskProvider.tsx # Wallet provider
│   ├── SmartAccountDeploy.tsx # Account deployment
│   ├── FundSmartAccount.tsx # Account funding
│   ├── TransferForm.tsx  # Single transfer form
│   ├── BatchTransfer.tsx # Batch transfer form
│   └── TransferHistory.tsx # Transaction history
├── lib/                  # Utility functions
│   ├── transfer.ts       # Transfer logic
│   ├── smartAccount-deploy.ts # Account deployment
│   ├── chain.ts          # Chain configuration
│   ├── clients.ts        # Blockchain clients
│   └── network.ts        # Network utilities
├── envio/               # Envio indexer configuration
│   ├── config.yaml      # Indexer configuration
│   ├── schema.graphql   # GraphQL schema
│   └── src/EventHandlers.ts # Event handlers
└── public/              # Static assets
    └── logo.png         # Platform logo
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

### Manual Deployment
```bash
npm run build
npm run start
```

## 📊 Envio Indexer Setup

The platform uses Envio for real-time blockchain indexing:

1. **Contract Events**: TransferEventWrapper contract events
2. **GraphQL Endpoint**: https://indexer.dev.hyperindex.xyz/2466180/v1/graphql
3. **Real-time Updates**: Automatic transaction indexing
4. **Query Interface**: GraphQL for efficient data fetching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://transfer-smartaccount.vercel.app/](https://transfer-smartaccount.vercel.app/)
- **Monad Testnet Explorer**: [https://testnet.monadexplorer.com](https://testnet.monadexplorer.com)
- **Pimlico Documentation**: [https://docs.pimlico.io](https://docs.pimlico.io)
- **Envio Documentation**: [https://docs.envio.dev](https://docs.envio.dev)
- **ERC-4337 Specification**: [https://eips.ethereum.org/EIPS/eip-4337](https://eips.ethereum.org/EIPS/eip-4337)

## 🙏 Acknowledgments

- **Monad**: For the testnet infrastructure
- **Pimlico**: For bundler services
- **Envio**: For blockchain indexing
- **ERC-4337**: For Account Abstraction standard
- **Viem**: For Ethereum library

---

**Built for the Monad ecosystem** • **Powered by ERC-4337** • **Indexed by Envio**