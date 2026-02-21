Quick run instructions (local development)

1. Start backend API

```powershell
cd backend
npm install
npm start
```

Backend health: http://localhost:5000/api/health

2. Deploy smart contract locally (Hardhat)

```powershell
cd voiceit-v2
npm install
# start a local node in one terminal
npx hardhat node
# in another terminal deploy to the local node
npx hardhat run scripts/deploy.cjs --network localhost
```

Copy the deployed contract address and set it in frontend `.env`:

```
REACT_APP_BACKEND_API=http://localhost:5000/api
REACT_APP_CONTRACT_ADDRESS=0x....
```

3. Start frontend

```powershell
cd frontend
npm install
npm start
```

Open `http://localhost:3000` and use MetaMask connected to the local Hardhat network to submit reports.

Notes:

- The frontend will attempt to read reports directly from the smart contract when MetaMask is available; it will fall back to the backend file DB if not.
- Wallets remain pseudonymous; the UI displays a truncated wallet id for anonymity.
