import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import GlassCard from '../../components/admin/GlassCard';
import GlassInput from '../../components/admin/GlassInput';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isDeveloper = searchParams.get('type') === 'developer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Login failed');
      }

      const data = await response.json();

      if (isDeveloper && data.admin.role !== 'developer_admin') {
        throw new Error('Invalid credentials for developer admin');
      }

      login(data.access_token, data.admin);

      if (data.admin.role === 'developer_admin') {
        navigate('/admin/developer/dashboard');
      } else {
        navigate('/admin/institution/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const mode = isDeveloper ? 'purple' : 'institution';
  const title = isDeveloper ? 'Developer Admin' : 'Institution Admin';

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDeveloper ? (
          <>
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-purple-600 mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-purple-500 mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-institution-600 mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-institution-500 mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          </>
        )}
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(isDeveloper ? '/' : '/institution/login')}
          className={`flex items-center gap-2 text-slate-400 transition-colors text-sm font-medium
            ${isDeveloper ? 'hover:text-purple-400' : 'hover:text-institution-400'}`}
        >
          <ArrowLeft size={16} />
          {isDeveloper ? 'Back to Home' : 'Back to Institution'}
        </button>

        {/* Main Card */}
        <GlassCard mode={isDeveloper ? 'institution' : 'institution'} glow>
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className={`p-3 rounded-xl ${isDeveloper ? 'bg-purple-600/20' : 'bg-institution-600/20'}`}>
                  <Mail size={28} className={isDeveloper ? 'text-purple-400' : 'text-institution-400'} />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h1 className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent
                  ${isDeveloper ? 'from-purple-300 to-purple-400' : 'from-institution-300 to-institution-400'}`}>
                  {title}
                </h1>
                <p className="text-slate-400 text-sm">
                  {isDeveloper ? 'Access the developer administration panel' : 'Manage your institution'}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <GlassInput
                type="email"
                label="Email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                mode={isDeveloper ? 'institution' : 'institution'}
                required
                error={!!error}
              />

              <GlassInput
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                mode={isDeveloper ? 'institution' : 'institution'}
                required
                error={!!error}
              />

              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
                  ${isDeveloper ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/30 hover:shadow-purple-500/50' : 'bg-institution-600 hover:bg-institution-500 shadow-institution/30 hover:shadow-institution/50'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-white`}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Log In'
                )}
              </button>
            </form>
          </div>
        </GlassCard>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}
