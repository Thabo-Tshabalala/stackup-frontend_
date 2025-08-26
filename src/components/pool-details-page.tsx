"use client";

import React, { useState, useEffect, JSX } from "react";
import poolAPI from "@/app/api/poolApi";
import {
  Settings,
  TrendingUp,
  Clock,
  Target,
  DollarSign,
  Users,
  Plus,
  Edit,
  Trash2,
  UserMinus,
  X,
  Mail,
  AlertCircle,
} from "lucide-react";
import { externalApiFetch } from "@/app/api/externalApi";
import PayoutOrder, { PayoutMember } from "@/components/PayoutOrder";

// --- Interfaces ---
export interface Pool {
  id: number;
  name: string;
  description: string;
  goal: number;
  currentAmount: number;
  currency: string;
  frequency: string;
  nextPaymentDate: string;
  paymentIdentifier?: string;
  members: Array<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    contribution: number;
    isCreator: boolean;
  }>;
  contributionHistory: Array<{
    id: string;
    date: string;
    amount: number;
    memberId: string;
    memberName: string;
    memberAvatar: string;
  }>;
  category: string;
}

export interface Invite {
  id: string;
  email: string;
  invitedAt: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
}

interface PoolDetailsPageProps {
  pool: Pool;
}

interface RawMember {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  contribution?: number;
  localId?: string | number;
  apiUserId?: string | number;
}

interface Contribution {
  id: string;
  date: string;
  amount: number;
  memberId: string;
  memberName: string;
  memberAvatar: string;
}

