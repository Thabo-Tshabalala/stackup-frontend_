export interface PoolInvite {
  id: string;
  poolId: string;
  poolName: string;
  creatorName: string;
  goal: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}
