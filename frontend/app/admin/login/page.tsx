'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock } from 'lucide-react';
import { adminLogin } from '@/lib/adminApi';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await adminLogin(password);

      if (data.success && data.token) {
        localStorage.setItem('admin_token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid admin password');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Login failed. Check if backend server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12100E] via-[#1F1C19] to-[#12100E] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E6C594]/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-[#E6C594]" />
          </div>
          <h1 className="text-2xl font-bold text-[#FAF6F0] mb-2">
            Thread & Bloom Admin
          </h1>
          <p className="text-sm text-[#C7B9A5]">Secure Admin Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#FAF6F0] mb-2">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C7B9A5]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full pl-11 pr-4 py-3 bg-[#12100E] border border-[#3A3125] rounded-lg text-[#FAF6F0] placeholder-[#6B6B6B] focus:outline-none focus:border-[#E6C594] transition-colors"
                required
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#E6C594] text-[#12100E] font-bold rounded-lg hover:bg-[#FAF6F0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Access Admin Portal'}
          </button>
        </form>

        {/* Security Note */}
        <div className="mt-6 text-center text-xs text-[#6B6B6B]">
          <p>🔒 This is a secure admin area</p>
          <p className="mt-1">Unauthorized access is prohibited</p>
        </div>
      </div>
    </div>
  );
}
