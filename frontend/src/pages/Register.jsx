// frontend/src/pages/Register.jsx
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Student'); // Default role
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-3xl font-bold text-white">AC</span>
            </div>
          </div>

          <h2 className="mb-2 text-3xl font-bold text-center text-white">Join AlumniConnect</h2>
          <p className="text-center text-slate-400 mb-8">Create your account and connect with alumni</p>
          
          {error && (
            <div className="p-4 mb-4 text-sm text-red-200 bg-red-900 bg-opacity-50 rounded-lg border border-red-700">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-200">Full Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-200">Email Address</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-200">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength="6" 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-200">Confirm Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-200">I am a...</label>
              <select 
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Student">Student</option>
                <option value="Alumni">Alumni</option>
                <option value="Faculty">Faculty</option>
              </select>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <p className="mt-6 text-sm text-center text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition">
              Sign in here
            </Link>
          </p>

          <div className="mt-6 pt-6 border-t border-slate-700 text-center">
            <Link to="/" className="text-slate-400 hover:text-blue-400 text-sm transition">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;