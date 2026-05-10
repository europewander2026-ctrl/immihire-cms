import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../utils/api';
import defaultLogo from '../../assets/images/immihire-logo.webp';

const Login = () => {
  const [view, setView] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/login', { email, password });
      
      if (response.status === 200) {
        localStorage.setItem('admin_token', response.data.token);
        const origin = location.state?.from?.pathname || '/immi-admin';
        navigate(origin, { replace: true });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid credentials. Please try again.');
      } else {
        setError('An error occurred during login. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/reset-request', { email });
      setMessage(res.data.message);
      setView('reset'); // Switch to reset view automatically
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/api/auth/reset-password', { email, code, newPassword });
      setMessage(res.data.message);
      setTimeout(() => {
        setView('login');
        setPassword('');
        setCode('');
        setNewPassword('');
        setConfirmPassword('');
        setMessage('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
      <div className="flex flex-col items-center justify-center">
        <img src={defaultLogo} alt="ImmiHire Logo" className="h-12 w-auto object-contain mb-4" />
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {view === 'login' && 'Sign in to your account'}
          {view === 'forgot' && 'Reset Password'}
          {view === 'reset' && 'Set New Password'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {view === 'login' ? 'Secure Admin Portal' : (
            <button type="button" onClick={() => { setView('login'); setError(''); setMessage(''); }} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              return to login
            </button>
          )}
        </p>
      </div>

      {view === 'login' && (
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="relative w-full">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center focus:outline-none"
              >
                {showPassword ? (
                  <i className="fa-solid fa-eye-slash text-gray-400 hover:text-gray-600"></i>
                ) : (
                  <i className="fa-solid fa-eye text-gray-400 hover:text-gray-600"></i>
                )}
              </button>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center font-medium">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Authenticating...' : 'Sign in'}
            </button>
          </div>
          <div className="text-center mt-4 text-sm">
            <button type="button" onClick={() => { setView('forgot'); setError(''); setMessage(''); }} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Forgot your password?
            </button>
          </div>
        </form>
      )}

      {view === 'forgot' && (
        <form className="mt-8 space-y-6" onSubmit={handleForgotRequest}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center font-medium">{error}</div>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Sending...' : 'Send reset code'}
            </button>
          </div>
        </form>
      )}

      {view === 'reset' && (
        <form className="mt-8 space-y-6" onSubmit={handleResetSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">6-Digit Code</label>
              <input
                type="text"
                required
                maxLength="6"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-xl tracking-widest sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm text-center font-medium">{error}</div>}
          {message && <div className="text-sm font-medium text-green-800 bg-green-100 p-3 rounded text-center">{message}</div>}
          <div>
            <button
              type="submit"
              disabled={loading || message.includes('successful')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Resetting...' : 'Verify & Reset Password'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
