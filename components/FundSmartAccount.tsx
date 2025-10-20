'use client';

import { useState } from "react";
import { useMetaMask } from "./MetaMaskProvider";
import { parseEther, formatEther } from "viem";

export default function FundSmartAccount() {
  const { smartAccount } = useMetaMask();
  const [amount, setAmount] = useState("0.1");
  const [isSending, setIsSending] = useState(false);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const checkBalance = async () => {
    if (!smartAccount || typeof window === 'undefined' || !window.ethereum) return;

    try {
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [smartAccount.address, 'latest'],
      });
      
      const balanceValue = BigInt(balanceHex as string);
      setBalance(balanceValue);
      console.log('💰 Smart Account balance:', formatEther(balanceValue), 'MON');
    } catch (error) {
      console.error('❌ Failed to check balance:', error);
    }
  };

  const handleFund = async () => {
    if (!smartAccount || typeof window === 'undefined' || !window.ethereum) return;

    setIsSending(true);
    setTxHash(null);

    try {
      const amountWei = parseEther(amount);
      
      // Get EOA address
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const eoaAddress = accounts[0];

      console.log('💸 Sending', amount, 'MON from EOA to Smart Account...');
      console.log('👤 From:', eoaAddress);
      console.log('🏦 To:', smartAccount.address);

      // Send MON from EOA to Smart Account
      const hash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: eoaAddress,
          to: smartAccount.address,
          value: `0x${amountWei.toString(16)}`,
        }],
      });

      setTxHash(hash as string);
      console.log('✅ Transfer successful:', hash);

      // Wait a bit then check balance
      setTimeout(() => checkBalance(), 2000);
    } catch (error) {
      console.error('❌ Transfer failed:', error);
      alert('Transfer failed: ' + (error as Error).message);
    } finally {
      setIsSending(false);
    }
  };

  if (!smartAccount) {
    return null;
  }

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-lg mr-4" style={{background: 'linear-gradient(135deg, #22c55e, #10b981)'}}></div>
        <div>
          <h3 className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>Fund Smart Account</h3>
          <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Add MON to pay for gas fees</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl p-4" style={{background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)'}}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{color: 'var(--text-primary)'}}>Smart Account Balance</span>
            <button
              onClick={checkBalance}
              className="text-xs font-medium"
              style={{color: '#c4b5fd'}}
            >
              Refresh
            </button>
          </div>
          <p className="text-2xl font-bold" style={{color: 'var(--text-primary)'}}>
            {balance !== null ? `${formatEther(balance)} MON` : 'Click refresh'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{color: 'var(--text-primary)'}}>
            Amount to Send (MON)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.1"
            min="0"
            className="w-full px-4 py-3 rounded-xl focus:outline-none"
            style={{background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)'}}
            placeholder="0.1"
          />
          <p className="text-xs mt-2" style={{color: 'var(--text-secondary)'}}>
            Recommended: 0.1 MON for gas fees
          </p>
        </div>

        <button
          onClick={handleFund}
          disabled={isSending || !amount || parseFloat(amount) <= 0}
          className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 ${
            isSending || !amount || parseFloat(amount) <= 0
              ? 'bg-gray-600 cursor-not-allowed text-gray-400'
              : 'btn-primary'
          }`}
        >
          {isSending ? 'Sending...' : `Send ${amount} MON to Smart Account`}
        </button>
      </div>

      {txHash && (
        <div className="mt-6 p-4 rounded-xl" style={{background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)'}}>
          <p className="text-sm font-semibold" style={{color: 'var(--text-primary)'}}>Transfer Successful!</p>
          <p className="text-xs mb-2" style={{color: 'var(--text-secondary)'}}>Transaction Hash:</p>
          <a
            href={`https://testnet-explorer.monad.xyz/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs p-2 rounded-lg break-all block"
            style={{background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#93c5fd'}}
          >
            {txHash}
          </a>
        </div>
      )}
    </div>
  );
}

