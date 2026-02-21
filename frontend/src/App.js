import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import VoiceItABI from "./VoiceIt.json";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const BACKEND_API = process.env.REACT_APP_BACKEND_API;

function App() {
  // Log initialization
  console.log("🚀 VoiceIt App Initialized");
  console.log("📋 Environment Configuration Loaded:", {
    CONTRACT_ADDRESS: CONTRACT_ADDRESS ? "✅ Set" : "❌ Missing",
    BACKEND_API: BACKEND_API ? "✅ Set" : "❌ Missing",
    CONTRACT_ADDRESS_VALUE: CONTRACT_ADDRESS,
    BACKEND_API_VALUE: BACKEND_API,
  });

  const [activeTab, setActiveTab] = useState("submit");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [fetchingReports, setFetchingReports] = useState(false);

  async function sendReport() {
    // Validate configuration
    if (!CONTRACT_ADDRESS) {
      setError("❌ Contract address not configured. Check .env file.");
      console.error("CONTRACT_ADDRESS is undefined:", { CONTRACT_ADDRESS });
      return;
    }

    if (!BACKEND_API) {
      setError("❌ Backend API not configured. Check .env file.");
      console.error("BACKEND_API is undefined:", { BACKEND_API });
      return;
    }

    if (!window.ethereum) {
      setError("❌ Please install MetaMask!");
      console.error("window.ethereum is not available");
      return;
    }

    if (!report.trim()) {
      setError("Please enter a report before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔐 Connecting to MetaMask...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      console.log("✅ Connected to wallet:", userAddress);

      // Check network
      const network = await provider.getNetwork();
      console.log("🌐 Connected to network:", {
        chainId: network.chainId,
        name: network.name,
      });

      console.log("📝 Loading contract at:", CONTRACT_ADDRESS);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        VoiceItABI.abi,
        signer,
      );

      // Submit to blockchain
      console.log("⛓️ Submitting to blockchain...");
      const tx = await contract.submitReport(report, {
        gasLimit: 1000000,
      });
      console.log("📤 Transaction sent:", tx.hash);

      console.log("⏳ Waiting for confirmation...");
      const receipt = await tx.wait();
      const txHash = receipt.hash;
      console.log("✅ Transaction confirmed:", txHash);

      // Submit to backend with blockchain transaction hash
      console.log("💾 Saving to backend database...");
      const backendResponse = await fetch(`${BACKEND_API}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: userAddress,
          content: report,
          transactionHash: txHash,
        }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        throw new Error(errorData.error || "Failed to save report to database");
      }

      const savedData = await backendResponse.json();
      console.log("✅ Report saved successfully:", savedData.data._id);

      setSuccess(true);
      setReport("");
      setTimeout(() => setSuccess(false), 3000);

      // Refresh reports after submission
      console.log("🔄 Refreshing reports list...");
      await fetchAllReports();
      console.log("✅ All features completed successfully!");
    } catch (err) {
      console.error("❌ Submission failed:", err);

      // Provide user-friendly error message
      let userMessage = err.message;
      if (err.message.includes("user rejected")) {
        userMessage = "❌ Transaction rejected by user";
      } else if (err.message.includes("insufficient")) {
        userMessage = "❌ Insufficient balance or gas";
      } else if (err.message.includes("network")) {
        userMessage =
          "❌ Network error. Check your connection and MetaMask network.";
      } else if (err.message.includes("undefined")) {
        userMessage =
          "❌ Contract address or API configuration missing. Check .env file.";
      }

      setError(userMessage || "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchAllReports() {
    setFetchingReports(true);
    setError(null);

    try {
      console.log("📝 Loading reports from backend...", { BACKEND_API });
      const response = await fetch(`${BACKEND_API}/reports`);
      console.log("📊 Backend response received:", { status: response.status });

      if (!response.ok) {
        throw new Error("Failed to fetch reports from backend");
      }

      const result = await response.json();
      console.log("✅ Reports loaded:", {
        count: result.data?.length,
        hasData: !!result.data,
      });

      if (result.success && result.data) {
        // Format reports for display
        const formattedReports = result.data.map((report) => ({
          id: report._id,
          walletAddress: report.walletAddress,
          content: report.content,
          timestamp: new Date(report.timestamp),
          anonId: report.anonId,
          transactionHash: report.transactionHash,
        }));

        console.log("🎯 Formatted reports for display:", {
          count: formattedReports.length,
        });
        setReports(formattedReports);
      }
    } catch (err) {
      console.error("❌ Failed to fetch reports:", err);
      setError(
        err.message ||
          "Failed to fetch reports. Make sure backend is running on port 5000.",
      );
    } finally {
      setFetchingReports(false);
    }
  }

  // Fetch reports when component mounts or when activeTab changes to "view"
  useEffect(() => {
    console.log("📑 Tab changed to:", activeTab);
    if (activeTab === "view") {
      console.log("👁️ Switching to View Reports tab - loading reports...");
      fetchAllReports();
    }
  }, [activeTab]);

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      backgroundImage:
        "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
    },
    card: {
      width: "100%",
      maxWidth: "600px",
      background: "rgba(15, 23, 42, 0.8)",
      backdropFilter: "blur(10px)",
      backgroundColor: "rgba(30, 41, 59, 0.6)",
      border: "1px solid rgba(148, 163, 184, 0.2)",
      borderRadius: "20px",
      padding: "40px 30px",
      boxShadow:
        "0 8px 32px 0 rgba(31, 38, 135, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      transition: "all 0.3s ease",
    },
    header: {
      textAlign: "center",
      marginBottom: "32px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      marginBottom: "8px",
      background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontFamily: "'Space Mono', monospace",
      letterSpacing: "-0.5px",
    },
    subtitle: {
      fontSize: "14px",
      color: "#94a3b8",
      fontWeight: "400",
      lineHeight: "1.5",
    },
    tabContainer: {
      display: "flex",
      gap: "10px",
      marginBottom: "30px",
      borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
      paddingBottom: "15px",
    },
    tab: {
      padding: "10px 20px",
      fontSize: "14px",
      fontWeight: "600",
      border: "none",
      background: "none",
      color: "#94a3b8",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      borderBottom: "2px solid transparent",
      position: "relative",
      bottom: "-16px",
    },
    tabActive: {
      color: "#60a5fa",
      borderBottom: "2px solid #60a5fa",
    },
    inputWrapper: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: "600",
      color: "#cbd5e1",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      fontSize: "14px",
      border: "1px solid rgba(148, 163, 184, 0.3)",
      borderRadius: "12px",
      background: "rgba(15, 23, 42, 0.5)",
      color: "#e2e8f0",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      outline: "none",
      backdropFilter: "blur(10px)",
      resize: "vertical",
      minHeight: "120px",
    },
    button: {
      width: "100%",
      padding: "14px 24px",
      fontSize: "15px",
      fontWeight: "600",
      border: "none",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      color: "#fff",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
    },
    buttonDisabled: {
      opacity: "0.6",
      cursor: "not-allowed",
    },
    messageBox: {
      marginTop: "20px",
      padding: "12px 16px",
      borderRadius: "12px",
      fontSize: "13px",
      fontWeight: "500",
      border: "1px solid",
      animation: "slideIn 0.3s ease",
      backdropFilter: "blur(10px)",
    },
    successMessage: {
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      borderColor: "rgba(34, 197, 94, 0.3)",
      color: "#86efac",
    },
    errorMessage: {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      borderColor: "rgba(239, 68, 68, 0.3)",
      color: "#fca5a5",
    },
    reportItem: {
      padding: "16px",
      marginBottom: "15px",
      background: "rgba(15, 23, 42, 0.5)",
      border: "1px solid rgba(148, 163, 184, 0.2)",
      borderRadius: "12px",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
    },
    reportHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
      gap: "10px",
      flexWrap: "wrap",
    },
    reportAnonId: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#8b5cf6",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      padding: "4px 8px",
      background: "rgba(139, 92, 246, 0.1)",
      borderRadius: "6px",
      border: "1px solid rgba(139, 92, 246, 0.2)",
    },
    reportWallet: {
      fontSize: "11px",
      color: "#94a3b8",
      fontFamily: "monospace",
      wordBreak: "break-all",
    },
    reportTime: {
      fontSize: "11px",
      color: "#64748b",
      fontStyle: "italic",
    },
    reportContent: {
      fontSize: "14px",
      color: "#cbd5e1",
      lineHeight: "1.6",
      marginBottom: "10px",
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
    },
    reportsList: {
      maxHeight: "600px",
      overflowY: "auto",
    },
    emptyMessage: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#64748b",
      fontSize: "14px",
    },
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 640px) {
            input, button {
              font-size: 16px;
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          input:focus {
            border-color: rgba(96, 165, 250, 0.5);
            background-color: rgba(15, 23, 42, 0.7);
            box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
          }

          button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.5);
          }

          button:active:not(:disabled) {
            transform: translateY(0);
          }

          .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(96, 165, 250, 0.3);
            border-top: 2px solid #60a5fa;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-right: 8px;
          }

          .reports-list::-webkit-scrollbar {
            width: 6px;
          }

          .reports-list::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.3);
            borderRadius: 10px;
          }

          .reports-list::-webkit-scrollbar-thumb {
            background: rgba(96, 165, 250, 0.3);
            borderRadius: 10px;
          }

          .reports-list::-webkit-scrollbar-thumb:hover {
            background: rgba(96, 165, 250, 0.5);
          }
        `}
      </style>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>VoiceIt</h1>
            <p style={styles.subtitle}>
              Anonymous platform for social issues and concerns
            </p>
          </div>

          {/* Tab Navigation */}
          <div style={styles.tabContainer}>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === "submit" && styles.tabActive),
              }}
              onClick={() => setActiveTab("submit")}
            >
              Submit Report
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === "view" && styles.tabActive),
              }}
              onClick={() => setActiveTab("view")}
            >
              View Reports ({reports.length})
            </button>
          </div>

          {/* Submit Tab */}
          {activeTab === "submit" && (
            <>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Your Report</label>
                <textarea
                  style={styles.input}
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  placeholder="Share your story, report, or concern..."
                  disabled={loading}
                />
              </div>

              <button
                style={{
                  ...styles.button,
                  ...(loading && styles.buttonDisabled),
                }}
                onClick={sendReport}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Send to Blockchain"}
              </button>

              {success && (
                <div style={{ ...styles.messageBox, ...styles.successMessage }}>
                  ✓ Report successfully stored on blockchain and database!
                </div>
              )}

              {error && (
                <div style={{ ...styles.messageBox, ...styles.errorMessage }}>
                  ✗ {error}
                </div>
              )}
            </>
          )}

          {/* View Reports Tab */}
          {activeTab === "view" && (
            <>
              {fetchingReports && (
                <div style={styles.emptyMessage}>
                  <div className="spinner"></div>
                  Loading reports...
                </div>
              )}

              {!fetchingReports && reports.length === 0 && (
                <div style={styles.emptyMessage}>
                  No reports yet. Be the first to share your story!
                </div>
              )}

              {!fetchingReports && reports.length > 0 && (
                <div style={styles.reportsList} className="reports-list">
                  {reports.map((r) => (
                    <div key={r.id} style={styles.reportItem}>
                      <div style={styles.reportHeader}>
                        <div style={styles.reportAnonId}>{r.anonId}</div>
                        <div style={styles.reportTime}>
                          {r.timestamp.toLocaleDateString()}{" "}
                          {r.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      <div style={styles.reportContent}>{r.content}</div>
                      <div style={styles.reportWallet}>
                        💼 Wallet: {r.walletAddress}
                      </div>
                      {r.transactionHash && (
                        <div
                          style={{ ...styles.reportWallet, marginTop: "8px" }}
                        >
                          🔗 Tx: {r.transactionHash.slice(0, 10)}...
                          {r.transactionHash.slice(-10)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div style={{ ...styles.messageBox, ...styles.errorMessage }}>
                  ✗ {error}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
