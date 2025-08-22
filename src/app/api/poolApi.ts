import axios from 'axios';
import type { Pool } from '@/models/Pool';

const poolAPI = axios.create({
  baseURL: 'http://localhost:8080/api/pools',
});

poolAPI.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); 
  if (token) {
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function createPool(pool: Pool) {
  return poolAPI.post('', pool); 
}

export default poolAPI;
