const hre = require("hardhat");

async function main() {
  const VoiceIt = await hre.ethers.getContractFactory("VoiceIt");
  const voiceIt = await VoiceIt.deploy();
  await voiceIt.waitForDeployment();
  console.log("Contract deployed to:", await voiceIt.getAddress());
}

main().catch((error) => { console.error(error); process.exitCode = 1; });