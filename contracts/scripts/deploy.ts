import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy Semaphore first (or use existing address)
  // For this example, we'll assume Semaphore is already deployed
  const SEMAPHORE_ADDRESS = process.env.SEMAPHORE_ADDRESS || "0x0000000000000000000000000000000000000000";

  const DemographicsVerifier = await ethers.getContractFactory("DemographicsVerifier");
  const demographicsVerifier = await DemographicsVerifier.deploy(SEMAPHORE_ADDRESS);

  await demographicsVerifier.waitForDeployment();

  const address = await demographicsVerifier.getAddress();
  console.log("DemographicsVerifier deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

