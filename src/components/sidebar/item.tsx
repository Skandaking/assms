'use client';

import { ChevronDown, LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
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

const SidebarItem = ({
  item,
  isCollapsed,
}: {
  item: ISidebarItem;
  isCollapsed: boolean;
}) => {
  const { name, icon: Icon, items, path } = item;
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = useMemo(() => {
    if (items?.length) {
      if (items.find((item) => item.path === pathname)) {
        setExpanded(true);
        return true;
      }
    }
    return path === pathname;
  }, [items, path, pathname]);

  return (
    <div className="mb-1">
      <div
        onClick={() =>
          items?.length ? setExpanded(!expanded) : router.push(path)
        }
        className={`
          flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer
          transition-all duration-200 select-none group relative
          ${
            isActive
              ? 'bg-sidebar-active text-white'
              : 'hover:bg-sidebar-background text-gray-700 hover:text-black'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <Icon
            size={20}
            className={isActive ? 'text-white' : 'text-sidebar-iconColor'}
          />
          {!isCollapsed && <span className="font-medium">{name}</span>}
        </div>
        {!isCollapsed && items && items.length > 0 && (
          <ChevronDown
            size={18}
            className={`transition-transform duration-200
              ${expanded ? 'rotate-180' : ''}
              ${isActive ? 'text-white' : 'text-sidebar-iconColor'}
            `}
          />
        )}
        {isCollapsed && (
          <div className="absolute left-full ml-6 bg-gray-800 text-white px-4 py-2 rounded-md invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 whitespace-nowrap">
            {name}
          </div>
        )}
      </div>
      {!isCollapsed && expanded && items && items.length > 0 && (
        <div className="mt-1 mb-1 py-1">
          {items.map((subItem) => (
            <SubMenuItem key={subItem.path} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
