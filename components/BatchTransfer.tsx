'use client';

import { useState, useEffect } from 'react';
import { useMetaMask } from './MetaMaskProvider';
import { batchTransfer, isValidAddress, type TransferRecipient } from '@/lib/transfer';
import { parseEther, formatEther, type Address } from 'viem';

export default function BatchTransfer() {
  const { smartAccount, account, ensureConnected } = useMetaMask();
  const [recipients, setRecipients] = useState<Array<{ address: string; amount: string }>>([
    { address: '', amount: '' },
    { address: '', amount: '' }
  ]);
  const [csvText, setCsvText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<React.ReactNode | null>(null);
  
  function addRecipient() {
    setRecipients([...recipients, { address: '', amount: '' }]);
  }
  
  function removeRecipient(index: number) {
    setRecipients(recipients.filter((_, i) => i !== index));
  }
  
  function updateRecipient(index: number, field: 'address' | 'amount', value: string) {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  }
  
  function parseCSV() {
    try {
      const lines = csvText.trim().split('\n');
      const parsed = lines
        .filter(line => line.trim())
        .map(line => {
          const [address, amount] = line.split(',').map(s => s.trim());
          return { address, amount };
        });
      
      if (parsed.length === 0) {
        setError('No valid recipients found in CSV');
        return;
      }
      
      setRecipients(parsed);
      setCsvText('');
      setError(null);
      setSuccess(`✅ Loaded ${parsed.length} recipients from CSV`);
    } catch (err) {
      setError('Failed to parse CSV. Format: address,amount (one per line)');
    }
  }
  
  async function handleBatchTransfer() {
    // Validation
    if (recipients.length === 0) {
      setError('Please add at least one recipient');
      return;
    }
    
    // Validate all recipients
    for (let i = 0; i < recipients.length; i++) {
      const r = recipients[i];
      
      if (!r.address || !r.amount) {
        setError(`Recipient ${i + 1}: Address and amount are required`);
        return;
      }
      
      if (!isValidAddress(r.address)) {
        setError(`Recipient ${i + 1}: Invalid address`);
        return;
      }
      
      if (Number(r.amount) <= 0) {
        setError(`Recipient ${i + 1}: Amount must be greater than 0`);
        return;
      }
    }
    
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      // Ensure wallet is connected first
      await ensureConnected();
      
      // Check if smart account is available
      if (!smartAccount) {
        setError('Smart account not available. Please go to Deploy page and deploy your Smart Account first.');
        return;
      }
      
      // Check if smart account is deployed
      const status = await smartAccount.checkSmartAccountStatus();
      if (!status.isDeployed) {
        setError('Smart account is not deployed yet. Please go to Deploy page and deploy your Smart Account first.');
        return;
      }
      
      // Convert to TransferRecipient[]
      const recipientList: TransferRecipient[] = recipients.map(r => ({
        address: r.address as Address,
        amount: parseEther(r.amount)
      }));
      
      // Calculate total
      const totalAmount = recipientList.reduce((sum, r) => sum + r.amount, 0n);
      
      console.log('🚀 Batch transferring to', recipientList.length, 'recipients');
      console.log('💰 Total amount:', formatEther(totalAmount), 'MON');
      
      const txHash = await batchTransfer(smartAccount, recipientList, true);
      
      setSuccess(
        <span>
          ✅ Batch transfer completed! Sent to {recipientList.length} recipients. Total: {formatEther(totalAmount)} MON. Tx:{' '}
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
      
      // Clear form
      setRecipients([{ address: '', amount: '' }, { address: '', amount: '' }]);
      
    } catch (error: any) {
      console.error('Batch transfer failed:', error);
      setError(error?.message || 'Batch transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  if (!account) {
    return (
      <div className="card">
        <h3 style={{marginTop: 0, color: 'var(--text-primary)'}}>Batch Transfer</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Please connect your MetaMask wallet to use batch transfer
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
        <h3 style={{marginTop: 0, color: 'var(--text-primary)'}}>Batch Transfer</h3>
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
            Your Smart Account needs to be deployed before you can use batch transfer. 
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
  
  const totalAmount = recipients.reduce((sum, r) => {
    const amount = Number(r.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  return (
    <div className="batch-transfer-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
      {/* Alert Messages */}
      {error && (
        <div style={{ 
          padding: '1.25rem', 
          marginBottom: '2rem', 
          background: 'rgba(239,68,68,0.1)', 
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '12px',
          color: '#ef4444',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>❌</span>
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
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>✅</span>
            <span style={{ fontWeight: '500' }}>{success}</span>
          </div>
        </div>
      )}
      
      {/* CSV Import */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h4 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold', 
          color: 'var(--text-primary)', 
          marginTop: 0,
          marginBottom: '1rem',
          
        }}>
          Import from CSV
        </h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Format: address,amount (one per line). Example:<br />
          <code style={{ background: 'var(--bg-tertiary)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
            0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb,1.5
          </code>
        </p>
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb,1.5
0x123456789abcdef123456789abcdef123456789,2.0"
          rows={4}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '0.875rem',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            outline: 'none',
            fontFamily: 'monospace',
            marginBottom: '1rem',
            resize: 'vertical',
            background: 'var(--bg-secondary)', color: 'var(--text-primary)'
          }}
        />
        <button
          onClick={parseCSV}
          disabled={loading || !csvText.trim()}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#fff',
            background: loading || !csvText.trim() ? '#6b7280' : 'linear-gradient(135deg, #8B5CF6 0%, #3b82f6 100%)',
            border: 'none',
            borderRadius: '12px',
            cursor: loading || !csvText.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          Load CSV
        </button>
      </div>
      
      {/* Recipients List */}
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
            Batch Transfer
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1rem', 
            lineHeight: '1.5',
            margin: 0
          }}>
            Send MON to multiple recipients in one transaction
          </p>
        </div>
        
        {/* Recipients */}
        <div style={{ marginBottom: '2rem' }}>
          {recipients.map((recipient, index) => (
            <div key={index} style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr auto', 
              gap: '1rem',
              marginBottom: '1rem',
              padding: '1rem',
              background: 'var(--bg-tertiary)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                }}>
                  Recipient #{index + 1}
                </label>
                <input
                  type="text"
                  value={recipient.address}
                  onChange={(e) => updateRecipient(index, 'address', e.target.value)}
                  placeholder="0x..."
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    outline: 'none',
                    fontFamily: 'monospace',
                    background: 'var(--bg-secondary)', color: 'var(--text-primary)'
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                }}>
                  Amount (MON)
                </label>
                <input
                  type="number"
                  value={recipient.amount}
                  onChange={(e) => updateRecipient(index, 'amount', e.target.value)}
                  placeholder="0.0"
                  min="0"
                  step="0.000001"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    outline: 'none',
                    background: 'var(--bg-secondary)', color: 'var(--text-primary)'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  onClick={() => removeRecipient(index)}
                  disabled={loading || recipients.length <= 1}
                  style={{
                    padding: '0.75rem',
                    fontSize: '1rem',
                    color: recipients.length <= 1 ? '#9ca3af' : '#ef4444',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: recipients.length <= 1 || loading ? 'not-allowed' : 'pointer',
                  }}
                  title="Remove recipient"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Add Recipient Button */}
        <button
          onClick={addRecipient}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#c4b5fd',
            background: 'var(--bg-secondary)',
            border: '2px dashed var(--border-color)',
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '2rem',
          }}
        >
          Add Recipient
        </button>
        
        {/* Summary */}
        <div style={{ 
          padding: '1.5rem',
          background: 'var(--bg-tertiary)',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Total Recipients:</span>
            <strong style={{ color: 'var(--text-primary)' }}>{recipients.length}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Total Amount:</span>
            <strong style={{ color: 'var(--text-primary)', fontSize: '1.25rem' }}>{totalAmount.toFixed(6)} MON</strong>
          </div>
        </div>
        
        {/* Send Button */}
        <button
          onClick={handleBatchTransfer}
          disabled={loading || recipients.length === 0 || totalAmount === 0}
          style={{
            width: '100%',
            padding: '1.25rem',
            fontSize: '1.125rem',
            fontWeight: '700',
            color: '#fff',
            background: loading || recipients.length === 0 || totalAmount === 0 ? '#6b7280' : 'linear-gradient(135deg, #8B5CF6 0%, #3b82f6 100%)',
            border: 'none',
            borderRadius: '12px',
            cursor: loading || recipients.length === 0 || totalAmount === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: loading || recipients.length === 0 || totalAmount === 0
              ? 'none' 
              : '0 8px 25px rgba(139, 92, 246, 0.3)',
          }}
        >
          {loading ? 'Processing...' : `Send to ${recipients.length} Recipients`}
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
          Batch Transfer Benefits
        </h4>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '1.5rem', 
          color: 'var(--text-secondary)',
          lineHeight: '1.8'
        }}>
          <li>Send to multiple recipients in a single transaction</li>
          <li>Save on gas fees compared to individual transfers</li>
          <li>Import recipients from CSV for convenience</li>
          <li>All transfers executed atomically (all succeed or all fail)</li>
        </ul>
      </div>
    </div>
  );
}

