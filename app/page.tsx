'use client';

import Link from 'next/link';
import { useMetaMask } from '@/components/MetaMaskProvider';

export default function Home() {
  const { account } = useMetaMask();

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        borderRadius: '24px',
        padding: '4rem 3rem',
        color: 'var(--text-primary)',
        marginBottom: '3rem',
        textAlign: 'center',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '24px', pointerEvents: 'none',
          background: 'radial-gradient(1200px 400px at 50% -10%, rgba(139,92,246,0.25), transparent), radial-gradient(800px 300px at 100% 10%, rgba(59,130,246,0.18), transparent)'
        }}></div>
        <div style={{ 
          display: 'inline-block',
          backgroundColor: 'var(--bg-tertiary)',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.875rem',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-color)',
          color: 'var(--text-secondary)'
        }}>
          Monad Testnet • ERC-4337 • Gasless Transfers
        </div>
        
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          margin: '0 0 1.5rem 0',
          lineHeight: '1.2',
        }}>
          Transfer Tokens,<br />The Smart Way
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          opacity: '0.95',
          maxWidth: '700px',
          margin: '0 auto 2rem',
          lineHeight: '1.6',
        }}>
          Simple, secure, and gasless token transfers on Monad testnet. 
          Send MON and ERC-20 tokens to multiple recipients with Smart Accounts.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            href="/transfer"
            style={{
              display: 'inline-block', padding: '1rem 2.5rem', borderRadius: '12px',
              textDecoration: 'none', fontSize: '1.125rem', fontWeight: 700,
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', color: '#fff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
            }}
          >
            Start Transferring →
          </Link>
          
          <Link 
            href="/dashboard"
            style={{
              display: 'inline-block', padding: '1rem 2.5rem',
              color: 'var(--text-primary)', border: '1px solid var(--border-color)',
              background: 'var(--bg-tertiary)', borderRadius: '12px', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 600
            }}
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {[
          { label: 'Transfer Type', value: 'Multi-Token', color: '#8b5cf6' },
          { label: 'Speed', value: 'Instant', color: '#3b82f6' },
          { label: 'Security', value: 'ERC-4337', color: '#06b6d4' },
          { label: 'Batch Support', value: 'Yes', color: '#10b981' },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '3rem',
          color: 'var(--text-primary)',
        }}>
          How It Works
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}>
          {[
            {
              step: '1',
              title: 'Connect Wallet',
              description: 'Connect your MetaMask wallet and deploy your Smart Account. One-time setup for gasless transactions.',
            },
            {
              step: '2',
              title: 'Choose Transfer Type',
              description: 'Send native MON or any ERC-20 token. Single transfer or batch transfer to multiple recipients.',
            },
            {
              step: '3',
              title: 'Enter Details',
              description: 'Enter recipient address and amount. Save addresses to your address book for quick access.',
            },
            {
              step: '4',
              title: 'Send Instantly',
              description: 'Execute transfer with Smart Account. Enjoy gasless transactions powered by ERC-4337.',
            },
          ].map((feature) => (
            <div key={feature.step} className="card">
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                color: 'white',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1rem',
              }}>
                {feature.step}
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
                color: 'var(--text-primary)',
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: 'var(--text-secondary)',
                margin: 0,
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Advanced Features */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '3rem',
          color: 'var(--text-primary)',
        }}>
          Advanced Features
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
        }}>
          <div className="card">
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
              marginTop: 0,
            }}>
              Batch Transfers
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
              Send tokens to multiple recipients in a single transaction. Save gas and time with batch operations. Import from CSV for convenience.
            </p>
          </div>

          <div className="card">
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
              marginTop: 0,
            }}>
              Address Book
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
              Save frequently used addresses with labels and notes. Quick access for repeated transfers. All stored locally in your browser.
            </p>
          </div>

          <div className="card">
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
              marginTop: 0,
            }}>
              Transfer History
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
              Track all your transfers with real-time indexing by Envio. View sent, received, and total amounts with detailed transaction history.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!account && (
        <section style={{
          padding: '3rem',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
          borderRadius: '24px',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
          }}>
            Ready to Start Transferring?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            opacity: '0.95',
            marginBottom: '2rem',
          }}>
            Connect your wallet and experience the power of Smart Accounts
          </p>
          <Link 
            href="/transfer"
            style={{
              display: 'inline-block',
              padding: '1rem 2.5rem',
              backgroundColor: 'white',
              color: '#8b5cf6',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '1.125rem',
              fontWeight: '700',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
          >
            Get Started Now →
          </Link>
        </section>
      )}

      {/* Info Section */}
      <section style={{
        marginTop: '3rem',
        padding: '2rem',
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
      }}>
        <h3 style={{ marginTop: 0, color: 'var(--text-primary)', marginBottom: '1rem' }}>Important Information</h3>
        <ul style={{ lineHeight: '1.8', color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
          <li><strong>Network:</strong> Monad Testnet (Chain ID: 10143)</li>
          <li><strong>Smart Accounts:</strong> Powered by ERC-4337 Account Abstraction</li>
          <li><strong>Bundler:</strong> Pimlico for user operation processing</li>
          <li><strong>Indexer:</strong> Envio for real-time transaction tracking</li>
          <li><strong>Security:</strong> Non-custodial, you control your keys</li>
          <li><strong>Support:</strong> Native MON and any ERC-20 token</li>
        </ul>
      </section>
    </div>
  );
}
