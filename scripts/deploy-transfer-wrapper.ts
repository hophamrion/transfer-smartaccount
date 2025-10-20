import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying TransferEventWrapper contract...");

  // Get the contract factory
  const TransferEventWrapper = await ethers.getContractFactory("TransferEventWrapper");

  // Deploy the contract
  const transferWrapper = await TransferEventWrapper.deploy();

  // Wait for deployment to complete
  await transferWrapper.waitForDeployment();

  const contractAddress = await transferWrapper.getAddress();

  console.log("✅ TransferEventWrapper deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🌐 Network: Monad Testnet");
  console.log("🔗 Explorer: https://testnet.monadexplorer.com/address/" + contractAddress);

  // Verify contract version
  const version = await transferWrapper.getVersion();
  console.log("📋 Contract Version:", version);

  // Save deployment info
  const deploymentInfo = {
    contractName: "TransferEventWrapper",
    contractAddress: contractAddress,
    network: "monad-testnet",
    chainId: 10143,
    deployer: await ethers.provider.getSigner().getAddress(),
    deploymentTime: new Date().toISOString(),
    version: version
  };

  console.log("\n📄 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🎯 Next Steps:");
  console.log("1. Update Envio config with contract address:", contractAddress);
  console.log("2. Update transfer.ts to use this contract for emitting events");
  console.log("3. Deploy and start Envio indexing");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
