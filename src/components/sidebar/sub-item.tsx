'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

interface ISubItem {
  name: string;
  path: string;
}

const SubMenuItem = ({ item }: { item: ISubItem }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = useMemo(() => item.path === pathname, [item.path, pathname]);

  return (
    <div
      onClick={() => router.push(item.path)}
      className={`
        group flex items-center py-2 px-4 mx-2 rounded-md transition-all duration-200
        text-sm font-medium cursor-pointer
        ${
          isActive
            ? 'bg-sidebar-active text-white'
            : 'text-gray-700 hover:bg-sidebar-background hover:text-black'
        }
      `}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full mr-3 
        ${isActive ? 'bg-white' : 'bg-gray-400 group-hover:bg-gray-600'}`}
      />
      {item.name}
    </div>
  );
};

export default SubMenuItem;
