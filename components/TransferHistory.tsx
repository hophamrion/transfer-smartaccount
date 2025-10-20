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

  // Default Envio API URL
  const defaultApiUrl = envioApiUrl || process.env.NEXT_PUBLIC_ENVIO_API_URL || "YOUR_PLAYGROUND_URL_HERE";

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

        // GraphQL query for transfer events
        const query = `
          query UserTransferHistory($user: String!, $userLower: String!) {
            Transfer_Sent: Transfer(
              where: { 
                _or: [
                  { from: { _eq: $user } },
                  { from: { _eq: $userLower } }
                ]
              }
              order_by: { timestamp: desc }
              limit: 50
            ) {
              id
              from
              to
              value
              timestamp
              transactionHash
            }
            
            Transfer_Received: Transfer(
              where: { 
                _or: [
                  { to: { _eq: $user } },
                  { to: { _eq: $userLower } }
                ]
              }
              order_by: { timestamp: desc }
              limit: 50
            ) {
              id
              from
              to
              value
              timestamp
              transactionHash
            }
          }
        `;

        const response = await fetch(defaultApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: { 
              user: userAddress,
              userLower: userAddress.toLowerCase()
            }
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        const sent = data.data.Transfer_Sent || [];
        const received = data.data.Transfer_Received || [];
        
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
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2.5rem',
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
            Loading transfer history...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2.5rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: '#dc2626', 
            marginBottom: '0.5rem' 
          }}>
            Failed to Load History
          </h3>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '1rem',
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
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2.5rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '0.5rem' 
          }}>
            No Transfer History
          </h3>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '1rem',
            margin: '0 0 1rem 0'
          }}>
            Envio indexer is running but no transfers found for this address
          </p>
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#6b7280'
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
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(139, 92, 246, 0.1)'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>📈</span>
            Transfer History
          </h3>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '1rem',
            margin: 0
          }}>
            Your recent transfers and transactions
          </p>
        </div>

        {/* Aggregate Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            borderRadius: '12px',
            border: '1px solid #fecaca'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: '600', marginBottom: '0.5rem' }}>
              📤 Total Sent
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#991b1b' }}>
              {formatEther(BigInt(totalSent))} MON
            </div>
            <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem' }}>
              {sentTransfers.length} transaction{sentTransfers.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            borderRadius: '12px',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#16a34a', fontWeight: '600', marginBottom: '0.5rem' }}>
              📥 Total Received
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#14532d' }}>
              {formatEther(BigInt(totalReceived))} MON
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.25rem' }}>
              {receivedTransfers.length} transaction{receivedTransfers.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderRadius: '12px',
            border: '1px solid #bae6fd'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#0369a1', fontWeight: '600', marginBottom: '0.5rem' }}>
              💰 Net Balance
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0c4a6e' }}>
              {formatEther(BigInt(totalReceived) - BigInt(totalSent))} MON
            </div>
            <div style={{ fontSize: '0.75rem', color: '#0369a1', marginTop: '0.25rem' }}>
              {allTransfers.length} total transaction{allTransfers.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Transfer List */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem' 
        }}>
          {allTransfers.map((transfer) => {
            const isSent = transfer.from.toLowerCase() === userAddress.toLowerCase();
            
            return (
              <div
                key={transfer.id}
                style={{
                  padding: '1.5rem',
                  background: isSent
                    ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
                    : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  borderRadius: '12px',
                  border: isSent
                    ? '1px solid #fecaca'
                    : '1px solid #bbf7d0',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
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
                  gap: '1rem'
                }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1.25rem' }}>
                        {isSent ? '📤' : '📥'}
                      </span>
                      <span style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold',
                        color: isSent ? '#dc2626' : '#16a34a'
                      }}>
                        {isSent ? 'Sent' : 'Received'}
                      </span>
                    </div>
                    
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold',
                      color: isSent ? '#dc2626' : '#16a34a',
                      marginBottom: '0.5rem'
                    }}>
                      {formatEther(BigInt(transfer.value))} MON
                    </div>
                    
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>
                      {isSent ? 'To' : 'From'}: <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>
                        {formatAddress(isSent ? transfer.to : transfer.from)}
                      </span>
                    </div>
                    
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280'
                    }}>
                      {formatDate(transfer.timestamp)}
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end',
                    gap: '0.5rem'
                  }}>
                    <a
                      href={getExplorerUrl(transfer.transactionHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: '#8B5CF6',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                      }}
                    >
                      <span>🔗</span>
                      View on Explorer
                    </a>
                    
                    {transfer.transactionHash && (
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#9ca3af',
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

