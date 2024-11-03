'use client';
import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FileStack,
  BadgeInfo,
  Users,
  UserPlus,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
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
    <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-10 p-3">
      <div className="flex flex-col space-y-4 w-full">
        <div className="text-center text-2xl font-bold text-sidebar-active">
          ASSMS
        </div>
        <div className="flex flex-col space-y-2">
          {items
            .filter((item) => item.name !== 'User' || role === 'administrator')
            .map((item, index) => (
              <SidebarItem key={index} item={item} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
