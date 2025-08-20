// models/PoolApiPayload.ts
export interface Pool{
  poolName: string;
  goal: number;
  frequency: 'Weekly' | 'Monthly' | 'Custom';
  startDate: string;
  endDate: string;
  creator: { apiUserId: string };
  members: { email: string }[];
}
