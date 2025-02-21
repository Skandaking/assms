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
  const [showSubmenu, setShowSubmenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = useMemo(() => {
    if (items?.length) {
      if (items.find((item) => item.path === pathname)) {
        if (!isCollapsed) {
          setExpanded(true);
        }
        return true;
      }
    }
    return path === pathname;
  }, [items, path, pathname, isCollapsed]);

  return (
    <div
      className="mb-1 relative"
      onMouseEnter={() => isCollapsed && items && setShowSubmenu(true)}
      onMouseLeave={() => isCollapsed && setShowSubmenu(false)}
    >
      <div
        onClick={() =>
          items?.length
            ? !isCollapsed && setExpanded(!expanded)
            : router.push(path)
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
          <div className="absolute left-full ml-6 bg-white shadow-md text-gray-700 px-4 py-2 rounded-md invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 whitespace-nowrap">
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
      {isCollapsed && showSubmenu && items && items.length > 0 && (
        <div className="absolute left-full top-0 ml-6 bg-white shadow-md rounded-md py-2 min-w-[160px] z-50">
          {items.map((subItem) => (
            <div
              key={subItem.path}
              onClick={() => router.push(subItem.path)}
              className={`px-4 py-2 hover:bg-sidebar-background cursor-pointer
                ${subItem.path === pathname ? 'bg-sidebar-active text-white' : 'text-gray-700'}
              `}
            >
              {subItem.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
