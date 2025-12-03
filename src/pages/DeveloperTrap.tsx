import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';

type TrapPhase = 'checking' | 'unauthorized' | 'authorized';

const DeveloperTrap = () => {
  const navigate = useNavigate();
  const { admin, isAuthenticated } = useAdminAuth();
  const [trapPhase, setTrapPhase] = useState<TrapPhase>('checking');
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && admin?.role === 'developer_admin') {
        setTrapPhase('authorized');
        setTimeout(() => {
          navigate('/admin/developer/dashboard');
        }, 2500);
      } else {
        setTrapPhase('unauthorized');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, admin, navigate]);

  if (trapPhase === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🔐</div>
          <p className="text-white text-xl font-semibold">Verifying credentials...</p>
          <p className="text-purple-200 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (trapPhase === 'authorized') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">✨</div>
          <p className="text-white text-2xl font-bold mb-2">Welcome, Developer!</p>
          <p className="text-green-100">Entering the inner circle...</p>
          <div className="mt-8 flex gap-2 justify-center">
            <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse" style={{animationDelay: '100ms'}}></div>
            <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // Unauthorized - Show creative trap
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8 text-center">
        
        <div className="text-6xl mb-4">🚨</div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">WRONG FLOOR!</h1>
        
        <p className="text-gray-600 mb-6">
          This is the Developer's private zone. You don't seem to have the right credentials.
        </p>

        <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 text-left">
          <p className="text-red-700 text-sm font-mono">
            ERROR: Invalid developer credentials<br/>
            STATUS: Unauthorized access attempt<br/>
            ACTION: Redirecting...
          </p>
        </div>

        {clickCount > 0 && clickCount < 3 && (
          <p className="text-orange-600 text-sm mb-4 font-semibold">
            Why do you keep trying? 😄 ({clickCount}/3)
          </p>
        )}

        {clickCount >= 3 && clickCount < 5 && (
          <p className="text-orange-600 text-sm mb-4 font-semibold">
            Okay, I like your persistence! But NO! 😂
          </p>
        )}

        {clickCount >= 5 && (
          <p className="text-orange-600 text-sm mb-4 font-semibold">
            You're committed! Really committed! But still NO! 🔐
          </p>
        )}

        <div className="space-y-2">
          <button
            onClick={() => navigate('/admin/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Go Back to Login
          </button>
          <button
            onClick={() => setClickCount(c => c + 1)}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Try Again (Keep Trying!)
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition"
          >
            Go Home
          </button>
        </div>

        <p className="text-gray-500 text-xs mt-6">
          Maybe try asking nicely? 😄
        </p>
      </div>
    </div>
  );
};

export default DeveloperTrap;
