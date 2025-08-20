import type { User } from '@/models/User'; // Adjust path as needed
import API from './api';

export async function signupUser(payload: User) {
  return API.post('/signup', payload); 
}


export async function loginUser(email: string, password: string) {
  return API.post('/login', { email, password });
}