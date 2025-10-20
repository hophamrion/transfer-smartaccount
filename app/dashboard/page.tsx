"use client";

import { useState, useEffect } from "react";
import { useMetaMask } from "@/components/MetaMaskProvider";
import { getNativeBalance } from "@/lib/transfer";
import { formatEther } from "viem";
import TransferHistory from "@/components/TransferHistory";

export default function Dashboard() {
  const { account, smartAccount } = useMetaMask();
  const [balance, setBalance] = useState<bigint>(0n);
  const [loading, setLoading] = useState(true);

  // Use connected account
  const userAddress = smartAccount?.address || account;

  useEffect(() => {
    const loadBalance = async () => {
      if (!userAddress) {
        setLoading(false);
        return;
      }

      try {
        const bal = await getNativeBalance(userAddress);
        setBalance(bal);
      } catch (error) {
        console.error("Failed to load balance:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBalance();
    const interval = setInterval(loadBalance, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [userAddress]);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
      {/* Header Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '3rem',
        padding: '2rem 0'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
          borderRadius: '20px',
          marginBottom: '1.5rem',
          boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
        }}>
          <span style={{ fontSize: '2.5rem' }}>📊</span>
        </div>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '800', 
          margin: '0 0 1rem 0',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Envio Dashboard
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#6b7280', 
          margin: 0,
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.6'
        }}>
          Monitor your token transfers and balances in real-time with Envio indexing
        </p>
      </div>

      {!account ? (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '3rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔒</div>
            <h3 style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '1rem' 
            }}>
              Connect Your Wallet
            </h3>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '1.1rem',
              margin: 0,
              maxWidth: '400px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Please connect your MetaMask wallet to view your transfer dashboard
            </p>
          </div>
        </div>
      ) : loading ? (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '3rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(139, 92, 246, 0.2)',
              borderTop: '3px solid #8B5CF6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1.5rem auto'
            }}></div>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '1.1rem',
              margin: 0
            }}>
              Loading dashboard data...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
              gap: '2rem',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              {/* Current Balance */}
              <div style={{ 
                background: 'var(--bg-secondary)', 
                color: 'var(--text-primary)', 
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '2.5rem',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem',
                  color: 'var(--text-secondary)'
                }}>
                  Current Balance
                </div>
                <div style={{ 
                  fontSize: 'clamp(2rem, 5vw, 3rem)', 
                  fontWeight: 'bold', 
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  {parseFloat(formatEther(balance)).toFixed(5)} MON
                </div>
              </div>
              
              {/* Smart Account Address */}
              <div style={{ 
                background: 'var(--bg-secondary)', 
                color: 'var(--text-primary)', 
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '2.5rem',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem',
                  color: 'var(--text-secondary)'
                }}>
                  {smartAccount ? 'Smart Account Address' : 'Wallet Address'}
                </div>
                <div style={{ 
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                  fontWeight: '500', 
                  fontFamily: 'monospace',
                  lineHeight: 1.4,
                  wordBreak: 'break-all',
                  overflowWrap: 'break-word',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-tertiary)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  {smartAccount?.address || account}
                </div>
              </div>
              
            </div>
          </div>

          {/* Transfer History from Envio */}
          {userAddress && <TransferHistory userAddress={userAddress} />}
        </>
      )}
    </div>
  );
}
