import axios from 'axios';
import type { PoolInvite } from '@/models/PoolInvite';

const poolInviteAPI = axios.create({
  baseURL: 'https://stack-up-backend-production.up.railway.app/api/pools-invite',
});

poolInviteAPI.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getMyInvites() {
  return poolInviteAPI.get<PoolInvite[]>('/my-invites');
}

export function respondToInvite(inviteId: string | number, status: 'PENDING' | 'ACCEPTED' | 'DECLINED') {
  return poolInviteAPI.patch(`/invite/${inviteId}`, { status });
}

export default poolInviteAPI;
