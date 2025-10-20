'use client';

import { useState, useEffect } from 'react';
import { useMetaMask } from './MetaMaskProvider';
import { 
  transferNative, 
  transferERC20, 
  getNativeBalance, 
  getTokenInfo,
  isValidAddress,
  formatTokenAmount,
  parseTokenAmount,
  type TokenInfo 
} from '@/lib/transfer';
import { formatEther, parseEther, type Address } from 'viem';

export default function TransferForm() {
  const { smartAccount, account, ensureConnected } = useMetaMask();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<React.ReactNode | null>(null);
  
  // Token selection
  const [transferType, setTransferType] = useState<'native' | 'erc20'>('native');
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  
  // Balance
  const [balance, setBalance] = useState<bigint>(0n);
  
  // Load balance when smart account is available
  useEffect(() => {
    if (smartAccount?.address) {
      loadBalance();
      
      // Auto-refresh every 10 seconds
      const interval = setInterval(loadBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [smartAccount, transferType, tokenAddress]);
  
  async function loadBalance() {
    if (!smartAccount?.address) return;
    
    try {
      if (transferType === 'native') {
        const bal = await getNativeBalance(smartAccount.address);
        setBalance(bal);
      } else if (transferType === 'erc20' && tokenAddress && isValidAddress(tokenAddress)) {
        const info = await getTokenInfo(tokenAddress as Address, smartAccount.address);
        setTokenInfo(info);
        setBalance(info.balance);
      }
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  }
  
  async function handleTransfer() {
    // Validation
    if (!recipient || !amount) {
      setError('Please enter recipient address and amount');
      return;
    }
    
    if (!isValidAddress(recipient)) {
      setError('Invalid recipient address');
      return;
    }
    
    if (Number(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    
    if (transferType === 'erc20' && !tokenAddress) {
      setError('Please enter token contract address');
      return;
    }
    
    if (transferType === 'erc20' && !isValidAddress(tokenAddress)) {
      setError('Invalid token contract address');
      return;
    }
    
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      await ensureConnected();
      
      if (!smartAccount) {
        throw new Error('Smart account not available');
      }

      let txHash: `0x${string}`;
      
      if (transferType === 'native') {
        const amountWei = parseEther(amount);
        txHash = await transferNative(smartAccount, recipient as Address, amountWei);
        
        setSuccess(
          <span>
            ✅ Transferred {amount} MON to {recipient.slice(0, 6)}...{recipient.slice(-4)}! Tx:{' '}
            <a
              href={`https://testnet.monadexplorer.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2563eb', textDecoration: 'underline', fontFamily: 'monospace' }}
            >
              {txHash}
            </a>
          </span>
        );
      } else {
        if (!tokenInfo) {
          throw new Error('Token info not loaded');
        }
        
        const amountWei = parseTokenAmount(amount, tokenInfo.decimals);
        txHash = await transferERC20(
          smartAccount, 
          tokenAddress as Address, 
          recipient as Address, 
          amountWei
        );
        
        setSuccess(
          <span>
            ✅ Transferred {amount} {tokenInfo.symbol} to {recipient.slice(0, 6)}...{recipient.slice(-4)}! Tx:{' '}
            <a
              href={`https://testnet.monadexplorer.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2563eb', textDecoration: 'underline', fontFamily: 'monospace' }}
            >
              {txHash}
            </a>
          </span>
        );
      }
      
      setRecipient('');
      setAmount('');
      
      // Reload balance
      setTimeout(loadBalance, 3000);
    } catch (error: any) {
      console.error('Transfer failed:', error);
      setError(error?.message || 'Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  function setMaxAmount() {
    if (transferType === 'native') {
      // Leave some for gas
      const maxAmount = balance > parseEther('0.01') ? balance - parseEther('0.01') : 0n;
      setAmount(formatEther(maxAmount));
    } else if (tokenInfo) {
      setAmount(formatTokenAmount(balance, tokenInfo.decimals));
    }
  }
  
  if (!account) {
    return (
      <div className="card">
        <h3 style={{marginTop: 0, color: 'var(--text-primary)'}}>Transfer Tokens</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Please connect your MetaMask wallet to start transferring tokens
        </p>
      </div>
    );
  }

  // Check if smart account is deployed
  const [smartAccountStatus, setSmartAccountStatus] = useState<{
    isDeployed: boolean;
    address: string;
  } | null>(null);

  useEffect(() => {
    if (smartAccount) {
      smartAccount.checkSmartAccountStatus().then(status => {
        setSmartAccountStatus({
          isDeployed: status.isDeployed,
          address: status.address
        });
      });
    }
  }, [smartAccount]);

  if (smartAccount && smartAccountStatus && !smartAccountStatus.isDeployed) {
    return (
      <div className="card">
        <h3 style={{marginTop: 0, color: 'var(--text-primary)'}}>Transfer Tokens</h3>
        <div style={{ 
          padding: '1.5rem', 
          background: 'rgba(245,158,11,0.1)', 
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: '12px',
          color: '#f59e0b',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <span style={{ fontWeight: '600' }}>Smart Account Not Deployed</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            Your Smart Account needs to be deployed before you can transfer tokens. 
            Please go to the <strong>Deploy</strong> page and deploy your Smart Account first.
          </p>
        </div>
        <div style={{ 
          padding: '1rem', 
          background: 'var(--bg-tertiary)', 
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <strong>Smart Account Address:</strong> {smartAccountStatus.address}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="transfer-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
      {/* Alert Messages */}
      {error && (
        <div style={{ 
          padding: '1.25rem', 
          marginBottom: '2rem', 
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '12px',
          color: '#ef4444',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: '500' }}>{error}</span>
          </div>
        </div>
      )}
      
      {success && (
        <div style={{ 
          padding: '1.25rem', 
          marginBottom: '2rem', 
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '12px',
          color: '#10b981',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: '500' }}>{success}</span>
          </div>
        </div>
      )}

      {/* Balance Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Available Balance
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1 }}>
          {transferType === 'native' 
            ? formatEther(balance)
            : tokenInfo 
              ? formatTokenAmount(balance, tokenInfo.decimals)
              : '0'
          }
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '0.25rem', opacity: 0.85 }}>
          {transferType === 'native' ? 'MON' : tokenInfo?.symbol || 'Tokens'}
        </div>
      </div>
      
      {/* Transfer Form */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 'bold', 
            color: 'var(--text-primary)', 
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            Transfer Tokens
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1rem', 
            lineHeight: '1.5',
            margin: 0
          }}>
            Send MON or ERC-20 tokens to any address on Monad Testnet
          </p>
        </div>
        
        {/* Transfer Type Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.75rem', 
            fontWeight: '600',
            color: 'var(--text-primary)',
            fontSize: '1rem'
          }}>
            Transfer Type
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setTransferType('native')}
              disabled={loading}
              style={{
                flex: 1,
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: transferType === 'native' ? '#fff' : 'var(--text-secondary)',
                background: transferType === 'native' ? 'linear-gradient(135deg, #8B5CF6 0%, #3b82f6 100%)' : 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Native MON
            </button>
            <button
              onClick={() => setTransferType('erc20')}
              disabled={loading}
              style={{
                flex: 1,
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: transferType === 'erc20' ? '#fff' : 'var(--text-secondary)',
                background: transferType === 'erc20' ? 'linear-gradient(135deg, #8B5CF6 0%, #3b82f6 100%)' : 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              ERC-20 Token
            </button>
          </div>
        </div>
        
        {/* Token Address (for ERC-20) */}
        {transferType === 'erc20' && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem', 
              fontWeight: '600',
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}>
              Token Contract Address
            </label>
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              onBlur={loadBalance}
              placeholder="0x..."
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                fontSize: '1rem',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.3s ease',
                background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                fontFamily: 'monospace',
              }}
            />
            {tokenInfo && (
              <div style={{ 
                marginTop: '0.5rem', 
                fontSize: '0.875rem', 
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {tokenInfo.name} ({tokenInfo.symbol})
              </div>
            )}
          </div>
        )}
        
        {/* Recipient Address */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.75rem', 
            fontWeight: '600',
            color: 'var(--text-primary)',
            fontSize: '1rem'
          }}>
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              fontSize: '1rem',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              outline: 'none',
              transition: 'all 0.3s ease',
              background: 'var(--bg-secondary)', color: 'var(--text-primary)',
              fontFamily: 'monospace',
            }}
          />
        </div>
        
        {/* Amount */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label style={{ 
              fontWeight: '600',
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}>
              Amount
            </label>
            <button
              onClick={setMaxAmount}
              disabled={loading || balance === 0n}
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#c4b5fd',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                cursor: loading || balance === 0n ? 'not-allowed' : 'pointer',
              }}
            >
              MAX
            </button>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            min="0"
            step="0.000001"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              fontSize: '1.125rem',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              outline: 'none',
              transition: 'all 0.3s ease',
              background: 'var(--bg-secondary)', color: 'var(--text-primary)',
            }}
          />
        </div>
        
        {/* Transfer Button */}
        <button
          onClick={handleTransfer}
          disabled={loading || !recipient || !amount || Number(amount) <= 0}
          style={{
            width: '100%',
            padding: '1.25rem',
            fontSize: '1.125rem',
            fontWeight: '700',
            color: '#fff',
            background: loading || !recipient || !amount || Number(amount) <= 0 ? '#6b7280' : 'linear-gradient(135deg, #8B5CF6 0%, #3b82f6 100%)',
            border: 'none',
            borderRadius: '12px',
            cursor: loading || !recipient || !amount || Number(amount) <= 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: loading || !recipient || !amount || Number(amount) <= 0
              ? 'none' 
              : '0 8px 25px rgba(139, 92, 246, 0.3)',
          }}
        >
          {loading ? 'Transferring...' : 'Send Transfer'}
        </button>
      </div>
      
      {/* Info Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <h4 style={{ 
          marginTop: 0, 
          marginBottom: '1rem',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)'
        }}>
          Transfer Info
        </h4>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '1.5rem', 
          color: 'var(--text-secondary)',
          lineHeight: '1.8'
        }}>
          <li>Instant transfers using Smart Account (ERC-4337)</li>
          <li>Support for native MON and ERC-20 tokens</li>
          <li>Gasless transactions via Pimlico bundler</li>
          <li>Transaction history tracked by Envio indexer</li>
        </ul>
      </div>
    </div>
  );
}

