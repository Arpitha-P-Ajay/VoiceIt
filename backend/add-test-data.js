// Add test data directly to the backend
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "data", "reports.json");

const testReports = [
  {
    _id: "report_test_001",
    walletAddress: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    anonId: "User-8BA1F1",
    content:
      "Witnessing workplace harassment and lack of action from management",
    transactionHash: "0xabcd1234",
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    _id: "report_test_002",
    walletAddress: "0x123456789abcdef0123456789abcdef012345678",
    anonId: "User-123456",
    content:
      "Environmental pollution detected in local water supply near residential areas",
    transactionHash: "0xefgh5678",
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    _id: "report_test_003",
    walletAddress: "0x9876543210fedcba9876543210fedcba98765432",
    anonId: "User-987654",
    content: "Child labor conditions observed at local manufacturing facility",
    transactionHash: "0xijkl9012",
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

try {
  const existingData = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const combinedData = [...existingData, ...testReports];
  fs.writeFileSync(DATA_FILE, JSON.stringify(combinedData, null, 2));
  console.log("✓ Test reports added successfully!");
  console.log(`Total reports: ${combinedData.length}`);
} catch (err) {
  console.error("Error:", err.message);
}
