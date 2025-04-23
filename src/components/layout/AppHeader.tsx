'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

interface AppHeaderProps {
  isCollapsed: boolean;
}

const AppHeader = ({ isCollapsed }: AppHeaderProps) => {
  const { user, loading } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get display name from user data, with fallbacks
  const getDisplayName = () => {
    if (!user) return 'Guest';

    // If we have firstname and lastname, use them
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    }

    // If we have only one, use it
    if (user.firstname) return user.firstname;
    if (user.lastname) return user.lastname;

    // If we have username, use it
    if (user.username) return user.username;

    // Last resort
    return `User #${user.id}`;
  };

  const handleLogout = async () => {
    // Clear user data from localStorage
    try {
      localStorage.removeItem('user');
    } catch (e) {
      console.warn('Error removing from localStorage:', e);
    }

    // Call logout API to clear cookies
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (e) {
      console.error('Error logging out:', e);
    }

    // Redirect to login page
    router.push('/login');
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(false);
    // Use setTimeout to allow the dropdown to close before navigation
    setTimeout(() => {
      router.push('/profile');
    }, 10);
  };

  return (
    <header
      className={`fixed top-0 right-0 bg-white border-b z-40 transition-all duration-300 ${
        isCollapsed ? 'left-[80px]' : 'left-[250px]'
      }`}
    >
      <div className="px-4">
        <div className="flex items-center justify-end h-16">
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center space-x-2"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium">{getDisplayName()}</p>
                      <p className="text-xs text-gray-500">
                        {user ? user.role : 'Not logged in'}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 ml-1" />
                  </div>
                </button>

                {/* User dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
