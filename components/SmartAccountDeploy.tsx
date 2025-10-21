"use client";

import { useState, useEffect } from "react";
import { useMetaMask } from "./MetaMaskProvider";

export default function SmartAccountDeploy() {
  const { smartAccount, connect } = useMetaMask();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployTx, setDeployTx] = useState<string | null>(null);
  const [isDeployed, setIsDeployed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Auto-check Smart Account status when component loads
  useEffect(() => {
    if (smartAccount) {
      handleCheckSmartAccountStatus();
    }
  }, [smartAccount]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeploy = async () => {
    if (!smartAccount) {
      await connect();
      return;
    }

    if (isDeployed) {
      alert("Smart Account already deployed!");
      return;
    }

    setIsDeploying(true);
    try {
      const txHash = await smartAccount.deploy();
      setDeployTx(txHash);
      setIsDeployed(true);
      console.log("✅ Smart Account deployed:", txHash);
    } catch (error) {
      console.error("❌ Deployment failed:", error);
      alert("Deployment failed: " + (error as Error).message);
    } finally {
      setIsDeploying(false);
    }
  };


  const handleCheckSmartAccountStatus = async () => {
    if (!smartAccount) return;

    setIsChecking(true);
    try {
      const status = await smartAccount.checkSmartAccountStatus();
      console.log("📋 Smart Account Status:", status);
      
      // Update deployment status based on check result
      setIsDeployed(status.isDeployed);
      
      console.log(`Smart Account Status: Address=${status.address}, Has Bytecode=${status.hasBytecode}, Bytecode Length=${status.bytecodeLength}, Is Deployed=${status.isDeployed}`);
    } catch (error) {
      console.error("❌ Failed to check Smart Account status:", error);
      setIsDeployed(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleTryAutomaticDeployment = async () => {
    if (!smartAccount) return;

    setIsDeploying(true);
    try {
      const txHash = await smartAccount.tryAutomaticDeployment();
      setDeployTx(txHash);
      
      // Assume deployed if transaction succeeded
      setIsDeployed(true);
      
      console.log("✅ Automatic deployment successful:", txHash);
    } catch (error) {
      console.error("❌ Automatic deployment failed:", error);
      alert("Automatic deployment failed: " + (error as Error).message);
    } finally {
      setIsDeploying(false);
    }
  };

  if (!smartAccount) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4" style={{background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7L12 3L21 7V21H3V7Z" stroke="white" strokeWidth="2"/>
              <path d="M9 21V12H15V21" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>
            Smart Account
          </h3>
          <p className="mb-4" style={{color: 'var(--text-secondary)'}}>
            Connect MetaMask to deploy your Smart Account and unlock advanced features
          </p>
          <button
            onClick={connect}
            className="btn-primary"
          >
            Connect MetaMask
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-lg mr-3" style={{background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)'}}>
        </div>
        <div>
          <h3 className="text-lg font-bold" style={{color: 'var(--text-primary)'}}>Smart Account</h3>
          <p className="text-xs" style={{color: 'var(--text-secondary)'}}>Deploy and manage your Smart Account</p>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="rounded-lg p-3" style={{background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)'}}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold" style={{color: 'var(--text-secondary)'}}>Address</span>
            <span className="text-xs" style={{color: 'var(--text-secondary)'}}>Deterministic</span>
          </div>
          <p className="font-mono text-xs p-2 rounded break-all" style={{background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)'}}>
            {smartAccount.address}
          </p>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg" style={{background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)'}}>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isChecking ? 'bg-blue-400 animate-pulse' : 
              isDeployed ? 'bg-green-400' : 'bg-yellow-400'
            }`}></div>
            <span className="text-xs font-semibold" style={{color: 'var(--text-primary)'}}>Status</span>
          </div>
          <span className="px-2 py-1 rounded-full text-xs font-medium" style={{background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)'}}>
            {isChecking ? 'Checking...' : isDeployed ? 'Deployed' : 'Not Deployed'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {!isDeployed && (
          <button
            onClick={handleTryAutomaticDeployment}
            disabled={isDeploying || isChecking}
            className={`w-full font-semibold py-2 px-4 rounded-lg transition-all duration-200 ${
              isDeploying || isChecking
                ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                : 'btn-primary'
            }`}
          >
            {isDeploying ? 'Deploying...' : 'Deploy Smart Account'}
          </button>
        )}
        
        <button
          onClick={handleCheckSmartAccountStatus}
          disabled={isChecking}
          className={`w-full font-semibold py-2 px-4 rounded-lg transition-all duration-200 ${
            isChecking ? 'bg-gray-600 cursor-not-allowed text-gray-400' : 'btn-secondary'
          }`}
        >
          {isChecking ? 'Checking...' : 'Refresh Status'}
        </button>
      </div>

      {deployTx && (
        <div className="mt-4 p-3 rounded-lg" style={{background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)'}}>
          <div className="flex items-center mb-1">
            <p className="text-xs font-semibold" style={{color: 'var(--text-primary)'}}>Deployed Successfully!</p>
          </div>
          <p className="text-xs mb-1" style={{color: 'var(--text-secondary)'}}>Transaction Hash:</p>
          <a
            href={`https://testnet-explorer.monad.xyz/tx/${deployTx}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs p-2 rounded break-all block"
            style={{background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#93c5fd'}}
          >
            {deployTx}
          </a>
        </div>
      )}

      {isDeployed && (
        <div className="mt-4 p-3 rounded-lg" style={{background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)'}}>
          <p className="text-xs font-semibold" style={{color: 'var(--text-primary)'}}>
            Smart Account is ready.
          </p>
        </div>
      )}
    </div>
  );
}
