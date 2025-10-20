'use client';

import { useState } from 'react';
import TransferForm from '@/components/TransferForm';
import BatchTransfer from '@/components/BatchTransfer';
import { useMetaMask } from '@/components/MetaMaskProvider';

type TabType = 'transfer' | 'batch';

export default function TransferPage() {
  const { account } = useMetaMask();
  const [activeTab, setActiveTab] = useState<TabType>('transfer');

  if (!account) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <div className="card" style={{
          padding: '3rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#8b5cf6' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Connect Your Wallet
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '0' }}>
            Please connect your MetaMask wallet to access transfer features
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: 'var(--text-primary)',
          marginBottom: '0.5rem'
        }}>
          Token Transfer
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
          Send MON and ERC-20 tokens with Smart Accounts
        </p>
      </div>

      {/* Smart Account Notice */}
      <div style={{ 
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '12px',
        color: '#3b82f6'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
          <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>Smart Account Required</span>
        </div>
        <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}>
          To use transfer features, you need to deploy your Smart Account first. 
          Go to the <strong>Deploy</strong> page to set up your Smart Account for gasless transactions.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '2px solid var(--border-color)',
        paddingBottom: '0',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setActiveTab('transfer')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.125rem',
            fontWeight: '600',
            color: activeTab === 'transfer' ? '#8b5cf6' : 'var(--text-secondary)',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'transfer' ? '3px solid #8b5cf6' : '3px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '-2px',
          }}
        >
          Simple Transfer
        </button>
        
        <button
          onClick={() => setActiveTab('batch')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.125rem',
            fontWeight: '600',
            color: activeTab === 'batch' ? '#8b5cf6' : 'var(--text-secondary)',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'batch' ? '3px solid #8b5cf6' : '3px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '-2px',
          }}
        >
          Batch Transfer
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'transfer' && <TransferForm />}
        {activeTab === 'batch' && <BatchTransfer />}
      </div>
    </div>
  );
}
