'use client';
import logo from '@/app/logo.png';
import { Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data));
      router.push('/home');
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600">
      {/* Header - Reduced padding */}
      <header className="bg-white shadow-md py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <img src={logo.src} alt="ASSMS Logo" className="rounded-full" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              Accounting Service Staff Management System
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content - Flex grow to take available space */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Login Form */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                Login to ASSMS
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Enter your credentials to access your account
              </p>

              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 px-4 rounded-md 
                    hover:bg-gray-800 focus:outline-none focus:ring-2 
                    focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 
                    ease-in-out hover:shadow-lg text-lg font-semibold"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Reduced padding */}
      <footer className="bg-white shadow-md py-2">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} ASSMS. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Accounting Service Staff Management System
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
