/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Copy } from "lucide-react";
import poolAPI from "@/app/api/poolApi";
import API from "@/app/api/api";
import { QRCodeCanvas } from "qrcode.react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

async function externalApiFetch(path: string, options: RequestInit = {}) {
  if (!API_BASE_URL || !API_TOKEN) {
    throw new Error("API base URL or token missing in environment");
  }
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
  const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`External API error: ${response.status} - ${errorText}`);
  }
  return response.json();
}

const WalletPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Determine initial tab from URL
  const urlTab = searchParams.get("tab");
  const initialTab = urlTab === "receive" ? "receive" : "send";
  const [tab, setTab] = useState<"send" | "receive">(initialTab);

  const [recipientId, setRecipientId] = useState("");
  const [amount, setAmount] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState<number>(0);
  const [paymentId, setPaymentId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Sync tab with URL
  useEffect(() => {
    router.push(`${pathname}?tab=${tab}`, { scroll: false });
  }, [tab, router, pathname]);

  // Fetch wallet data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await API.get("/me");
        const userData = meRes.data;
        const apiUserId = (userData as { apiUserId: string }).apiUserId;

        const userDataRes = await externalApiFetch(`/users/${apiUserId}`);
        setPaymentId(userDataRes.user?.paymentIdentifier || "");

        const balanceData = await externalApiFetch(`/${apiUserId}/balance`);
        const zarToken = balanceData.tokens?.find(
          (t: { name: string; balance: string }) => t.name === "L ZAR Coin"
        );
        setBalance(zarToken ? parseFloat(zarToken.balance) || 0 : 0);
      } catch (err) {
        console.error("Error fetching wallet data:", err);
        alert("Failed to load wallet data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-5 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
        <div className="inline-block w-5 h-5 border-2 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
        <p className="mt-2 text-sm">Loading wallet...</p>
      </div>
    );
  }

  const formattedBalance = balance.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
  });

  const shortPaymentId = paymentId
    ? `${paymentId.slice(0, 6)}...${paymentId.slice(-4)}`
    : "Not available";

  const copyPaymentId = () => {
    if (!paymentId) return;
    navigator.clipboard
      .writeText(paymentId)
      .then(() => alert("Payment ID copied!"))
      .catch(() => alert("Copy failed. Please try again."));
  };

  // --- Handle Send ---
  const handleSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientId.trim()) {
      return alert("Please enter a recipient (phone number or email).");
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return alert("Please enter a valid amount greater than 0.");
    }

    setIsSending(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No authentication token found.");

      await poolAPI.post("/send", {}, {
        params: { recipientId, amount: amountNum },
      });

      alert(`✅ Successfully sent R${amountNum.toFixed(2)} to ${recipientId}`);
      setRecipientId("");
      setAmount("");
    } catch (err: any) {
      console.error("Send failed:", err);
      let message = "Transaction failed.";
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      alert(`❌ ${message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">My Wallet</h1>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Send/Receive Panel */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setTab("send")}
              className={`flex-1 px-4 py-3 text-xs font-medium text-center transition ${
                tab === "send"
                  ? "text-blue-700 bg-blue-50 border-b-2 border-blue-700"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Send Money
            </button>
            <button
              onClick={() => setTab("receive")}
              className={`flex-1 px-4 py-3 text-xs font-medium text-center transition ${
                tab === "receive"
                  ? "text-teal-700 bg-teal-50 border-b-2 border-teal-700"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Receive Money
            </button>
          </div>

          <div className="p-5">
            {tab === "send" && (
              <form onSubmit={handleSendSubmit} className="space-y-4">
                {isSending && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800 flex items-center">
                    <div className="w-4 h-4 border-2 border-t-blue-600 border-blue-200 rounded-full animate-spin mr-2" />
                    Processing transaction...
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Recipient
                  </label>
                  <input
                    type="text"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    placeholder="e.g. +27821234567 or user@example.com"
                    disabled={isSending}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Send to anyone using their phone number or email.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Amount (ZAR)
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    disabled={isSending}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!recipientId || !amount || isSending}
                  className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    "Send Money"
                  )}
                </button>
              </form>
            )}

            {tab === "receive" && (
              <div className="space-y-4 text-center">
                <div className="flex flex-col items-center">
                  {paymentId ? (
                    <QRCodeCanvas
                      value={paymentId}
                      size={160}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="Q"
                      includeMargin={true}
                    />
                  ) : (
                    <div className="w-40 h-40 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
                      No ID
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-800">Scan this QR to pay you</p>

                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-900 break-all">
                  {shortPaymentId}
                </div>

                <button
                  onClick={copyPaymentId}
                  disabled={!paymentId}
                  className="w-full py-2 text-xs font-medium text-blue-700 border border-blue-300 bg-blue-50 hover:bg-blue-100 disabled:bg-gray-50 disabled:text-gray-400 rounded transition flex items-center justify-center"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy Payment ID
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Balance & ID Card */}
        <div className="lg:w-72 bg-white rounded-xl border border-gray-200 p-5">
          <div>
            <p className="text-xs text-gray-600">Current Balance</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              {showBalance ? `R${formattedBalance}` : "•••••"}
            </h2>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
              aria-label={showBalance ? "Hide balance" : "Show balance"}
            >
              {showBalance ? (
                <Eye className="w-4 h-4 text-gray-700" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-700" />
              )}
            </button>
            <button
              onClick={copyPaymentId}
              disabled={!paymentId}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 rounded-full transition"
              title="Copy Payment ID"
            >
              <Copy className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          <div className="mt-5 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-800">Your Payment ID</p>
            <p className="text-xs font-mono text-blue-900 truncate mt-1">
              {shortPaymentId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;