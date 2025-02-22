'use client';

import { LogOut, User } from 'lucide-react';

interface AppHeaderProps {
  isCollapsed: boolean;
}

const AppHeader = ({ isCollapsed }: AppHeaderProps) => {
  return (
    <header
      className={`fixed top-0 right-0 bg-white border-b z-40 transition-all duration-300 ${
        isCollapsed ? 'left-[80px]' : 'left-[250px]'
      }`}
    >
      <div className="px-4">
        <div className="flex items-center justify-end h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <LogOut className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
