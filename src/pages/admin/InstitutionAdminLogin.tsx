import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import GlassCard from '../../components/admin/GlassCard';
import GlassInput from '../../components/admin/GlassInput';

export default function InstitutionAdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      if (data.admin.role !== 'institution_admin') {
        throw new Error('Invalid admin type');
      }

      login(data.access_token, data.admin);
      navigate('/admin/institution/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-institution-600 mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-institution-500 mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/institution/login')}
          className="flex items-center gap-2 text-slate-400 hover:text-institution-400 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Institution Login
        </button>

        {/* Main Card */}
        <GlassCard mode="institution" glow>
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-3 rounded-xl bg-institution-600/20">
                  <Mail size={28} className="text-institution-400" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-institution-300 to-institution-400 bg-clip-text text-transparent">
                  Institution Admin
                </h1>
                <p className="text-slate-400 text-sm">Manage your institution dashboard</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <GlassInput
                type="email"
                label="Email"
                placeholder="admin@institution.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                mode="institution"
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
                mode="institution"
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
                className="w-full py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
                  bg-institution-600 hover:bg-institution-500 
                  shadow-institution/30 hover:shadow-institution/50
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-white"
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

            {/* Footer */}
            <p className="text-center text-sm text-slate-400 border-t border-slate-700/30 pt-6">
              Need help? Contact your system administrator
            </p>
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