// --- Helpers ---
const transformMembers = (members: RawMember[], pool: Pool) => {
  return members.map((m, index) => {
    const fullName =
      m.name ||
      `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() ||
      m.email ||
      "Unknown";

    return {
      id: m.localId !== undefined
        ? m.localId.toString()
        : m.apiUserId !== undefined
        ? m.apiUserId.toString()
        : index.toString(),
      name: fullName,
      email: m.email ?? "",
      avatar: m.avatar?.startsWith("http")
        ? m.avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
      contribution: m.contribution ?? 0,
      isCreator: m.email === pool.name.split("-")[0],
    };
  });
};

// --- Main Component ---
const PoolDetailsPage: React.FC<PoolDetailsPageProps> = ({ pool }) => {
  const transformedPool: Pool = {
    ...pool,
    members: transformMembers(pool.members, pool),
    contributionHistory: pool.contributionHistory || [],
  };

  const [contributionAmount, setContributionAmount] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "contributions" | "members">("overview");
  const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditPoolDialogOpen, setIsEditPoolDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editPoolName, setEditPoolName] = useState(pool.name);
  const [editPoolDescription, setEditPoolDescription] = useState(pool.description);
  const [editPoolGoal, setEditPoolGoal] = useState(pool.goal.toString());
  const [invites, setInvites] = useState<Invite[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loadingContribs, setLoadingContribs] = useState(true);

  const progressPercentage = (transformedPool.currentAmount / transformedPool.goal) * 100;
  const remainingAmount = transformedPool.goal - transformedPool.currentAmount;
  const currentUser = transformedPool.members.find(
    (m) => m.email === localStorage.getItem("userEmail")
  );

  // --- Fetch Contributions ---
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const data = await externalApiFetch(`/${pool.id}/transactions`);
        const contribs: Contribution[] = (data.transactions || []).map((t: any) => ({
          id: t.id,
          date: new Date(t.createdAt).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" }),
          amount: t.value,
          memberId: t.userId,
          memberName: t.txType,
          memberAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.txType)}&background=random`,
        }));
        setContributions(contribs);
      } catch (err) {
        console.error("Failed to load contributions:", err);
        setContributions([]);
      } finally {
        setLoadingContribs(false);
      }
    };

    if (pool?.id) fetchContributions();
  }, [pool.id]);

  // --- Handle Actions ---
  const handleContribute = async () => {
    if (!contributionAmount || isNaN(Number(contributionAmount))) return alert("Enter valid amount");
    if (!transformedPool.paymentIdentifier) return alert("Payment identifier missing");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      await poolAPI.post(
        `/contribute`,
        null,
        {
          params: { poolPaymentId: transformedPool.paymentIdentifier, amount: Number(contributionAmount), notes: "" },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      transformedPool.currentAmount += Number(contributionAmount);
      setContributionAmount("");
      setIsContributeDialogOpen(false);
    } catch {
      alert("Contribution failed.");
    }
  };

  const handleInviteMember = async () => {
    if (!newMemberEmail || !/\S+@\S+\.\S+/.test(newMemberEmail)) return alert("Enter valid email");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      await poolAPI.post(`/${pool.id}/invite`, { email: newMemberEmail }, { headers: { Authorization: `Bearer ${token}` } });
      setInvites((prev) => [...prev, { id: Date.now().toString(), email: newMemberEmail, invitedAt: new Date().toISOString(), status: "PENDING" }]);
    } catch {
      alert("Failed to invite member");
    } finally {
      setNewMemberEmail("");
      setIsInviteDialogOpen(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      alert(`Member ${memberId} removed.`);
    }
  };

  // --- Prepare Payout Members ---
  const payoutMembers: PayoutMember[] = transformedPool.members.map((m, index) => {
    let status: "paid" | "next" | "pending" = "pending";
    if (index < 2) status = "paid"; // example logic, first 2 paid
    else if (index === 2) status = "next"; // next in line
    return { id: m.id, name: m.name, avatar: m.avatar, amount: `R${m.contribution.toLocaleString() || 0}`, status, position: index + 1 };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{transformedPool.name}</h1>
            <p className="text-gray-600 mt-1">{transformedPool.description}</p>
          </div>
          {currentUser?.isCreator && (
            <div className="relative">
              <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                  <button onClick={() => { setIsEditPoolDialogOpen(true); setIsSettingsOpen(false); }} className="w-full px-4 py-2 text-left hover:bg-blue-50 text-blue-700 rounded-t-lg flex items-center space-x-2">
                    <Edit className="h-4 w-4" /> Edit Pool
                  </button>
                  <button onClick={() => { setIsDeleteConfirmOpen(true); setIsSettingsOpen(false); }} className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 rounded-b-lg flex items-center space-x-2">
                    <Trash2 className="h-4 w-4" /> Delete Pool
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Goal" value={`R${transformedPool.goal.toLocaleString()}`} icon={<Target className="h-5 w-5 text-blue-600" />} bgColor="bg-blue-50" />
          <StatCard label="Current Amount" value={`R${transformedPool.currentAmount.toLocaleString()}`} subValue={`R${remainingAmount.toLocaleString()} remaining`} valueColor="text-green-600" icon={<DollarSign className="h-5 w-5 text-green-600" />} bgColor="bg-green-50" />
          <StatCard label="Progress" value={`${progressPercentage.toFixed(1)}%`} icon={<TrendingUp className="h-5 w-5 text-teal-600" />} bgColor="bg-teal-50">
            <div className="mt-2 w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full transition-all" style={{ width: `${Math.min(progressPercentage, 100)}%` }} />
            </div>
          </StatCard>
          <StatCard label="Next Payment" value={new Date(transformedPool.nextPaymentDate).toLocaleDateString("en-ZA", { day: "2-digit", month: "short" })} subValue={transformedPool.frequency} icon={<Clock className="h-5 w-5 text-gray-600" />} bgColor="bg-gray-50" />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <nav className="flex border-b border-gray-200">
            {["overview", "contributions", "members"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab as "overview" | "contributions" | "members")} className={`px-6 py-4 font-medium text-sm border-b-2 transition ${activeTab === tab ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
          <div className="p-6 space-y-6">
            {activeTab === "overview" && (
              <div className="grid gap-6 md:grid-cols-2">
                <ActionCard icon={<Plus className="h-8 w-8 text-green-600" />} title="Make a Contribution" onClick={() => setIsContributeDialogOpen(true)} />
                <ActionCard icon={<Users className="h-8 w-8 text-teal-600" />} title="Invite Members" onClick={() => setIsInviteDialogOpen(true)} />
              </div>
            )}
            {activeTab === "contributions" && (
              <div>
                {loadingContribs ? <p className="text-gray-500 text-sm">Loading contributions...</p> : contributions.length === 0 ? <p className="text-gray-500 text-sm text-center py-4">No contributions yet</p> : (
                  <ul className="space-y-3">
                    {contributions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((c) => (
                      <li key={c.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img src={c.memberAvatar} alt={c.memberName} className="w-10 h-10 rounded-full" />
                          <div>
                            <p className="font-medium text-gray-900">{c.memberName}</p>
                            <p className="text-sm text-gray-500">Contribution</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">+R{c.amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{c.date}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {activeTab === "members" && (
              <ul className="space-y-2">
                {transformedPool.members.map((m) => (
                  <li key={m.id} className="flex justify-between items-center p-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full" />
                      <span className="font-medium text-gray-900">{m.name}</span>
                    </div>
                    {currentUser?.isCreator && !m.isCreator && (
                      <button onClick={() => handleRemoveMember(m.id)} className="text-red-600 hover:text-red-800 text-sm flex items-center space-x-1">
                        <UserMinus className="h-4 w-4" /> Remove
                      </button>
                    )}
                  </li>
                ))}
                {invites.length > 0 && (
                  <li className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Pending Invites</h4>
                    {invites.map((i) => (
                      <div key={i.id} className="flex items-center justify-between p-2 bg-amber-50 rounded text-sm">
                        <div className="flex items-center space-x-2"><Mail className="h-4 w-4 text-amber-600" /><span className="text-gray-800">{i.email}</span></div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">{i.status}</span>
                      </div>
                    ))}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* === Payout Order (Stokvel) Section === */}
        <PayoutOrder members={payoutMembers} nextUpName={payoutMembers.find(m => m.status === "next")?.name} />
      </main>

      {/* --- Modals (Contribute, Invite, Delete) --- */}
      {isContributeDialogOpen && (
        <Modal title="Contribute to Pool" onClose={() => setIsContributeDialogOpen(false)}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Amount (ZAR)</label>
            <input type="number" value={contributionAmount} onChange={(e) => setContributionAmount(e.target.value)} placeholder="Enter amount" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            <div className="flex justify-end space-x-3 pt-4">
              <button onClick={() => setIsContributeDialogOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg">Cancel</button>
              <button onClick={handleContribute} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow">Contribute</button>
            </div>
          </div>
        </Modal>
      )}

      {isInviteDialogOpen && (
        <Modal title="Invite Member" onClose={() => setIsInviteDialogOpen(false)}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} placeholder="member@example.com" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            <div className="flex justify-end space-x-3 pt-4">
              <button onClick={() => setIsInviteDialogOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg">Cancel</button>
              <button onClick={handleInviteMember} className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow">Send Invite</button>
            </div>
          </div>
        </Modal>
      )}

      {isDeleteConfirmOpen && (
        <Modal title="Confirm Delete" onClose={() => setIsDeleteConfirmOpen(false)}>
          <p className="text-gray-700">Are you sure you want to delete this pool? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3 pt-4">
            <button onClick={() => setIsDeleteConfirmOpen(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">Cancel</button>
            <button onClick={() => alert("Pool deleted")} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// --- StatCard & ActionCard Components ---
const StatCard: React.FC<{ label: string; value: string; subValue?: string; icon: JSX.Element; valueColor?: string; bgColor?: string; children?: React.ReactNode }> = ({ label, value, subValue, icon, valueColor = "text-gray-900", bgColor = "bg-gray-50", children }) => (
  <div className={`p-4 rounded-xl ${bgColor} flex flex-col space-y-2`}>
    <div className="flex items-center space-x-2">{icon}<span className={`font-semibold ${valueColor}`}>{value}</span></div>
    {subValue && <p className="text-sm text-gray-500">{subValue}</p>}
    {children}
  </div>
);

const ActionCard: React.FC<{ icon: JSX.Element; title: string; onClick: () => void }> = ({ icon, title, onClick }) => (
  <div onClick={onClick} className="p-6 bg-white border border-gray-200 rounded-xl flex items-center space-x-4 cursor-pointer hover:shadow-lg transition">
    {icon}
    <p className="font-medium text-gray-900">{title}</p>
  </div>
);

// --- Modal Wrapper ---
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"><X className="h-5 w-5" /></button>
      <div className="mt-4">{children}</div>
    </div>
  </div>
);

export default PoolDetailsPage;
