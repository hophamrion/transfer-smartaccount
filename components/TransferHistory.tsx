"use client";

import { useState, useEffect } from "react";
import { formatEther } from "viem";

interface TransferEvent {
  id: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  transactionHash?: string;
}

interface TransferHistoryProps {
  userAddress: string;
  envioApiUrl?: string;
}

export default function TransferHistory({ userAddress, envioApiUrl }: TransferHistoryProps) {
  const [sentTransfers, setSentTransfers] = useState<TransferEvent[]>([]);
  const [receivedTransfers, setReceivedTransfers] = useState<TransferEvent[]>([]);
  const [totalSent, setTotalSent] = useState<string>("0");
  const [totalReceived, setTotalReceived] = useState<string>("0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default Envio API URL - UPDATED with correct endpoint
  const defaultApiUrl = "https://indexer.dev.hyperindex.xyz/2466180/v1/graphql";

  useEffect(() => {
    const fetchTransferHistory = async () => {
      if (!userAddress) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('🌐 Using Envio API URL:', defaultApiUrl);
        console.log('👤 Querying transfers for user:', userAddress);

        // GraphQL query for transfer events from Envio
        // Using exact query that works in playground
        const query = `
          query AllTransferEvents {
            Smart_TransferExecuted {
              id
              smartAccount
              to
              value
              transferType
              tokenAddress
              timestamp
              userOpHash
            }
            Smart_BatchTransferExecuted {
              id
              smartAccount
              recipientCount
              totalValue
              transferType
              tokenAddress
              timestamp
              userOpHash
            }
          }
        `;

        const response = await fetch(defaultApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        const transfers = data.data?.Smart_TransferExecuted || [];
        const batchTransfers = data.data?.Smart_BatchTransferExecuted || [];
        
        console.log('📊 Raw data from Envio:', { transfers, batchTransfers });
        
        // Filter on client side
        const sent = transfers
          .filter((t: any) => t.smartAccount?.toLowerCase() === userAddress?.toLowerCase())
          .map((t: any) => ({
            id: t.id,
            from: t.smartAccount,
            to: t.to,
            value: t.value,
            timestamp: t.timestamp,
            transactionHash: t.userOpHash
          }));
        
        const received = transfers
          .filter((t: any) => 
            t.to?.toLowerCase() === userAddress?.toLowerCase() && 
            t.smartAccount?.toLowerCase() !== userAddress?.toLowerCase()
          )
          .map((t: any) => ({
            id: t.id,
            from: t.smartAccount,
            to: t.to,
            value: t.value,
            timestamp: t.timestamp,
            transactionHash: t.userOpHash
          }));
        
        // Add batch transfers to sent (only from user's smart account)
        batchTransfers
          .filter((bt: any) => bt.smartAccount?.toLowerCase() === userAddress?.toLowerCase())
          .forEach((bt: any) => {
            sent.push({
              id: bt.id,
              from: bt.smartAccount,
              to: `${bt.recipientCount} recipients`,
              value: bt.totalValue,
              timestamp: bt.timestamp,
              transactionHash: bt.userOpHash
            });
          });
        
        console.log('🔍 Envio API Response:', data.data);
        console.log('📤 Sent Transfers:', sent);
        console.log('📥 Received Transfers:', received);
        
        setSentTransfers(sent);
        setReceivedTransfers(received);
        
        // Calculate totals
        const totalSentAmount = sent.reduce((sum: bigint, event: TransferEvent) => {
          return sum + BigInt(event.value);
        }, 0n);
        
        const totalReceivedAmount = received.reduce((sum: bigint, event: TransferEvent) => {
          return sum + BigInt(event.value);
        }, 0n);
        
        setTotalSent(totalSentAmount.toString());
        setTotalReceived(totalReceivedAmount.toString());

      } catch (error: any) {
        console.error('Failed to fetch transfer history:', error);
        setError(error.message || 'Failed to load transfer history');
      } finally {
        setLoading(false);
      }
    };

    fetchTransferHistory();
  }, [userAddress, defaultApiUrl]);

  const formatDate = (timestamp: string) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getExplorerUrl = (txHash?: string) => {
    if (txHash) {
      return `https://testnet.monadexplorer.com/tx/${txHash}`;
    }
    return `https://testnet.monadexplorer.com/address/${userAddress}`;
  };

  if (loading) {
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid var(--border-color)',
            borderTop: '2px solid var(--accent-purple)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }}></div>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.9rem',
            margin: 0
          }}>
            Loading transfer history...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #dc2626',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h3 style={{ 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            color: '#dc2626', 
            marginBottom: '0.5rem' 
          }}>
            Failed to Load History
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.85rem',
            margin: 0
          }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  const allTransfers = [
    ...sentTransfers.map(t => ({ ...t, type: 'sent' as const })),
    ...receivedTransfers.map(t => ({ ...t, type: 'received' as const }))
  ]
    // Remove duplicates
    .filter((transfer, index, self) => 
      index === self.findIndex(t => t.id === transfer.id)
    )
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 20); // Show latest 20 transfers

  if (allTransfers.length === 0) {
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
          <h3 style={{ 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            color: 'var(--text-primary)', 
            marginBottom: '0.5rem' 
          }}>
            No Transfer History
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.85rem',
            margin: '0 0 0.75rem 0'
          }}>
            Envio indexer is running but no transfers found for this address
          </p>
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}>
            <strong>Debug Info:</strong><br/>
            API URL: {defaultApiUrl}<br/>
            User: {userAddress}<br/>
            Transfers found: {sentTransfers.length + receivedTransfers.length}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border-color)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: 'var(--text-primary)', 
            marginBottom: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1rem' }}>📈</span>
            Transfer History
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.85rem',
            margin: 0
          }}>
            Your recent transfers and transactions
          </p>
        </div>

        {/* Aggregate Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            padding: '1rem',
            background: 'var(--bg-tertiary)',
            borderRadius: '8px',
            border: '1px solid #dc2626'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: '600', marginBottom: '0.25rem' }}>
              📤 Total Sent
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#dc2626' }}>
              {formatEther(BigInt(totalSent))} MON
            </div>
            <div style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: '0.25rem' }}>
              {sentTransfers.length} tx{sentTransfers.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div style={{
            padding: '1rem',
            background: 'var(--bg-tertiary)',
            borderRadius: '8px',
            border: '1px solid #16a34a'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600', marginBottom: '0.25rem' }}>
              📥 Total Received
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#16a34a' }}>
              {formatEther(BigInt(totalReceived))} MON
            </div>
            <div style={{ fontSize: '0.7rem', color: '#16a34a', marginTop: '0.25rem' }}>
              {receivedTransfers.length} tx{receivedTransfers.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div style={{
            padding: '1rem',
            background: 'var(--bg-tertiary)',
            borderRadius: '8px',
            border: '1px solid var(--accent-blue)'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: '600', marginBottom: '0.25rem' }}>
              💰 Net Balance
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
              {formatEther(BigInt(totalReceived) - BigInt(totalSent))} MON
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', marginTop: '0.25rem' }}>
              {allTransfers.length} total tx{allTransfers.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Transfer List */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem' 
        }}>
          {allTransfers.map((transfer) => {
            const isSent = transfer.from.toLowerCase() === userAddress.toLowerCase();
            
            return (
              <div
                key={transfer.id}
                style={{
                  padding: '1rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  border: isSent
                    ? '1px solid #dc2626'
                    : '1px solid #16a34a',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{ fontSize: '0.9rem' }}>
                        {isSent ? '📤' : '📥'}
                      </span>
                      <span style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: 'bold',
                        color: isSent ? '#dc2626' : '#16a34a'
                      }}>
                        {isSent ? 'Sent' : 'Received'}
                      </span>
                    </div>
                    
                    <div style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 'bold',
                      color: isSent ? '#dc2626' : '#16a34a',
                      marginBottom: '0.25rem'
                    }}>
                      {formatEther(BigInt(transfer.value))} MON
                    </div>
                    
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--text-secondary)',
                      marginBottom: '0.25rem'
                    }}>
                      {isSent ? 'To' : 'From'}: <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>
                        {formatAddress(isSent ? transfer.to : transfer.from)}
                      </span>
                    </div>
                    
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--text-secondary)'
                    }}>
                      {formatDate(transfer.timestamp)}
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end',
                    gap: '0.25rem'
                  }}>
                    <a
                      href={getExplorerUrl(transfer.transactionHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '0.4rem 0.75rem',
                        background: 'var(--bg-primary)',
                        color: 'var(--accent-purple)',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        border: '1px solid var(--accent-purple)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--accent-purple)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--bg-primary)';
                        e.currentTarget.style.color = 'var(--accent-purple)';
                      }}
                    >
                      <span>🔗</span>
                      Explorer
                    </a>
                    
                    {transfer.transactionHash && (
                      <div style={{ 
                        fontSize: '0.65rem', 
                        color: 'var(--text-secondary)',
                        fontFamily: 'monospace'
                      }}>
                        Tx: {transfer.transactionHash.slice(0, 8)}...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

