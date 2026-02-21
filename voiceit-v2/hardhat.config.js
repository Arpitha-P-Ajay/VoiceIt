import "@nomicfoundation/hardhat-toolbox";

/** @type import('hardhat/config').HardhatUserConfig */
const { SEPOLIA_RPC_URL, DEPLOYER_PRIVATE_KEY } = process.env;

export default {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 31337, // Forces the local node to match MetaMask
    },
    sepolia: {
      url: SEPOLIA_RPC_URL || "",
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
    },
  },
};
