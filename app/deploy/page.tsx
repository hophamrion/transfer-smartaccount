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
        {/* Header Section */}
        <div style={{ 
          textAlign: "center", 
          marginBottom: "3rem",
          padding: "2rem 0"
        }}>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "var(--text-primary)",
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Smart Account Setup
            </h1>
          <p style={{
            fontSize: "1.1rem",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}>
            Deploy your Smart Account and fund it with MON tokens for gasless transactions
          </p>
      </div>

        {/* Progress Steps */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "3rem",
          gap: "2rem"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.1rem"
            }}>
              1
            </div>
            <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>Deploy Account</span>
                </div>
                
          <div style={{
            width: "60px",
            height: "2px",
            background: "var(--border-color)",
            borderRadius: "1px"
          }}></div>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "var(--bg-tertiary)",
              border: "2px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
              fontWeight: "bold",
              fontSize: "1.1rem"
            }}>
              2
            </div>
            <span style={{ color: "var(--text-secondary)", fontWeight: "600" }}>Fund Account</span>
          </div>
        </div>

        <div style={{ 
          display: "grid", 
          gap: "2rem",
          animation: "fadeInUp 0.6s ease-out"
        }}>
          <div style={{
            animation: "fadeInUp 0.6s ease-out 0.1s both"
          }}>
            <SmartAccountDeploy />
          </div>
          <div style={{
            animation: "fadeInUp 0.6s ease-out 0.2s both"
          }}>
            <FundSmartAccount />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeployPage;
