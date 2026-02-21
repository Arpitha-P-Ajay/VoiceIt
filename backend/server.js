const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// File-based storage path
const DATA_FILE = path.join(__dirname, "data", "reports.json");

// Ensure data directory exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize reports file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Helper functions to read/write reports
function readReports() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading reports:", err);
    return [];
  }
}

function writeReports(reports) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2));
  } catch (err) {
    console.error("Error writing reports:", err);
  }
}

// Routes

// Get all reports
app.get("/api/reports", (req, res) => {
  try {
    const reports = readReports();
    // Sort by createdAt in descending order
    const sortedReports = reports.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    res.json({
      success: true,
      count: sortedReports.length,
      data: sortedReports,
    });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch reports",
    });
  }
});

// Get single report by ID
app.get("/api/reports/:id", (req, res) => {
  try {
    const reports = readReports();
    const report = reports.find((r) => r._id === req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: "Report not found",
      });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error("Error fetching report:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch report",
    });
  }
});

// Submit a new report
app.post("/api/reports", (req, res) => {
  try {
    const { walletAddress, content, transactionHash } = req.body;

    // Validation
    if (!walletAddress || !content) {
      return res.status(400).json({
        success: false,
        error: "Wallet address and content are required",
      });
    }

    // Generate anonymous ID from wallet address
    const anonId = `User-${walletAddress.slice(2, 8).toUpperCase()}`;

    // Generate unique ID
    const _id = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create new report
    const newReport = {
      _id,
      walletAddress,
      anonId,
      content,
      transactionHash: transactionHash || null,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Read existing reports
    const reports = readReports();

    // Add new report
    reports.push(newReport);

    // Write back to file
    writeReports(reports);

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      data: newReport,
    });
  } catch (err) {
    console.error("Error submitting report:", err);
    res.status(500).json({
      success: false,
      error: "Failed to submit report",
    });
  }
});

// Get reports by wallet (for user's own reports)
app.get("/api/reports/user/:walletAddress", (req, res) => {
  try {
    const reports = readReports();
    const userReports = reports
      .filter(
        (r) =>
          r.walletAddress.toLowerCase() ===
          req.params.walletAddress.toLowerCase(),
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      count: userReports.length,
      data: userReports,
    });
  } catch (err) {
    console.error("Error fetching user reports:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user reports",
    });
  }
});

// Delete report (only by wallet owner)
app.delete("/api/reports/:id", (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: "Wallet address is required",
      });
    }

    const reports = readReports();
    const reportIndex = reports.findIndex((r) => r._id === req.params.id);

    if (reportIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Report not found",
      });
    }

    // Verify ownership
    if (
      reports[reportIndex].walletAddress.toLowerCase() !==
      walletAddress.toLowerCase()
    ) {
      return res.status(403).json({
        success: false,
        error: "You can only delete your own reports",
      });
    }

    // Remove report
    reports.splice(reportIndex, 1);
    writeReports(reports);

    res.json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting report:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete report",
    });
  }
});

// Get statistics
app.get("/api/stats", (req, res) => {
  try {
    const reports = readReports();
    const uniqueWallets = new Set(
      reports.map((r) => r.walletAddress.toLowerCase()),
    ).size;

    res.json({
      success: true,
      data: {
        totalReports: reports.length,
        uniqueUsers: uniqueWallets,
      },
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch stats",
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ VoiceIt Backend running on port ${PORT}`);
  console.log(`✓ API available at http://localhost:${PORT}`);
  console.log(`✓ Data stored in: ${DATA_FILE}`);
});
