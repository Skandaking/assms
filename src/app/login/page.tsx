import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {' '}
          ASSMS
        </h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sidebar-active focus:border-sidebar-active"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block 
              w-full px-3 py-2 bg-white border border-
              gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sidebar-active
               focus:border-sidebar-active"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-sidebar-active text-white py-2 px-4 rounded-md 
              hover:bg-opacity-80 hover:text-lg focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-sidebar-active transition-all duration-300 
              ease-in-out hover:shadow-lg"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
