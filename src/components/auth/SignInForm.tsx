'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/app/api/api';

const SignIn = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Logging in with:', formData);

      const res = await API.post<{ token?: string; accessToken?: string }>('/login', {
        email: formData.emailOrPhone,
        password: formData.password,
      });

      const token = res.data.token || res.data.accessToken;
      if (!token) throw new Error('No token received');

      localStorage.setItem('token', token);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err && typeof err === 'object' && 'response' in err && (err as any).response?.data?.message) ||
        (err && typeof err === 'object' && 'message' in err && (err as { message?: string }).message) ||
        'Login failed';
      setError(message as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-600 mt-1">Sign in to your account</p>
        </div>


        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-700 text-center">{error}</p>
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label htmlFor="emailOrPhone" className="block text-xs font-medium text-gray-700 mb-1">
              Email or Phone
            </label>
            <input
              id="emailOrPhone"
              name="emailOrPhone"
              type="text"
              required
              value={formData.emailOrPhone}
              onChange={handleChange}
              placeholder="Enter email or phone"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="font-medium text-blue-600 hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;