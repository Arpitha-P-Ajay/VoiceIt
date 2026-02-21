// Simple test script to verify backend API is working
const testAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f42712";
const testContent = "This is a test report about community safety issues.";

async function testAPI() {
  console.log("🧪 Testing VoiceIt Backend API...\n");

  try {
    // Test 1: Health check
    console.log("1️⃣ Health Check...");
    const healthRes = await fetch("http://localhost:5000/api/health");
    const healthData = await healthRes.json();
    console.log("✓ Health:", healthData.status);
    console.log();

    // Test 2: Submit a report
    console.log("2️⃣ Submitting test report...");
    const submitRes = await fetch("http://localhost:5000/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress: testAddress,
        content: testContent,
        transactionHash: "0x1234567890abcdef",
      }),
    });
    const submitData = await submitRes.json();
    console.log("✓ Report submitted:", submitData.message);
    console.log("  Report ID:", submitData.data._id);
    console.log("  Anonymous ID:", submitData.data.anonId);
    console.log();

    // Test 3: Fetch all reports
    console.log("3️⃣ Fetching all reports...");
    const fetchRes = await fetch("http://localhost:5000/api/reports");
    const fetchData = await fetchRes.json();
    console.log("✓ Successfully fetched reports");
    console.log("  Total reports:", fetchData.count);
    console.log();

    // Test 4: Get statistics
    console.log("4️⃣ Getting statistics...");
    const statsRes = await fetch("http://localhost:5000/api/stats");
    const statsData = await statsRes.json();
    console.log("✓ Statistics:");
    console.log("  Total Reports:", statsData.data.totalReports);
    console.log("  Unique Users:", statsData.data.uniqueUsers);
    console.log();

    console.log("✅ All API tests passed!\n");
  } catch (err) {
    console.error("❌ Test failed:", err.message);
  }
}

testAPI();
