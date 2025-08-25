'use client';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Copy, QrCode } from 'lucide-react';
import API from '@/app/api/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

async function externalApiFetch(path: string, options: RequestInit = {}) {
  if (!API_BASE_URL || !API_TOKEN) {
    throw new Error('API base URL or token missing in environment');
  }
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
  const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
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
  const [tab, setTab] = useState<'send' | 'receive'>('send');
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState<number>(0);
  const [paymentId, setPaymentId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await API.get('/me');
        const userData = meRes.data;
        const apiUserId = (userData as { apiUserId: string }).apiUserId;

        const userDataRes = await externalApiFetch(`/users/${apiUserId}`);
        setPaymentId(userDataRes.user?.paymentIdentifier || '');

        const balanceData = await externalApiFetch(`/${apiUserId}/balance`);
        const zarToken = balanceData.tokens?.find(
          (t: { name: string; balance: string }) => t.name === 'L ZAR Coin'
        );
        setBalance(zarToken ? parseFloat(zarToken.balance) || 0 : 0);
      } catch (err) {
        console.error('Error fetching wallet data:', err);
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

  const formattedBalance = balance.toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
  });

  const shortPaymentId = paymentId
    ? `${paymentId.slice(0, 6)}...${paymentId.slice(-4)}`
    : 'Not available';

  const copyPaymentId = () => {
    if (!paymentId) return;
    navigator.clipboard
      .writeText(paymentId)
      .then(() => alert('Payment ID copied!'))
      .catch(() => alert('Copy failed.'));
  };

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientId || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid recipient ID and amount.');
      return;
    }
    alert(`Sending R${parseFloat(amount).toFixed(2)} to ${recipientId}`);
    setRecipientId('');
    setAmount('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">My Wallet</h1>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setTab('send')}
              className={`flex-1 px-4 py-3 text-xs font-medium text-center transition ${
                tab === 'send'
                  ? 'text-blue-700 bg-blue-50 border-b-2 border-blue-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Send Money
            </button>
            <button
              onClick={() => setTab('receive')}
              className={`flex-1 px-4 py-3 text-xs font-medium text-center transition ${
                tab === 'receive'
                  ? 'text-teal-700 bg-teal-50 border-b-2 border-teal-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Receive Money
            </button>
          </div>

          <div className="p-5">
            {tab === 'send' && (
              <form onSubmit={handleSendSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Recipient ID
                  </label>
                  <input
                    type="text"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    placeholder="User or payment ID"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400"
                  />
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!recipientId || !amount}
                  className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Send Money
                </button>
              </form>
            )}

            {tab === 'receive' && (
              <div className="space-y-4 text-center">

                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  <QrCode className="w-7 h-7" />
                </div>

                <p className="text-sm text-gray-800">Share your ID to receive payments</p>

                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-900 break-all">
                  {shortPaymentId}
                </div>

                <button
                  onClick={copyPaymentId}
                  disabled={!paymentId}
                  className="w-full py-2 text-xs font-medium text-blue-700 border border-blue-300 bg-blue-50 hover:bg-blue-100 disabled:bg-gray-50 disabled:text-gray-400 rounded transition"
                >
                  Copy Payment ID
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Balance & ID Card */}
        <div className="lg:w-72 bg-white rounded-xl border border-gray-200 p-5">
          {/* Balance */}
          <div>
            <p className="text-xs text-gray-600">Current Balance</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              {showBalance ? `R${formattedBalance}` : '•••••'}
            </h2>
          </div>

          {/* Toggle Buttons */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
              aria-label={showBalance ? 'Hide balance' : 'Show balance'}
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
            <p className="text-xs font-mono text-blue-900 truncate mt-1">{shortPaymentId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;