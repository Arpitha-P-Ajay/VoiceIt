
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

# Project Name: VoiceIt 🎯

## Basic Details

### Team Name: Codilla

### Team Members
- Member 1: Aiswarya V S - LBS Institute Of Technology For Women
- Member 2: Arpitha P Ajay - LBS Institute Of Technology For Women

### Hosted Project Link
Project Status: Working Prototype

Due to the complex local blockchain environment (Hardhat Node) and specialized MetaMask configurations required for this dApp, we have prioritized a fully functional Local Development Prototype. You can witness the end-to-end workflow, including real-time blockchain transactions, in our Project Demo Video below.

### Project Description
VoiceIt is a decentralized, anonymous platform that allows citizens to report social issues and concerns without fear of retaliation. By combining blockchain transparency with a secure backend, it ensures that every voice is heard and every report is immutable.

### The Problem statement
Many individuals hesitate to report local issues, corruption, or safety concerns due to fear of being identified or the data being tampered with by centralized authorities. Traditional reporting systems lack transparency and trust.

### The Solution
VoiceIt solves this by using a Hardhat-based Smart Contract to store report hashes on-chain, ensuring they cannot be deleted or altered. A Node.js/MongoDB backend handles the storage of detailed report content while maintaining a link to the blockchain transaction for verification.

---

## Technical Details

### Technologies/Components Used

**For Software:**
- Languages used: JavaScript (ES6+), Solidity
- Frameworks used: React.js, Hardhat
- Libraries used: ethers.js, axios, mongoose
- Tools used: VS Code, MetaMask, MongoDB

---

## Features

List the key features of your project:
- Feature 1: Blockchain Immutability: Every report is recorded on a local Ethereum node to prevent data tampering.
- Feature 2: Anonymous Reporting: Users are assigned unique "Anon IDs" derived from their wallet addresses without revealing personal identity.
- Feature 3: Real-time Feed: A dynamic view tab that fetches all submitted reports from the database and verifies them against the blockchain.
- Feature 4: Secure Transaction Signing: Full integration with MetaMask for user-authorized data submission.
---

## Implementation

### For Software:

#### Installation
```bash
# Install frontend and backend dependencies
npm install

# Install Hardhat toolbox
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

#### Run
```bash
# Terminal 1: Start Local Blockchain
npx hardhat node

# Terminal 2: Deploy Smart Contract
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Start Backend Server
cd backend
node server.js

# Terminal 4: Start React Frontend
npm start
```

## Project Documentation

### For Software:

#### Screenshots (Add at least 3)

<img width="1920" height="1080" alt="Screenshot (434)" src="https://github.com/user-attachments/assets/e99c9219-4f6f-4af7-b35b-f12642eddec0" />

*The Submit Report interface where users enter their concerns and sign via MetaMask.*

<img width="1914" height="1004" alt="Screenshot 2026-02-21 092956" src="https://github.com/user-attachments/assets/6d57e1fd-0271-40c0-980f-2e901c58047a" />

<img width="1919" height="1068" alt="Screenshot 2026-02-21 091834" src="https://github.com/user-attachments/assets/bed62649-2d38-4519-ad24-66ad47921127" />

*The MetaMask interaction showing the transaction request to the VoiceIt smart contract.*

<img width="1919" height="1078" alt="Screenshot 2026-02-21 091945" src="https://github.com/user-attachments/assets/da3cf1fe-bf8d-4511-94bd-eae6ce078c84" />

*The View Reports tab displaying the list of anonymous reports fetched from MongoDB.*

#### Diagrams

**System Architecture:**

1. User submits a report via React Frontend.
2. MetaMask signs the transaction to the VoiceIt Smart Contract.
3. Upon success, the Frontend sends the report data and Transaction Hash to the Node.js Backend.
4. Data is permanently stored in MongoDB, linked to the blockchain record.

---


## Additional Documentation

### For Web Projects with Backend:

#### API Documentation

**Base URL:** `https://api.yourproject.com](http://localhost:5000/api`

##### Endpoints

**GET /api/endpoint**
- **Description:** Fetches all anonymous reports stored in the database
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "anonId": "ANON-123",
      "content": "Sample Report",
      "transactionHash": "0x..."
    }
  ]
}
```

**POST /api/endpoint**
- **Description:** Saves a new report after blockchain confirmation.
- **Request Body:**
```json
{
  "walletAddress": "0x...",
  "content": "String",
  "transactionHash": "0x..."
}
```

---

## Project Demo

### Video


https://github.com/user-attachments/assets/a98bab66-de4d-4c0f-bd18-7b4c90ea75a8

*The video demonstrates the end-to-end flow: starting the Hardhat node, submitting a report, approving via MetaMask, and seeing the report appear in the live feed.*

## AI Tools Used (Optional - For Transparency Bonus)

If you used AI tools during development, document them here for transparency:

**Tool Used:** Gemini, GitHub Copilot

**Purpose:** Debugging blockchain connectivity and MetaMask synchronization issues.

**Human Contributions:**
- Architecture design and planning
- Custom business logic implementation
- Integration and testing
- UI/UX design decisions

*Note: Proper documentation of AI usage demonstrates transparency and earns bonus points in evaluation!*

---

## Team Contributions

- Aiswarya V S : Frontend and MetaMask integration.
- Arpitha P Ajay : Backend and MetaMask integration.

---

## License

This project is licensed under the [LICENSE_NAME] License - see the [LICENSE](LICENSE) file for details.

**Common License Options:**
- MIT License (Permissive, widely used)
- Apache 2.0 (Permissive with patent grant)
- GPL v3 (Copyleft, requires derivative works to be open source)

---

Made with ❤️ at TinkerHub
