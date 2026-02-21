# VoiceIt – Complete Setup & Run Guide

## Overview
**VoiceIt** is a blockchain-based anonymous platform where users post social issues and problems. Users can view all posts with pseudonymous wallet IDs, while their real identity remains anonymous.

**Architecture:**
- **Smart Contract:** `VoiceIt.sol` on a local Hardhat node (or testnet like Sepolia)
- **Backend:** Express.js server storing reports in a JSON file (port `5000`)
- **Frontend:** React app with ethers.js integration to read from blockchain and backend (port `3000`)

---

## System Requirements
- **Node.js 18+**
- **npm** (comes with Node)
- **MetaMask** browser extension
- **Hardhat** (installed locally in `voiceit-v2/`)

---

## Quick Start (All-in-One)

Run these commands in separate terminals:

### Terminal 1: Backend API
```powershell
cd backend
npm install
npm start
```
✅ Backend runs on `http://localhost:5000/api`

### Terminal 2: Hardhat Local Node
```powershell
cd voiceit-v2
npm install
npx hardhat node
```
✅ Hardhat node runs on `http://127.0.0.1:8545`

### Terminal 3: Deploy & Seed Contract
```powershell
cd voiceit-v2
npx hardhat run scripts/deploy.cjs --network localhost
```
Copy the deployed contract address (e.g., `0x5FbDB2315678afecb367f032d93F642f64180aa3`)

Then seed with sample posts:
```powershell
# Set the contract address
$env:CONTRACT_ADDRESS="0x5FbDB2315678afecb367f032d93F642f64180aa3"

# Run the seed script
node scripts/seed_direct.cjs
```

### Terminal 4: Frontend
Create `frontend/.env`:
```
REACT_APP_BACKEND_API=http://localhost:5000/api
REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Then start the frontend:
```powershell
cd frontend
npm install
npm start
```
✅ Frontend runs on `http://localhost:3000`

---

## Using the App

1. **Open the app:** http://localhost:3000

2. **Connect MetaMask:**
   - Open MetaMask → Network dropdown → Add Network (manual)
   - **Network Name:** `Hardhat Local`
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
   - Save and switch to the Hardhat network

3. **Import a test account:**
   - MetaMask → Account icon → Import Account → Private Key
   - From the `npx hardhat node` terminal, copy one private key (e.g., `0xac0974bec39a17e36ba4a6b4d238ff944bacb476cbe1dd2b0d7cc2fd61e7c6f0`)
   - Paste and Import

4. **Use the app:**
   - **Submit Report:** Tab → Write content → Click "Send to Blockchain"
   - **View Reports:** Tab → See all posts with anonymous user IDs and truncated wallet addresses
   - MetaMask will prompt you to confirm each transaction

---

## Features

### 📋 View Reports Tab
- Shows all posts from the blockchain and backend database
- Each post displays:
  - **Anonymous User ID** (e.g., `User-F39FD6`)
  - **Truncated Wallet Address** (e.g., `0xf39F...9226`) for anonymity
  - **Post Content**
  - **Timestamp** (date & time)
  - **Transaction Hash** (if available)

### ✍️ Submit Report Tab
- Write anonymous reports about social issues
- Posts are stored on-chain and in the backend database
- No personal information is required beyond a connected wallet

---

## Advanced: Deploy to Sepolia Testnet (Gas-Sponsored)

### 1. Get Sepolia RPC & Private Key
- **RPC:** Get free RPC from [Infura](https://www.infura.io) or [Alchemy](https://www.alchemy.com)
- **Private Key:** Export from MetaMask (⚠️ Never share or commit this)

### 2. Fund Your Account
- Use [Sepolia Faucet](https://sepoliafaucet.com) to get test ETH

### 3. Set Environment Variables
Create or update `voiceit-v2/.env`:
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
DEPLOYER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```

### 4. Deploy Contract
```powershell
cd voiceit-v2
npx hardhat run scripts/deploy.cjs --network sepolia
```

### 5. Update Frontend `.env`
```
REACT_APP_BACKEND_API=http://localhost:5000/api
REACT_APP_CONTRACT_ADDRESS=<deployed_address>
REACT_APP_THIRDWEB_CLIENT_ID=<optional_for_gas_sponsorship>
```

### 6. Setup Gas Sponsorship (Optional)
- Register at [Thirdweb](https://thirdweb.com)
- Create a project and enable **Gas Sponsorship**
- Copy your Client ID to `frontend/.env` as `REACT_APP_THIRDWEB_CLIENT_ID`
- When ready, uncommment the Thirdweb provider in `frontend/src/index.js` and install Thirdweb packages

---

## Troubleshooting

### "Cannot connect to localhost:8545"
- Ensure Hardhat node is running in Terminal 2

### "Contract address not configured"
- Set `REACT_APP_CONTRACT_ADDRESS` in `frontend/.env` to the deployed address

### "Backend API not configured"
- Ensure backend is running and set `REACT_APP_BACKEND_API=http://localhost:5000/api`

### MetaMask "Insufficient Balance"
- Use the Hardhat accounts that are pre-funded (or send ETH from account 0)
- On testnet: use a testnet faucet to get test ETH

### "Module not found" errors
- Run `npm install` in the failed directory (frontend, backend, or voiceit-v2)

---

## File Structure
```
VoiceIt/
├── backend/                    # Express.js API
│   ├── server.js
│   ├── package.json
│   └── data/reports.json       # Reports database (auto-created)
├── frontend/                   # React app
│   ├── src/
│   │   ├── App.js              # Main app component
│   │   ├── index.js            # Entry point
│   │   ├── thirdwebClient.js   # Thirdweb config (optional)
│   │   └── VoiceIt.json        # ABI (auto-generated)
│   ├── .env.example
│   └── package.json
└── voiceit-v2/                 # Hardhat smart contracts
    ├── contracts/
    │   └── VoiceIt.sol         # Main contract
    ├── scripts/
    │   ├── deploy.cjs          # Deploy script
    │   └── seed_direct.cjs      # Seed sample posts
    ├── hardhat.config.js
    └── package.json
```

---

## Next Steps

- **Enable Gas Sponsorship:** Set up Thirdweb for gasless transactions
- **Deploy to Mainnet:** Use production RPC and contract addresses
- **Add User Authentication:** Integrate Google/email login via Thirdweb's in-app wallet
- **Enhanced Analytics:** Track posts per issue type or region
- **Moderation:** Add admin features to moderate content

---

## Support

For issues, check:
1. All `.env` files are set correctly
2. All services (backend, Hardhat, frontend) are running
3. MetaMask is connected to the correct network
4. Terminal output for error messages
