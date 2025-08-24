"use client"

import React, { useState } from "react"
import poolAPI from "@/app/api/poolApi"
import { PoolResponse } from "@/models/PoolResponse"
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
} from "lucide-react"

export interface Pool {
  id: number
  name: string
  description: string
  goal: number
  currentAmount: number
  currency: string
  frequency: string
  nextPaymentDate: string
  paymentIdentifier?: string
  members: Array<{
    id: string
    name: string
    email: string
    avatar: string
    contribution: number
    isCreator: boolean
  }>
  contributionHistory: Array<{
    id: string
    date: string
    amount: number
    member: string
  }>
}

export interface Invite {
  id: string
  email: string
  invitedAt: string
  status: "PENDING" | "ACCEPTED" | "DECLINED"
}

interface PoolDetailsPageProps {
  pool: Pool
}

const PoolDetailsPage: React.FC<PoolDetailsPageProps> = ({ pool }) => {
  const [contributionAmount, setContributionAmount] = useState("")
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isEditPoolDialogOpen, setIsEditPoolDialogOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [editPoolName, setEditPoolName] = useState(pool.name)
  const [editPoolDescription, setEditPoolDescription] = useState(pool.description)
  const [editPoolGoal, setEditPoolGoal] = useState(pool.goal.toString())

  const [invites, setInvites] = useState<Invite[]>([])

  const progressPercentage = (pool.currentAmount / pool.goal) * 100
  const remainingAmount = pool.goal - pool.currentAmount
  const currentUser = pool.members.find((m) => m.id)

  const handleContribute = async () => {
    if (!contributionAmount || isNaN(Number(contributionAmount))) {
      alert("Please enter a valid amount")
      return
    }

    if (!pool.paymentIdentifier) {
      alert("Payment identifier is missing!")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("You are not authenticated")
        return
      }

      const response = await poolAPI.post(
        `/contribute`,
        null,
        {
          params: {
            poolPaymentId: pool.paymentIdentifier,
            amount: Number(contributionAmount),
            notes: ""
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const updatedPool = response.data as PoolResponse
      pool.paymentIdentifier = updatedPool.paymentIdentifier

      setContributionAmount("")
      setIsContributeDialogOpen(false)
    } catch (err) {
      console.error(err)
      alert("Contribution failed, please try again")
    }
  }

interface PoolInviteDTO {
  id: number;         
  poolId: number;        
  poolName: string;
  inviteeId: number;     
  inviteeEmail: string;
  inviteeName: string;
  pending: boolean;
  accepted: boolean;
  declined: boolean;
  creatorId: number;
  creatorName: string;
}

const handleInviteMember = async () => {
  if (!newMemberEmail) return;

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not authenticated");
      return;
    }

    console.log("Inviting member with email:", newMemberEmail);
    console.log("Using pool ID:", pool.id);
    console.log("Authorization token:", token);

    const response = await poolAPI.post<PoolInviteDTO>(
      `/${pool.id}/invite`, // use numeric pool ID
      { email: newMemberEmail },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const invite = response.data;
    console.log("Invite response:", invite);

    setInvites((prev) => [...prev, {
      id: invite.id.toString(),
      email: invite.inviteeEmail,
      invitedAt: new Date().toISOString(),
      status: invite.pending ? "PENDING" : invite.accepted ? "ACCEPTED" : "DECLINED"
    }]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error inviting member:", err);
    const message = err.response?.data || err.message;
    alert("Failed to invite member: " + message);
  } finally {
    setNewMemberEmail("");
    setIsInviteDialogOpen(false);
  }
};




  const handleEditPool = () => {
    console.log("Editing pool:", { name: editPoolName, description: editPoolDescription, goal: editPoolGoal })
    setIsEditPoolDialogOpen(false)
    setIsSettingsOpen(false)
  }

  const handleDeletePool = () => {
    console.log("Deleting pool")
    setIsDeleteConfirmOpen(false)
    setIsSettingsOpen(false)
  }

  const handleRemoveMember = (memberId: string) => {
    console.log("Removing member:", memberId)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{pool.name}</h1>
            <p className="text-slate-600 mt-1">{pool.description}</p>
          </div>
          {currentUser?.isCreator && (
            <div className="relative">
              <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Settings className="h-5 w-5 text-slate-600" />
              </button>
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => { setIsEditPoolDialogOpen(true); setIsSettingsOpen(false) }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 rounded-t-lg flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4 text-slate-600" />
                    <span>Edit Pool</span>
                  </button>
                  <button
                    onClick={() => { setIsDeleteConfirmOpen(true); setIsSettingsOpen(false) }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 text-red-600 rounded-b-lg flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Pool</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Pool Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-600">Total Goal</span>
              <Target className="h-5 w-5 text-slate-400" />
            </div>
            <div className="text-3xl font-bold text-slate-900">R{pool.goal.toLocaleString()}</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-600">Current Amount</span>
              <DollarSign className="h-5 w-5 text-slate-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-600">R{pool.currentAmount.toLocaleString()}</div>
            <p className="text-sm text-slate-500 mt-1">R{remainingAmount.toLocaleString()} remaining</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-600">Progress</span>
              <TrendingUp className="h-5 w-5 text-slate-400" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{progressPercentage.toFixed(1)}%</div>
            <div className="w-full h-3 bg-slate-200 rounded-full mt-3">
              <div className="h-3 bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-600">Next Payment</span>
              <Clock className="h-5 w-5 text-slate-400" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{pool.nextPaymentDate}</div>
            <p className="text-sm text-slate-500 mt-1">{pool.frequency}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {["overview", "contributions", "members"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 space-y-6">
            {activeTab === "overview" && (
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  onClick={() => setIsContributeDialogOpen(true)}
                  className="bg-slate-50 hover:bg-slate-100 p-6 rounded-lg transition-colors border-2 border-dashed border-slate-300 hover:border-emerald-300"
                >
                  <div className="text-center">
                    <Plus className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                    <h3 className="font-semibold text-slate-900">Make a Contribution</h3>
                  </div>
                </button>

                <button
                  onClick={() => setIsInviteDialogOpen(true)}
                  className="bg-slate-50 hover:bg-slate-100 p-6 rounded-lg transition-colors border-2 border-dashed border-slate-300 hover:border-emerald-300"
                >
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                    <h3 className="font-semibold text-slate-900">Invite Members</h3>
                  </div>
                </button>
              </div>
            )}

            {activeTab === "contributions" && (
              <ul className="space-y-2">
                {pool.contributionHistory.map((c) => (
                  <li key={c.id} className="flex justify-between items-center border-b py-2">
                    <span>{c.member}</span>
                    <span>R{c.amount.toLocaleString()}</span>
                    <span className="text-slate-500 text-sm">{c.date}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "members" && (
              <ul className="space-y-2">
                {pool.members.map((m) => (
                  <li key={m.id} className="flex justify-between items-center border-b py-2">
                    <div className="flex items-center space-x-2">
                      <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full" />
                      <span>{m.name}</span>
                    </div>
                    {currentUser?.isCreator && !m.isCreator && (
                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                      >
                        <UserMinus className="h-4 w-4" />
                        <span>Remove</span>
                      </button>
                    )}
                  </li>
                ))}
                {/* Pending Invites */}
                {invites.map((i) => (
                  <li key={i.id} className="flex justify-between items-center border-b py-2 opacity-70">
                    <div className="flex items-center space-x-2">
                      <Users className="h-6 w-6 text-slate-500" />
                      <span>{i.email} (Invited)</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      {/* Contribute Dialog */}
      {isContributeDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="font-bold mb-4">Contribute</h2>
            <input
              type="number"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              className="border p-2 mb-4 w-full"
              placeholder="Amount in R"
            />
            <button onClick={handleContribute} className="bg-emerald-600 text-white px-4 py-2 rounded">Contribute</button>
            <button onClick={() => setIsContributeDialogOpen(false)} className="ml-2 px-4 py-2 rounded border">Cancel</button>
          </div>
        </div>
      )}

      {/* Invite Dialog */}
      {isInviteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="font-bold mb-4">Invite Member</h2>
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="border p-2 mb-4 w-full"
              placeholder="Member email"
            />
            <button onClick={handleInviteMember} className="bg-emerald-600 text-white px-4 py-2 rounded">Invite</button>
            <button onClick={() => setIsInviteDialogOpen(false)} className="ml-2 px-4 py-2 rounded border">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PoolDetailsPage
