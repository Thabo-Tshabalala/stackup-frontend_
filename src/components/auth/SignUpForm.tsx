// app/signup/page.tsx
'use client';

import { useState } from 'react';
import { signupUser } from '@/app/api/users';
import type { User } from '@/models/User';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignUp = () => {
  const [form, setForm] = useState<Omit<User, 'id'>>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signupUser(form); // Your real API call
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/signin');
      }, 1500);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Sign up for StackUp
          </h2>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center">
            {success}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* First & Last Name */}
          <div className="flex space-x-4">
            {(['firstName', 'lastName'] as const).map((field) => (
              <div key={field} className="flex-1">
                <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                  {field === 'firstName' ? 'First Name' : 'Last Name'}
                </label>
                <input
                  id={field}
                  name={field}
                  type="text"
                  required
                  value={form[field]}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder={field === 'firstName' ? 'John' : 'Doe'}
                />
              </div>
            ))}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="john@example.com"
            />
          </div>

          {/* Phone (Optional) */}
          {/* Phone (Optional) */}
          {/* If you want to add phone, update your User model accordingly */}
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-4">
          <p className="text-gray-500 text-sm">Already have an account?</p>
          <Link
            href="/signin"
            className="inline-block mt-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;