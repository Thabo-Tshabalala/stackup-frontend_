// models/PoolResponse.ts
export interface PoolResponse {
  id: number;
  poolName: string;
  goal: number;
  frequency: 'Weekly' | 'Monthly' | 'Custom';
  startDate: string;
  endDate: string;
  creator: { id: number; apiUserId: string; name?: string };
  members: { id: number; email: string; name?: string; avatar?: string }[];
  paymentIdentifier: string;
  collectedAmount: number; // ✅ matches backend
}
