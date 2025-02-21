'use client';

import logo from '@/app/logo.png';
import { LogoutDialog } from '@/components/logout-dialog';
import {
  BadgeInfo,
  ChevronsLeft,
  ChevronsRight,
  FileStack,
  LayoutDashboard,
  LucideIcon,
  UserPlus,
  Users,
} from 'lucide-react';
import Image from 'next/image';
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

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}) => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg z-10 transition-all duration-300 flex flex-col justify-between
        ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex flex-col space-y-6 w-full p-4">
          <div
            className={`flex items-center justify-center text-3xl font-bold text-sidebar-active mb-4 transition-all duration-300 
            ${isCollapsed ? 'text-xl px-0' : ''}`}
          >
            {isCollapsed ? (
              <Image
                src={logo}
                alt="ASSMS Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            ) : (
              <div className="flex items-center gap-2">
                <Image
                  src={logo}
                  alt="ASSMS Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span>ASSMS</span>
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            {items
              .filter(
                (item) => item.name !== 'User' || role === 'administrator'
              )
              .map((item, index) => (
                <SidebarItem
                  key={index}
                  item={item}
                  isCollapsed={isCollapsed}
                />
              ))}
          </div>
        </div>

        <div className="p-4">
          <LogoutDialog isCollapsed={isCollapsed} />
        </div>
      </div>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`fixed top-20 z-20 bg-white shadow-md rounded-full p-1.5 hover:bg-gray-100 transition-colors
          ${isCollapsed ? 'left-16' : 'left-60'}`}
      >
        {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
      </button>
    </>
  );
};

export default Sidebar;
