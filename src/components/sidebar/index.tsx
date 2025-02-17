'use client';

import {
  BadgeInfo,
  FileStack,
  LayoutDashboard,
  LucideIcon,
  UserPlus,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import SidebarItem from './item';

interface ISidebarItem {
  name: string;
  path: string;
  icon: LucideIcon;
  items?: ISubItem[];
}

interface ISubItem {
  name: string;
  path: string;
}

const items: ISidebarItem[] = [
  {
    name: 'Home',
    path: '/home',
    icon: LayoutDashboard,
  },
  {
    name: 'User',
    path: '/user',
    icon: UserPlus,
  },
  {
    name: 'Employee',
    path: '/employee',
    icon: Users,
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: FileStack,
  },
  {
    name: 'Help',
    path: '/help',
    icon: BadgeInfo,
    items: [
      {
        name: 'FAQs',
        path: '/help/faqs',
      },
      {
        name: 'Contact Admin',
        path: '/help/contact',
      },
    ],
  },
];

const Sidebar = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-10">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-4 border-b">
          <div className="text-xl font-bold text-sidebar-active text-center tracking-wide">
            ASSMS
          </div>
          <div className="text-xs text-gray-500 text-center mt-1">
            Accounting Service Staff Management
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            {items
              .filter(
                (item) => item.name !== 'User' || role === 'administrator'
              )
              .map((item, index) => (
                <SidebarItem key={index} item={item} />
              ))}
          </nav>
        </div>

        {/* Footer Section */}
        <div className="p-3 border-t">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <span>v1.0.0</span>
            <span>•</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
