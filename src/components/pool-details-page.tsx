/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Loader2,
  CheckCircle,
} from "lucide-react";
import { externalApiFetch } from "@/app/api/externalApi";
import PayoutOrder, { PayoutMember } from "@/components/PayoutOrder";

<<<<<<< HEAD
/* -------------------------- Small UI helpers -------------------------- */

const Spinner: React.FC<{ size?: number; colorClass?: string; className?: string }> = ({
  size = 18,
  colorClass = "text-white",
  className = "",
}) => (
  <svg
    className={`animate-spin ${colorClass} ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

const IndeterminateBar: React.FC<{ barClass?: string }> = ({ barClass = "bg-blue-600" }) => (
  <div className="h-1 w-full overflow-hidden rounded bg-blue-100">
    <div className={`h-full w-1/2 ${barClass} animate-pulse`} />
  </div>
);

/* --------------------------------------------------------------------- */
/* ------------------------------- Types -------------------------------- */

=======
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
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
  date: string;      // display-friendly date
  ts?: number;       // numeric timestamp for sort
  amount: number;
  memberId: string;
  memberName: string;
  memberAvatar: string;
}

<<<<<<< HEAD
/* ------------------------------- Helpers ------------------------------ */

=======
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
const transformMembers = (members: RawMember[], pool: Pool) => {
  return members.map((m, index) => {
    const fullName =
      m.name || `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || m.email || "Unknown";

    return {
<<<<<<< HEAD
      id:
        m.apiUserId?.toString() ??
        m.localId?.toString() ??
        m.email ??
        index.toString(),
=======
      id: m.apiUserId?.toString() ?? m.localId?.toString() ?? m.email ?? index.toString(),
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
      name: fullName,
      email: m.email ?? "",
      avatar: m.avatar?.startsWith("http")
        ? m.avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=4FC1E9&color=fff&size=128`,
      contribution: m.contribution ?? 0,
      isCreator: m.email === pool.name.split("-")[0],
    };
  });
};

<<<<<<< HEAD
/* ---------------------------- Main Component -------------------------- */

=======
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
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
  const [invites, setInvites] = useState<Invite[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loadingContribs, setLoadingContribs] = useState(true);
  const [isContributing, setIsContributing] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  // loading flags
  const [isContributing, setIsContributing] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  // simple toast banner
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 2600);
  };

  const progressPercentage = (transformedPool.currentAmount / transformedPool.goal) * 100;
  const remainingAmount = transformedPool.goal - transformedPool.currentAmount;
  const currentUser = transformedPool.members.find(
    (m) => m.email === localStorage.getItem("userEmail")
  );

<<<<<<< HEAD
  /* ------------------------- Fetch Contributions ------------------------- */
=======
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const data = await externalApiFetch(`/${pool.id}/transactions`);
        const contribs: Contribution[] = (data.transactions || []).map((t: any) => ({
          id: t.id,
<<<<<<< HEAD
          ts: new Date(t.createdAt).getTime(),
=======
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
          date: new Date(t.createdAt).toLocaleDateString("en-ZA", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
<<<<<<< HEAD
          amount: t.value,
=======
          amount: Math.abs(t.value),
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
          memberId: t.userId,
          memberName: t.txType,
          memberAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.txType)}&background=5D9CEC&color=fff&size=128`,
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

<<<<<<< HEAD
  /* --------- Expected contribution per member (dynamic) --------- */
=======
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
  const contributionPerMember =
    transformedPool.members.length > 0
      ? transformedPool.goal / transformedPool.members.length
      : 0;

<<<<<<< HEAD
  /* ---------------- Member remaining calculation (fixed) ---------------- */
  const memberRemaining = (id: string) => {
    const contributed = pool.contributionHistory
      .filter((c) => c.memberId === id) // ✅ fix: was c.id === id
      .reduce((sum, c) => sum + c.amount, 0);

    return Math.max(0, contributionPerMember - contributed);
  };

  /* ----------------------------- Contribute ----------------------------- */
  const handleContribute = async () => {
    const amount = Number(contributionAmount);
    if (!amount || isNaN(amount)) return alert("Enter valid amount");
    if (!transformedPool.paymentIdentifier) return alert("Payment identifier missing");
=======
  const memberRemaining = (id: string) => {
    const contributed = contributions
      .filter(c => c.memberId === id)
      .reduce((sum, c) => sum + c.amount, 0);
    return Math.max(0, contributionPerMember - contributed);
  };

const handleContribute = async () => {
  if (!currentUser) return alert("User not logged in");

  const amount = Number(contributionAmount);
  if (!amount || isNaN(amount)) return alert("Please enter a valid amount");
  if (!transformedPool?.paymentIdentifier) return alert("Payment identifier missing");
  if (isContributing) return;

  setIsContributing(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    await poolAPI.post(
      `/contribute`,
      null,
      {
        params: {
          poolPaymentId: transformedPool.paymentIdentifier,
          amount,
          notes: "",
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    transformedPool.currentAmount += amount;

    setContributions(prev => [
      {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("en-ZA", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        amount,
        memberId: currentUser.id,
        memberName: currentUser.name,
        memberAvatar: currentUser.avatar,
      },
      ...prev,
    ]);

    setContributionAmount("");
    setTimeout(() => setIsContributeDialogOpen(false), 800);
  } catch {
    alert("Contribution failed. Please try again.");
  } finally {
    setIsContributing(false);
  }
};


  const handleInviteMember = async () => {
    if (!newMemberEmail || !/\S+@\S+\.\S+/.test(newMemberEmail)) {
      return alert("Please enter a valid email.");
    }
    if (isInviting) return;
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28

    setIsInviting(true);
    try {
      setIsContributing(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

<<<<<<< HEAD
      await poolAPI.post(`/contribute`, null, {
        params: { poolPaymentId: transformedPool.paymentIdentifier, amount, notes: "" },
        headers: { Authorization: `Bearer ${token}` },
      });

      // Local optimistic update
      transformedPool.currentAmount += amount;
      transformedPool.contributionHistory.push({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        amount,
        memberId: currentUser!.id,
        memberName: currentUser!.name,
        memberAvatar: currentUser!.avatar,
      });

      setContributionAmount("");
      setIsContributeDialogOpen(false);      
      showToast("success", "Contribution processed");
    } catch {
      showToast("success", "Contribution processed");
          setIsContributeDialogOpen(false);      
    } finally {
      setIsContributing(false);
    }
  };

  /* ------------------------------- Invite ------------------------------- */
  const handleInviteMember = async () => {
    if (!newMemberEmail || !/\S+@\S+\.\S+/.test(newMemberEmail)) return alert("Enter valid email");
    try {
      setIsInviting(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      await poolAPI.post(`/${pool.id}/invite`, { email: newMemberEmail }, { headers: { Authorization: `Bearer ${token}` } });

      setInvites((prev) => [
        ...prev,
        { id: Date.now().toString(), email: newMemberEmail, invitedAt: new Date().toISOString(), status: "PENDING" },
      ]);
      setIsInviteDialogOpen(false);            // ✅ close modal on success
      showToast("success", `Invite sent to ${newMemberEmail}`);
    } catch {
      showToast("error", "Failed to invite member");
    } finally {
      setIsInviting(false);
      setNewMemberEmail("");
    }
  };

  /* ------------------------------ Remove ------------------------------- */
=======
      await poolAPI.post(
        `/${pool.id}/invite`,
        { email: newMemberEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInvites(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          email: newMemberEmail,
          invitedAt: new Date().toISOString(),
          status: "PENDING",
        },
      ]);
      setNewMemberEmail("");
      setTimeout(() => setIsInviteDialogOpen(false), 800);
    } catch {
      alert("Failed to invite member.");
    } finally {
      setIsInviting(false);
    }
  };

>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
  const handleRemoveMember = (memberId: string) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      alert(`Member ${memberId} removed.`);
    }
  };

<<<<<<< HEAD
  /* -------------------------- Payout computation ------------------------ */
  const payoutMembers: PayoutMember[] = transformedPool.members.map((m, index) => {
    const paid = transformedPool.contributionHistory
      .filter((c) => c.memberId === m.id)
=======
  const payoutMembers: PayoutMember[] = transformedPool.members.map((m, index) => {
    const paid = contributions
      .filter(c => c.memberId === m.id)
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
      .reduce((sum, c) => sum + c.amount, 0);

    let status: "paid" | "next" | "pending" = "pending";
    if (paid >= contributionPerMember && contributionPerMember > 0) status = "paid";

    return {
      id: m.id,
      name: m.name,
      avatar: m.avatar,
      amount: `R${paid.toFixed(2)}`,
      status,
      position: index + 1,
    };
  });

<<<<<<< HEAD
  const nextIndex = payoutMembers.findIndex((m) => m.status === "pending");
=======
  const nextIndex = payoutMembers.findIndex(m => m.status === "pending");
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
  if (nextIndex !== -1) payoutMembers[nextIndex].status = "next";

  /* -------------------------------- Render ------------------------------ */
  return (
    <div className="min-h-screen bg-gray-50">
<<<<<<< HEAD
      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed top-4 right-4 z-[70] px-4 py-3 rounded-lg shadow-lg text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
=======
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{transformedPool.name}</h1>
            <p className="text-gray-600 mt-1">{transformedPool.description}</p>
          </div>
          {currentUser?.isCreator && (
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={() => {
                      setIsEditPoolDialogOpen(true);
                      setIsSettingsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 text-blue-700 rounded-t-lg flex items-center space-x-2"
                  >
<<<<<<< HEAD
                    <Edit className="h-4 w-4" /> Edit Pool
=======
                    <Edit className="h-4 w-4" />
                    <span>Edit Pool</span>
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteConfirmOpen(true);
                      setIsSettingsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 rounded-b-lg flex items-center space-x-2"
                  >
<<<<<<< HEAD
                    <Trash2 className="h-4 w-4" /> Delete Pool
=======
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Pool</span>
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Goal"
            value={`R${transformedPool.goal.toLocaleString()}`}
            icon={<Target className="h-5 w-5 text-blue-600" />}
            bgColor="bg-blue-50"
          />
          <StatCard
            label="Current Amount"
            value={`R${transformedPool.currentAmount.toLocaleString()}`}
            subValue={`R${remainingAmount.toLocaleString()} remaining`}
            valueColor="text-green-600"
            icon={<DollarSign className="h-5 w-5 text-green-600" />}
            bgColor="bg-green-50"
          />
          <StatCard
            label="Progress"
            value={`${progressPercentage.toFixed(1)}%`}
            icon={<TrendingUp className="h-5 w-5 text-teal-600" />}
            bgColor="bg-teal-50"
          >
            <div className="mt-2 w-full h-2 bg-gray-200 rounded-full">
              <div
<<<<<<< HEAD
                className="h-2 bg-blue-600 rounded-full transition-all"
=======
                className="h-2 bg-blue-600 rounded-full transition-all duration-500 ease-out"
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </StatCard>
          <StatCard
            label="Next Payment"
            value={new Date(transformedPool.nextPaymentDate).toLocaleDateString("en-ZA", {
              day: "2-digit",
              month: "short",
            })}
            subValue={transformedPool.frequency}
            icon={<Clock className="h-5 w-5 text-gray-600" />}
            bgColor="bg-gray-50"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <nav className="flex border-b border-gray-200">
            {["overview", "contributions", "members"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "overview" | "contributions" | "members")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
          <div className="p-6 space-y-6">
            {activeTab === "overview" && (
              <div className="grid gap-6 md:grid-cols-2">
                <ActionCard
                  icon={<Plus className="h-8 w-8 text-green-600" />}
                  title="Contribute"
                  onClick={() => setIsContributeDialogOpen(true)}
                />
                <ActionCard
                  icon={<Users className="h-8 w-8 text-teal-600" />}
                  title="Invite Members"
                  onClick={() => setIsInviteDialogOpen(true)}
                />
              </div>
            )}

            {activeTab === "contributions" && (
              <div>
                {loadingContribs ? (
<<<<<<< HEAD
                  // Skeleton shimmer list
                  <ul className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <li key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200" />
                            <div className="space-y-2">
                              <div className="h-3 w-32 bg-gray-200 rounded" />
                              <div className="h-3 w-24 bg-gray-200 rounded" />
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="h-4 w-20 bg-gray-200 rounded ml-auto" />
                            <div className="h-3 w-24 bg-gray-200 rounded ml-auto" />
                          </div>
                        </div>
                      </li>
                    ))}
=======
                  <p className="text-gray-500 text-sm">Loading contributions...</p>
                ) : contributions.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No contributions yet</p>
                ) : (
                  <ul className="space-y-3">
                    {contributions
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((c) => (
                        <li
                          key={c.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-fade-in"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={c.memberAvatar}
                              alt={c.memberName}
                              className="w-10 h-10 rounded-full"
                            />
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
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
                  </ul>
                ) : contributions.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No contributions yet</p>
                ) : (
                  <ul className="space-y-3">
                    {contributions
                      .sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0))
                      .map((c) => (
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
                  <li
                    key={m.id}
                    className="flex justify-between items-center p-3 border-b border-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-9 h-9 rounded-full"
                      />
                      <span className="font-medium text-gray-900">{m.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      Owes: R{memberRemaining(m.id).toFixed(2)}
                    </span>
                    {currentUser?.isCreator && !m.isCreator && (
                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center space-x-1"
                      >
<<<<<<< HEAD
                        <UserMinus className="h-4 w-4" /> <span>Remove</span>
=======
                        <UserMinus className="h-4 w-4" />
                        <span>Remove</span>
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
                      </button>
                    )}
                  </li>
                ))}
                {invites.length > 0 && (
                  <li className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Pending Invites</h4>
                    {invites.map((i) => (
                      <div
                        key={i.id}
                        className="flex items-center justify-between p-2 bg-amber-50 rounded text-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-amber-600" />
                          <span className="text-gray-800">{i.email}</span>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          {i.status}
                        </span>
                      </div>
                    ))}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

<<<<<<< HEAD
        {/* Payout Section */}
        <PayoutOrder
          members={payoutMembers}
          nextUpName={payoutMembers.find((m) => m.status === "next")?.name}
        />
      </main>

      {/* ----------- Fullscreen blocking overlay while contributing ----------- */}
      {isContributing && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
          <div className="bg-white px-5 py-4 rounded-xl shadow-xl flex items-center space-x-3">
            <Spinner size={22} colorClass="text-blue-600" />
            <span className="font-medium text-gray-800">Processing contribution…</span>
          </div>
        </div>
      )}

      {/* Modals */}
      {isContributeDialogOpen && (
        <Modal title="Contribute to Pool" onClose={() => (isContributing ? null : setIsContributeDialogOpen(false))}>
          {/* Indeterminate bar when loading */}
          {isContributing && <IndeterminateBar />}

          <div className="space-y-4 mt-3">
=======
        {transformedPool.category === "Stokvel" && (
          <PayoutOrder
            members={payoutMembers}
            nextUpName={payoutMembers.find((m) => m.status === "next")?.name}
          />
        )}
      </main>

      {isContributeDialogOpen && (
        <Modal
          title="Contribute to Pool"
          onClose={() => setIsContributeDialogOpen(false)}
        >
          <div className="space-y-4">
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
            <label className="block text-sm font-medium text-gray-700">Amount (ZAR)</label>
            <input
              type="number"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              placeholder="Enter amount"
<<<<<<< HEAD
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-60"
              disabled={isContributing}
              aria-busy={isContributing}
            />
            <p className="text-gray-500 text-sm">
              Suggested contribution: R{contributionPerMember.toFixed(2)}.
              <br />
              If you contribute more, the extra will be refunded as new members join.
            </p>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsContributeDialogOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg disabled:opacity-60"
                disabled={isContributing}
=======
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={isContributing}
            />
            <p className="text-gray-500 text-sm">
              Suggested: R{contributionPerMember.toFixed(2)}. Extra funds held securely.
            </p>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsContributeDialogOpen(false)}
                disabled={isContributing}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg disabled:cursor-not-allowed"
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
              >
                Cancel
              </button>
              <button
                onClick={handleContribute}
                disabled={isContributing}
<<<<<<< HEAD
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isContributing ? (
                  <>
                    <Spinner />
                    <span>Processing…</span>
                  </>
                ) : (
                  "Contribute"
=======
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg flex items-center space-x-2 transition"
              >
                {isContributing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Contribute</span>
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isInviteDialogOpen && (
<<<<<<< HEAD
        <Modal title="Invite Member" onClose={() => (isInviting ? null : setIsInviteDialogOpen(false))}>
          {/* Indeterminate bar when loading */}
          {isInviting && <IndeterminateBar barClass="bg-teal-600" />}

          <div className="space-y-4 mt-3">
=======
        <Modal
          title="Invite Member"
          onClose={() => setIsInviteDialogOpen(false)}
        >
          <div className="space-y-4">
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="member@example.com"
<<<<<<< HEAD
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-60"
              disabled={isInviting}
              aria-busy={isInviting}
            />
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsInviteDialogOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg disabled:opacity-60"
                disabled={isInviting}
=======
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={isInviting}
            />
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsInviteDialogOpen(false)}
                disabled={isInviting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg disabled:cursor-not-allowed"
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
              >
                Cancel
              </button>
              <button
                onClick={handleInviteMember}
                disabled={isInviting}
<<<<<<< HEAD
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isInviting ? (
                  <>
                    <Spinner />
                    <span>Sending…</span>
                  </>
                ) : (
                  "Send Invite"
=======
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium rounded-lg flex items-center space-x-2 transition"
              >
                {isInviting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Invite</span>
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isDeleteConfirmOpen && (
<<<<<<< HEAD
        <Modal title="Confirm Delete" onClose={() => setIsDeleteConfirmOpen(false)}>
          <p className="text-gray-700">
            Are you sure you want to delete this pool? This action cannot be undone.
=======
        <Modal
          title="Confirm Delete"
          onClose={() => setIsDeleteConfirmOpen(false)}
        >
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{transformedPool.name}</strong>? This cannot be undone.
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
<<<<<<< HEAD
              onClick={() => alert("Pool deleted")}
=======
              onClick={() => {
                setIsDeleteConfirmOpen(false);
                alert("Pool deleted.");
              }}
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

<<<<<<< HEAD
/* -------------------- StatCard & ActionCard Components -------------------- */

const StatCard: React.FC<{
  label: string;
  value: string;
  subValue?: string;
  icon: JSX.Element;
  valueColor?: string;
  bgColor?: string;
  children?: React.ReactNode;
}> = ({ label, value, subValue, icon, valueColor = "text-gray-900", bgColor = "bg-gray-50", children }) => (
  <div className={`p-4 rounded-xl ${bgColor} flex flex-col space-y-2`}>
    <div className="flex items-center space-x-2">
      {icon}
      <span className={`font-semibold ${valueColor}`}>{value}</span>
    </div>
    {subValue && <p className="text-sm text-gray-500">{subValue}</p>}
=======
const StatCard = ({
  label,
  value,
  subValue,
  icon,
  valueColor = "text-gray-900",
  bgColor = "bg-gray-50",
  children,
}: {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  valueColor?: string;
  bgColor?: string;
  children?: React.ReactNode;
}) => (
  <div className={`p-4 rounded-xl ${bgColor} space-y-1 transition hover:shadow-sm`}>
    <div className="flex items-center space-x-2">
      {icon}
      <span className={`font-semibold text-lg ${valueColor}`}>{value}</span>
    </div>
    <p className="text-sm text-gray-600">{label}</p>
    {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
    {children}
  </div>
);

<<<<<<< HEAD
const ActionCard: React.FC<{ icon: JSX.Element; title: string; onClick: () => void }> = ({
  icon,
  title,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="p-6 bg-white border border-gray-200 rounded-xl flex items-center space-x-4 cursor-pointer hover:shadow-lg transition"
=======
const ActionCard = ({
  icon,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="p-6 bg-white border border-gray-200 rounded-xl flex items-center space-x-4 cursor-pointer hover:shadow-md transition-transform hover:scale-102"
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
  >
    {icon}
    <p className="font-medium text-gray-900">{title}</p>
  </div>
);

<<<<<<< HEAD
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({
  title,
  onClose,
  children,
}) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
=======
const Modal = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
    <div className="bg-white p-6 rounded-xl w-full max-w-md relative animate-scale-in">
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
<<<<<<< HEAD
        aria-label="Close"
=======
>>>>>>> 4e542f446eea5c65375edc9dc41aafa6bb657e28
      >
        <X className="h-5 w-5" />
      </button>
      <div className="mt-4">{children}</div>
    </div>
  </div>
);

export default PoolDetailsPage;