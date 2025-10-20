# 💸 MON Transfer Platform1

A decentralized token transfer platform built on **Monad Testnet** that enables users to send MON and ERC-20 tokens with Smart Accounts and ERC-4337 Account Abstraction.

## 🌟 Features

- **💸 Token Transfers** - Send native MON and any ERC-20 token
- **📦 Batch Transfers** - Send to multiple recipients in one transaction
- **⚡ Smart Account Integration** - ERC-4337 with Pimlico bundler for gasless transactions
- **📖 Address Book** - Save and manage frequently used addresses
- **📊 Real-time Analytics** - Envio indexer for on-chain data and transaction history
- **🦊 MetaMask Support** - Seamless wallet connection with delegation toolkit
- **🌐 Multi-Token** - Support for native MON and any ERC-20 standard token

## 🌐 Live Application

**🚀 Platform URL**: [https://mon-stake.vercel.app/](https://mon-stake.vercel.app/)

The MON Transfer Platform is live and fully operational on Vercel. Connect your MetaMask wallet and start transferring immediately!

## 📋 Network Information

### Monad Testnet

| Info | Value |
|------|-------|
| **Network Name** | Monad Testnet |
| **Chain ID** | 10143 |
| **RPC URL** | https://rpc.ankr.com/monad_testnet |
| **Explorer** | https://testnet.monadexplorer.com/ |
| **Smart Account Factory** | `0x69Aa2f9fe1572F1B640E1bbc512f5c3a734fc77c` |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask wallet
- MON tokens on Monad Testnet

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd mon-transfer

# Install dependencies
npm install

# Copy environment file
cp env.example .env.local

# Configure environment variables
# Add your Pimlico API key and other settings

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

## 📋 Environment Variables

Create a `.env.local` file with:

```env
# DEFAULT CHAIN
NEXT_PUBLIC_CHAIN_ID=10143

# MONAD TESTNET
MONAD_RPC_URL=https://rpc.ankr.com/monad_testnet
MONAD_CHAIN_ID=10143

# AA / PAYMASTER / BUNDLER (Pimlico)
NEXT_PUBLIC_PIMLICO_API_KEY=your_pimlico_api_key_here

# ENVIO (GraphQL Endpoint)
NEXT_PUBLIC_ENVIO_API_URL=your_envio_graphql_endpoint
```

## 📖 How to Use

### 1. Connect Wallet
- Click "Connect Wallet" button
- Approve the connection
- MetaMask will automatically switch to Monad Testnet

### 2. Deploy Smart Account (Optional)
- Go to `/deploy` page
- Click "Deploy Smart Account" for ERC-4337 support
- Approve the deployment transaction
- Fund your Smart Account with MON for gas

### 3. Simple Transfer
- Navigate to `/transfer` page
- Select "Simple Transfer" tab
- Choose transfer type (Native MON or ERC-20)
- Enter recipient address and amount
- Click "Send Transfer"
- Confirm transaction in MetaMask

### 4. Batch Transfer
- Go to "Batch Transfer" tab
- Add multiple recipients manually or import from CSV
- Review total amount
- Click "Send to X Recipients"
- All transfers execute in one transaction

### 5. Address Book
- Go to "Address Book" tab
- Add frequently used addresses with labels
- Click ✅ icon to use address in transfer forms
- Manage saved addresses easily

### 6. Monitor Dashboard
- Go to `/dashboard` to view:
  - Current balance
  - Smart Account address
  - Network information
  - Transfer history from Envio
  - Total sent and received amounts

## 🏗️ Project Structure

```
mon-transfer/
├── app/
│   ├── page.tsx                # Landing page
│   ├── transfer/               # Transfer interface
│   ├── dashboard/              # Dashboard with analytics
│   ├── deploy/                 # Smart Account deployment
│   └── layout.tsx              # Root layout
├── components/
│   ├── TransferForm.tsx        # Simple transfer UI
│   ├── BatchTransfer.tsx       # Batch transfer UI
│   ├── AddressBook.tsx         # Address management
│   ├── TransferHistory.tsx     # Envio integration
│   ├── MetaMaskProvider.tsx    # Wallet & Smart Account provider
│   ├── SmartAccountDeploy.tsx  # Deployment interface
│   └── HeaderNav.tsx           # Navigation
├── lib/
│   ├── transfer.ts             # Transfer logic with ERC-4337
│   ├── smartAccount-deploy.ts  # Smart Account creation
│   ├── chain.ts                # Network configurations
│   ├── clients.ts              # Viem clients
│   └── network.ts              # Network utilities
└── mon/
    └── generated/              # Envio indexer
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Context

### Blockchain
- **Network**: Monad Testnet (Chain ID: 10143)
- **Library**: Viem 2.x
- **Smart Accounts**: MetaMask Delegation Toolkit
- **Account Abstraction**: ERC-4337
- **Bundler**: Pimlico

### Indexing & Data
- **Indexer**: Envio
- **Query**: GraphQL
- **Real-time**: WebSocket support

## 📄 Key Functions

### Native Transfer
```typescript
await transferNative(smartAccount, recipientAddress, amount);
```

### ERC-20 Transfer
```typescript
await transferERC20(smartAccount, tokenAddress, recipientAddress, amount);
```

### Batch Transfer
```typescript
const recipients = [
  { address: '0x...', amount: parseEther('1.0') },
  { address: '0x...', amount: parseEther('2.0') }
];
await batchTransfer(smartAccount, recipients, true); // true for native MON
```

### Get Token Info
```typescript
const info = await getTokenInfo(tokenAddress, userAddress);
// Returns: { address, name, symbol, decimals, balance }
```

## 💡 Innovation Highlights

### 1. ERC-4337 Account Abstraction
First transfer platform on Monad to implement full account abstraction with:
- Smart Account deployment via factory
- User operations via Pimlico bundler
- Gasless transactions support
- Batch operations capability

### 2. MetaMask Delegation Toolkit
Integration with MetaMask's official delegation toolkit:
- Hybrid implementation (EOA + Passkey)
- Deterministic address generation
- Counterfactual account support

### 3. Batch Transfers
Save gas and time by sending to multiple recipients:
- Single transaction for multiple transfers
- CSV import for convenience
- Atomic execution (all succeed or all fail)

### 4. Address Book
User-friendly address management:
- Save addresses with labels and notes
- Local storage (privacy-focused)
- Quick access for repeated transfers

### 5. Envio Indexer Integration
Real-time on-chain data with GraphQL:
- Transfer history (sent & received)
- Aggregate statistics
- User analytics
- Transaction tracking

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Test with coverage
npm run test:coverage
```

## 🌐 Deployment

### Frontend (Vercel)

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
```

## 📊 Transfer Features

### Simple Transfer
- Native MON transfers
- ERC-20 token transfers
- Address validation
- Balance checking
- Transaction confirmation

### Batch Transfer
- Multiple recipients in one transaction
- CSV import support
- Total amount calculation
- Individual amount specification
- Gas optimization

### Address Book
- Save unlimited addresses
- Add labels and notes
- Local storage (private)
- Quick copy to clipboard
- One-click use in transfers

## 🔐 Security Considerations

- **Smart Accounts**: Non-custodial, you control your keys
- **Private Keys**: Never exposed in frontend or commits
- **RPC Endpoints**: Use reputable providers (Ankr)
- **User Permissions**: Explicit approval for all transactions
- **Gas Estimation**: Dynamic calculation based on network
- **Address Validation**: Input validation before transfer

## 📝 Development Roadmap

### ✅ Phase 1 - MVP (Completed)
- [x] Transfer logic (native + ERC-20)
- [x] Smart Account support (ERC-4337)
- [x] Batch transfer functionality
- [x] Address book
- [x] Dashboard UI
- [x] MetaMask integration
- [x] Envio indexer integration

### 🔄 Phase 2 - Enhancement (In Progress)
- [x] Pimlico bundler integration
- [x] Real-time transfer history
- [ ] Mobile responsive design improvements
- [ ] Gas optimization for user operations
- [ ] Paymaster integration for sponsored transactions

### 🚀 Phase 3 - Advanced (Planned)
- [ ] NFT transfer support
- [ ] Multi-chain support
- [ ] Scheduled transfers
- [ ] Recurring payments
- [ ] QR code generation for addresses
- [ ] Transaction receipts with PDF export

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support & Resources

- **Live Platform**: [https://mon-stake.vercel.app/](https://mon-stake.vercel.app/)
- **Documentation**: Check `/docs` folder for detailed guides
- **Monad Docs**: https://docs.monad.xyz
- **MetaMask Delegation**: https://docs.metamask.io/delegation-toolkit
- **Envio Docs**: https://docs.envio.dev
- **Pimlico Docs**: https://docs.pimlico.io

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- **Monad Labs** - For testnet infrastructure and support
- **MetaMask** - For delegation toolkit and Smart Account framework
- **Pimlico** - For bundler infrastructure
- **Envio** - For indexing services
- **Community** - All contributors and testers

---

**Built with ❤️ on Monad Testnet**

**🚀 Live Platform**: [https://mon-stake.vercel.app/](https://mon-stake.vercel.app/)

**💸 Transfer tokens the smart way with ERC-4337!**
