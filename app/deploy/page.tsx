"use client";
import React from "react";
import SmartAccountDeploy from "@/components/SmartAccountDeploy";
import FundSmartAccount from "@/components/FundSmartAccount";

const DeployPage: React.FC = () => {
  return (
    <div style={{ padding: "1.5rem" }}>
      <div className="grid-2-1">
        <div style={{ display: "grid", gap: "2rem" }}>
          <SmartAccountDeploy />
          <FundSmartAccount />
        </div>
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div className="card">
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0 }}>Benefits</h3>
            <ul style={{ color: "var(--text-secondary)", marginTop: "0.75rem", paddingLeft: "1rem" }}>
              <li>Gasless Transactions</li>
              <li>Enhanced Security</li>
              <li>Batch Operations</li>
              <li>Automation</li>
            </ul>
          </div>
          <div className="card">
            <h4 style={{ fontWeight: 700, margin: 0 }}>How it works</h4>
            <ol style={{ color: "var(--text-secondary)", marginTop: "0.75rem", paddingLeft: "1rem" }}>
              <li>Connect your MetaMask wallet</li>
              <li>Deploy your Smart Account (one-time)</li>
              <li>Use Smart Account for all operations</li>
              <li>Enjoy gasless features</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeployPage;
