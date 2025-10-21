"use client";
import React from "react";
import SmartAccountDeploy from "@/components/SmartAccountDeploy";
import FundSmartAccount from "@/components/FundSmartAccount";

const DeployPage: React.FC = () => {
  return (
    <div style={{ padding: "1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "grid", gap: "1.5rem" }}>
        <SmartAccountDeploy />
        <FundSmartAccount />
      </div>
    </div>
  );
};

export default DeployPage;
