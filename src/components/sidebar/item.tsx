'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import SubMenuItem from './sub-item';

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

const SidebarItem = ({ item }: { item: ISidebarItem }) => {
  const { name, icon: Icon, items, path } = item;
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const onClick = () => {
    if (items && items.length > 0) {
      return setExpanded(!expanded);
    }

    return router.push(path);
  };
  const isActive = useMemo(() => {
    if (items && items.length > 0) {
      if (items.find((item) => item.path === pathname)) {
        setExpanded(true);
        return true;
      }
    }

    return path === pathname;
  }, [items, path, pathname]);

  return (
    <>
      <div
        className={`flex items-center p-3 rounded-lg cursor-pointer justify-between
        ${isActive 
          ? 'bg-sidebar-active text-white' 
          : 'hover:bg-sidebar-background text-gray-700 hover:text-black'
        }
      `}
        onClick={onClick}
      >
        <div className="flex items-center space-x-2">
          <Icon size={20} className={isActive ? 'text-white' : 'text-sidebar-iconColor'} />
          <p className="text-sm font-semibold">{name}</p>
        </div>
        {items && items.length > 0 && (
          <ChevronDown size={18} className={isActive ? 'text-white' : 'text-sidebar-iconColor'} />
        )}
      </div>
      {expanded && items && items.length > 0 && (
        <div className="flex flex-col space-y-1 ml-10">
          {items.map((item) => (
            <SubMenuItem key={item.path} item={item} />
          ))}
        </div>
      )}
    </>
  );
};

export default SidebarItem;
