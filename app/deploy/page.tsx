"use client";
import React from "react";
import SmartAccountDeploy from "@/components/SmartAccountDeploy";
import FundSmartAccount from "@/components/FundSmartAccount";

const DeployPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#020617] relative">
      {/* Magenta Orb Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#020617",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
            radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
          `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      />
      <div style={{ padding: "1.5rem", maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <SmartAccountDeploy />
          <FundSmartAccount />
        </div>
      </div>
    </div>
  );
};

export default DeployPage;
