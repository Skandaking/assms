'use client';

import { cn } from '@/lib/utils';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

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

  const handleItemClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (items?.length) {
      if (!isCollapsed) {
        setExpanded(!expanded);
      }
    } else {
      // Use setTimeout to avoid React state update conflicts
      setTimeout(() => {
        router.push(path);
      }, 10);
    }
  };

  const handleSubItemClick = (subPath: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Use setTimeout to avoid React state update conflicts
    setTimeout(() => {
      router.push(subPath);
    }, 10);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => isCollapsed && items && setShowSubmenu(true)}
      onMouseLeave={() => isCollapsed && setShowSubmenu(false)}
    >
      <div
        onClick={handleItemClick}
        className={cn(
          'flex items-center justify-between rounded-md cursor-pointer',
          'px-3 py-2 text-sm font-medium transition-all duration-200 select-none group relative',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-accent text-muted-foreground hover:text-foreground'
        )}
      >
        <div className="flex items-center gap-3">
          <Icon
            size={18}
            className={cn(
              isActive ? 'text-primary' : 'text-muted-foreground',
              'group-hover:text-foreground'
            )}
          />
          {!isCollapsed && <span>{name}</span>}
        </div>
        {!isCollapsed && items && items.length > 0 && (
          <ChevronDown
            size={16}
            className={cn(
              'transition-transform duration-200',
              expanded ? 'rotate-180' : '',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        )}
        {isCollapsed && (
          <span className="absolute left-full ml-2 px-2 py-1 rounded bg-popover text-popover-foreground shadow-md border text-xs whitespace-nowrap opacity-0 invisible z-50 group-hover:opacity-100 group-hover:visible transition-all">
            {name}
          </span>
        )}
      </div>
      {!isCollapsed && expanded && items && items.length > 0 && (
        <div className="mt-1 mb-1 ml-6 pl-2 border-l">
          {items.map((subItem) => (
            <div
              key={subItem.path}
              onClick={handleSubItemClick(subItem.path)}
              className={cn(
                'px-3 py-1.5 text-xs rounded-md my-1 cursor-pointer transition-colors',
                subItem.path === pathname
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {subItem.name}
            </div>
          ))}
        </div>
      )}
      {isCollapsed && showSubmenu && items && items.length > 0 && (
        <div className="absolute left-full top-0 ml-2 bg-popover border rounded-md py-1 min-w-[160px] z-50 shadow-md">
          {items.map((subItem) => (
            <div
              key={subItem.path}
              onClick={handleSubItemClick(subItem.path)}
              className={cn(
                'px-3 py-1.5 text-xs cursor-pointer transition-colors',
                subItem.path === pathname
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
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
