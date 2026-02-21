const hre = require("hardhat");

async function main() {
  const address = process.env.CONTRACT_ADDRESS;
  if (!address) {
    throw new Error("Please set CONTRACT_ADDRESS environment variable");
  }

  const VoiceIt = await hre.ethers.getContractFactory("VoiceIt");
  const contract = await VoiceIt.attach(address);

  const accounts = await hre.ethers.getSigners();

  const samples = [
    "I faced discrimination at my workplace.",
    "Local community lacks safe drinking water.",
    "I experienced unfair treatment at school.",
  ];

  for (let i = 0; i < samples.length; i++) {
    const signer = accounts[i % accounts.length];
    const c = contract.connect(signer);
    console.log(`Submitting sample ${i + 1} from ${await signer.getAddress()}`);
    const tx = await c.submitReport(samples[i], { gasLimit: 500000 });
    await tx.wait();
    console.log(`Submitted tx: ${tx.hash}`);
  }
  // Small delay to allow any pending async handles to settle on Windows
  await new Promise((res) => setTimeout(res, 250));
  console.log("Seeding complete.");
}

// Global handlers to log and exit cleanly
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

main()
  .then(() => {
    // Give Node a short moment to close handles gracefully
    setTimeout(() => process.exit(0), 100);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
