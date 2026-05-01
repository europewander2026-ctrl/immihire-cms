import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../utils/api';
import defaultLogo from '../assets/images/immihire-logo.webp';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // API call to the backend login route
      const response = await api.post('/api/login', { email, password });
      
      if (response.status === 200) {
        // Successful login! The API returns a 200 OK and sets the HttpOnly cookie.
        // Redirect to the new admin dashboard route:
        const origin = location.state?.from?.pathname || '/immi-admin';
        navigate(origin, { replace: true });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid credentials. Please try again.');
      } else {
        setError('An error occurred during login. Please try again later.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
      <div className="flex flex-col items-center justify-center">
        <img src={defaultLogo} alt="ImmiHire Logo" className="h-12 w-auto object-contain mb-4" />
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Secure Admin Portal
        </p>
      </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
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
        </form>
        <div className="text-center mt-4 text-sm">
          <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Forgot your password?
          </Link>
        </div>
      </div>
  );
};

export default Login;
