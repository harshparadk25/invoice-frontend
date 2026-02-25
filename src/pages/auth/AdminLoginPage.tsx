import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      localStorage.setItem('adminSecret', secret);
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-secret': secret },
      });
      if (!res.ok) throw new Error('Invalid admin secret');
      toast.success('Admin access granted');
      navigate('/admin');
    } catch {
      localStorage.removeItem('adminSecret');
      toast.error('Invalid admin secret');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-dark-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-linear-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-500/20">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1.5">Admin Access</h1>
          <p className="text-dark-400 text-sm">Enter admin secret key to continue</p>
        </div>

        <div className="bg-dark-900 border border-dark-700/60 rounded-xl p-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[13px] font-medium text-dark-300 mb-1.5">Admin Secret</label>
              <div className="relative">
                <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter admin secret key"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-sm text-white placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-linear-to-r from-red-600 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:ring-offset-2 focus:ring-offset-dark-900 transition-all disabled:opacity-60"
            >
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </button>
          </form>
        </div>

        <p className="text-center mt-8">
          <a href="/login" className="text-dark-400 hover:text-dark-300 text-[13px] transition-colors">
            &larr; Back to User Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
