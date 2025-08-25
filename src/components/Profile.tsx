// app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/models/User';
import API from '@/app/api/api';

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<File | null>(null);

  // Fetch user data from real backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/me');
        const userData: User = res.data as User;
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handle banner file upload
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBanner(e.target.files[0]);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('user', JSON.stringify(user));
      if (banner) formData.append('banner', banner);

      await API.put('/auth/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-3xl mx-auto">Loading...</div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen">
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-3xl mx-auto text-red-600">User not found</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6">
        {/* Top Right User Info */}
        <header className="flex items-center justify-end mb-6">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-600">{user.email}</p>
          </div>
          <div
            className="ml-3 w-8 h-8 bg-cover bg-center rounded-full border-2 border-gray-300"
            style={{ backgroundImage: `url(${user.imageUrl})` }}
            aria-label="Profile image"
          />
        </header>

        {/* Profile Form */}
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

          {/* Banner Preview */}
          {user.imageUrl && (
            <div
              className="w-full h-32 bg-cover bg-center rounded-lg mb-6"
              style={{ backgroundImage: `url(${user.imageUrl})` }}
              aria-label="Profile banner"
            ></div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-start space-x-4">
              <img
                src={user.imageUrl || 'https://via.placeholder.com/80'}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </h2>
                <label className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full cursor-pointer hover:bg-blue-200 transition">
                  Change Banner
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="hidden"
                  />
                </label>
                {banner && (
                  <p className="text-xs text-gray-500 mt-1">
                    New banner selected: <strong>{banner.name}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName ?? ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName ?? ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={user.imageUrl ?? ''}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Payment Enabled Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enabledPay"
                name="enabledPay"
                checked={!!user.enabledPay}
                onChange={(e) => setUser({ ...user, enabledPay: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enabledPay" className="text-sm text-gray-700">
                Payment Enabled
              </label>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-2 rounded-lg font-medium transition
                  ${
                    saving
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }
                `}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          {/* Debug Section come back here*/}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Account Details (Debug)</h3>
            <pre className="bg-gray-100 p-3 rounded text-xs text-gray-800 overflow-auto max-h-32">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;