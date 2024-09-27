'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

interface ISubItem {
  name: string;
  path: string;
}

const SubMenuItem = ({ item }: { item: ISubItem }) => {
  const { name, path } = item;
  const router = useRouter();
  const pathname = usePathname();

  const onClick = () => {
    router.push(path);
  };

  const isActive = useMemo(() => path === pathname, [path, pathname]);

  return (
    <div
      className={`text-sm cursor-pointer p-2 rounded-lg
        ${isActive 
          ? 'bg-sidebar-active text-white' 
          : 'text-gray-700 hover:bg-sidebar-background hover:text-black'
        }`}
      onClick={onClick}
    >
      {name}
    </div>
  );
};

export default SubMenuItem;
