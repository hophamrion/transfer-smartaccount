# 📊 Envio Integration Guide

## 🎯 Overview

This document explains how Envio blockchain indexer is integrated into the MON Staking Platform to provide real-time staking history and analytics.

---

## 🏗️ Architecture

### **Data Flow:**
```
Smart Contract Events → Envio Indexer → GraphQL API → Dashboard
     (On-chain)            (Indexing)      (Query)      (Display)
```

---

## 📋 Indexed Events

### **1. Staked Event**
- **When**: User stakes MON tokens
- **Fields**: `id`, `user`, `amount`, `timestamp`

### **2. Unstaked Event**
- **When**: User unstakes MON tokens
- **Fields**: `id`, `user`, `amount`, `reward`, `timestamp`

### **3. RewardClaimed Event**
- **When**: User claims pending rewards
- **Fields**: `id`, `user`, `amount`, `timestamp`

---

## 🔧 Setup

### **1. Environment Variables**

Add to `.env.local`:
```bash
NEXT_PUBLIC_ENVIO_API_URL=https://indexer.bigdevenergy.link/YOUR_ENDPOINT_ID/v1/graphql
```

### **2. Envio Configuration**

Contract Details:
- **Contract Name**: `stakemon`
- **Contract Address**: `0x91e33a594da3e8e2ad3af5195611cf8cabe75353`
- **Network**: Monad Testnet (Chain ID: 10143)
- **RPC**: `https://rpc.ankr.com/monad_testnet`

---

## 🔍 GraphQL Queries

### **Get User Staking History:**

```graphql
query UserStakingHistory($user: String!) {
  Stakemon_Staked(
    where: { user: { _eq: $user } }
    order_by: { timestamp: desc }
    limit: 10
  ) {
    id
    user
    amount
    timestamp
  }
  
  Stakemon_Unstaked(
    where: { user: { _eq: $user } }
    order_by: { timestamp: desc }
    limit: 10
  ) {
    id
    user
    amount
    reward
    timestamp
  }
  
  Stakemon_RewardClaimed(
    where: { user: { _eq: $user } }
    order_by: { timestamp: desc }
    limit: 10
  ) {
    id
    user
    amount
    timestamp
  }
}
```

### **Get All Events for Aggregation:**

```graphql
query UserAllEvents($user: String!) {
  Stakemon_Staked(
    where: { user: { _eq: $user } }
    order_by: { timestamp: desc }
  ) {
    id
    user
    amount
    timestamp
  }
  
  Stakemon_RewardClaimed(
    where: { user: { _eq: $user } }
    order_by: { timestamp: desc }
  ) {
    id
    user
    amount
    timestamp
  }
}
```

**Note**: Total staked and total claimed are calculated client-side by summing all events.

### **Get All Staking Activity:**

```graphql
query AllStakingActivity {
  Stakemon_Staked(
    order_by: { timestamp: desc }
    limit: 20
  ) {
    id
    user
    amount
    timestamp
  }
}
```

---

## 📊 Dashboard Display

### **Stats Cards** (Real-time from Smart Contract):
1. **Current Staked Amount** - Live balance in contract
2. **Pending Rewards** - Unclaimed rewards
3. **Lock Status** - Unstake availability

### **Staking History** (Historical from Envio):
1. **Total Staked** - Sum of all stake events
2. **Total Claimed** - Sum of all reward claims
3. **Transaction History** - Recent events with:
   - Event type (Stake/Unstake/Claim)
   - Amount
   - Timestamp
   - Event ID

---

## 🎨 Component Structure

### **`StakingHistory.tsx`**

**Purpose**: Fetches and displays staking history from Envio

**Features**:
- ✅ GraphQL query with aggregates
- ✅ Real-time data fetching
- ✅ Loading and error states
- ✅ Color-coded event types
- ✅ Responsive grid layout
- ✅ Total staked and claimed stats

**Usage**:
```tsx
import StakingHistory from "@/components/StakingHistory";

<StakingHistory userAddress={smartAccount.address} />
```

---

## 🔗 Entity Names in GraphQL Schema

Envio creates these entities from events:

| Event Name | GraphQL Entity |
|------------|----------------|
| `Staked` | `Stakemon_Staked` |
| `Unstaked` | `Stakemon_Unstaked` |
| `RewardClaimed` | `Stakemon_RewardClaimed` |

**Note**: Aggregates are calculated client-side by fetching all events and summing the amounts.

---

## 🧪 Testing

### **In Envio Playground:**

1. Navigate to your Envio dashboard
2. Click "Playground" or "GraphQL"
3. Run test query:

```graphql
query TestQuery {
  Stakemon_Staked(limit: 5, order_by: {timestamp: desc}) {
    id
    user
    amount
    timestamp
  }
}
```

4. Verify data is being indexed

### **In Dashboard:**

1. Connect MetaMask
2. Navigate to Dashboard (`/dashboard`)
3. Scroll to "Staking History" section
4. Verify events are displayed

---

## 📝 Data Format

### **Event ID Format:**
```
{chainId}_{blockNumber}_{logIndex}
```

Example: `10143_44108578_2`

### **Amount Format:**
- Stored as: Wei (18 decimals)
- Displayed as: MON (formatted with `formatEther`)
- Example: `1000000000000000000` → `1 MON`

### **Timestamp Format:**
- Stored as: Unix timestamp (seconds)
- Displayed as: Localized date/time
- Example: `1760866200` → `19/10/2025, 16:30:00`

---

## 🚀 Deployment Checklist

- [x] Envio indexer initialized
- [x] Contract ABI configured
- [x] Events indexed successfully
- [x] GraphQL API deployed
- [x] Environment variables set
- [x] Component integrated into dashboard
- [x] Queries tested in playground
- [x] UI displays data correctly

---

## 🔄 Real-time Updates

The dashboard automatically refreshes staking info every 30 seconds via:
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    loadStakeInfo();
  }, 30000);
  return () => clearInterval(interval);
}, [userAddress]);
```

---

## 🎯 Benefits

1. **Historical Data** - View all past transactions
2. **Fast Queries** - Pre-indexed data for instant loading
3. **Aggregations** - Total staked/claimed without manual calculation
4. **Scalability** - GraphQL API handles complex queries efficiently
5. **Real-time** - Envio indexes new events within seconds

---

## 📚 Resources

- [Envio Documentation](https://docs.envio.dev/)
- [GraphQL Queries Guide](https://docs.envio.dev/docs/HyperIndex/contract-import)
- [Monad Explorer](https://testnet.monadexplorer.com/)
- [Project Repository](https://github.com/your-repo)

---

## ✅ Summary

**Envio Integration** provides:
- 📊 Historical staking data
- 💰 Aggregate statistics
- 🔍 Transaction history
- 📈 Real-time indexing
- 🎨 Beautiful UI display

**Perfect combination with Smart Contract reads** for complete staking dashboard! 🚀

