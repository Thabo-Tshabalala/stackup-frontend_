"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Copy, QrCode } from "lucide-react";
import API from "@/app/api/api";

const WalletPage = () => {
  const [tab, setTab] = useState<"send" | "receive">("send");
  const [recipientId, setRecipientId] = useState("");
  const [amount, setAmount] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState<number>(0);
  const [paymentId, setPaymentId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    firstName: string;
    email: string;
    imageUrl?: string;
  } | null>(null);

  const API_TOKEN =
    process.env.NEXT_PUBLIC_API_TOKEN ||
    "ee4786b66aaa953af6691317340bc0c1aff5d87e80c8518ad43e40731f19718f";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await API.get("/me");
        const userData = meRes.data;
        setUser(
          userData as {
            firstName: string;
            email: string;
            imageUrl?: string;
            apiUserId: string;
          }
        );
        const apiUserId = (userData as { apiUserId: string }).apiUserId;

        const userRes = await fetch(
          `https://seal-app-qp9cc.ondigitalocean.app/api/v1/users/${apiUserId}`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        const userDataRes = await userRes.json();
        setPaymentId(userDataRes.user?.paymentIdentifier || "");

        const balanceRes = await fetch(
          `https://seal-app-qp9cc.ondigitalocean.app/api/v1/${apiUserId}/balance`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        const balanceData = await balanceRes.json();
        const zarToken = balanceData.tokens?.find(
          (t: { name: string; balance: string }) => t.name === "L ZAR Coin"
        );
        setBalance(zarToken ? parseFloat(zarToken.balance) || 0 : 0);
      } catch (err) {
        console.error("Error fetching wallet data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  const formattedBalance = balance.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
  });
  const shortPaymentId = paymentId
    ? `${paymentId.slice(0, 6)}...${paymentId.slice(-4)}`
    : "Not available";
  const copyPaymentId = () =>
    navigator.clipboard
      .writeText(paymentId)
      .then(() => alert("Payment ID copied!"));

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wallet</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 text-center font-semibold transition ${
                tab === "send"
                  ? "text-pink-600 bg-pink-50"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={() => setTab("send")}
            >
              Send Money
            </button>
            <button
              className={`flex-1 py-4 text-center font-semibold transition ${
                tab === "receive"
                  ? "text-orange-600 bg-orange-50"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={() => setTab("receive")}
            >
              Receive Money
            </button>
          </div>

          <div className="p-6">
            {tab === "send" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!recipientId || !amount) return;
                  alert(`Sending R${amount} to ${recipientId}`);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Recipient ID
                  </label>
                  <input
                    type="text"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    placeholder="Enter user ID or payment ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Amount (ZAR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!recipientId || !amount}
                  className="w-full py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition disabled:cursor-not-allowed"
                >
                  Send Money
                </button>
              </form>
            )}

            {tab === "receive" && (
              <div className="space-y-4 text-left">
                <QrCode className="w-16 h-16 text-gray-700" />
                <p className="text-gray-900 font-medium">
                  Scan this QR code to receive payments
                </p>
                <div className="p-4 bg-gray-100 rounded-lg inline-block">
                  <p className="font-mono text-gray-900">{shortPaymentId}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 bg-gradient-to-tr from-purple-200 via-pink-200 to-orange-200 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <p className="text-sm opacity-90 text-black">Current Balance</p>
            <p className="text-3xl md:text-4xl font-bold text-black">
              {showBalance ? `R${formattedBalance}` : "R••••••"}
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4">
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-3 bg-white rounded-full shadow hover:bg-gray-100 transition"
              aria-label={showBalance ? "Hide balance" : "Show balance"}
            >
              {showBalance ? (
                <Eye className="w-5 h-5 text-black" />
              ) : (
                <EyeOff className="w-5 h-5 text-black" />
              )}
            </button>
            <button
              onClick={copyPaymentId}
              className="p-3 bg-white rounded-full shadow hover:bg-gray-100 transition"
              title="Copy Payment ID"
            >
              <Copy className="w-5 h-5 text-black" />
            </button>
          </div>

          <div className="mt-6 p-3 bg-white rounded-lg text-sm flex justify-between items-center shadow">
            <span className="font-medium text-black">Your Payment ID</span>
            <span className="font-mono text-black">{shortPaymentId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
