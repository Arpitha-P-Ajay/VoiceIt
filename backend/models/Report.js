const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
  },
  anonId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  transactionHash: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", ReportSchema);
