import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import GlassCard from '../../components/admin/GlassCard';
import GlassInput from '../../components/admin/GlassInput';

export default function DeveloperGate() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'gate' | 'success'>('gate');
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [error, setError] = useState('');

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (name.trim().toLowerCase() === 'zeel' && place.trim().toLowerCase() === 'maheshwar') {
      setStep('success');
      setTimeout(() => {
        navigate('/admin/developer/login');
      }, 3000);
    } else {
      setError('Incorrect information. Access denied.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      {/* Animated background blobs - Purple */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-purple-600 mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-purple-500 mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        {/* Main Card */}
        <GlassCard className="shadow-purple-500/20">
          <div className="p-8 space-y-8">
            {step === 'gate' ? (
              <>
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 rounded-xl bg-purple-600/20">
                      <Lock size={28} className="text-purple-400" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent">
                      Developer Access
                    </h1>
                    <p className="text-slate-400 text-sm">Answer a few questions to proceed</p>
                  </div>
                </div>

                {/* Gate Form */}
                <form onSubmit={handleGateSubmit} className="space-y-4">
                  <GlassInput
                    label="What is your name?"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <GlassInput
                    label="Where are you from?"
                    placeholder="Enter place"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    required
                  />

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-2 text-red-300 text-sm">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!name || !place}
                    className="w-full py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
                      bg-purple-600 hover:bg-purple-500
                      shadow-purple-500/30 hover:shadow-purple-500/50
                      disabled:opacity-50 disabled:cursor-not-allowed
                      text-white"
                  >
                    Verify Access
                  </button>
                </form>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <CheckCircle2 size={48} className="text-green-400" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white">Access Granted</h1>
                    <p className="text-slate-400">You can now access the developer portal</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-medium">
                    Redirecting in 3 seconds...
                  </div>
                </div>
              </>
            )}
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
