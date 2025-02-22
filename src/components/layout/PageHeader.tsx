'use client';

import { useSidebar } from '@/context/SidebarContext';
import { FileSpreadsheet, PlusCircle, Printer, Search } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  searchTerm?: string;
  onSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
  onAdd?: () => void;
  onPrint?: () => void;
  onExport?: () => void;
  showControls?: boolean;
}

const PageHeader = ({
  title,
  searchTerm = '',
  onSearch,
  searchPlaceholder = 'Search...',
  onAdd,
  onPrint,
  onExport,
  showControls = false,
}: PageHeaderProps) => {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={`fixed top-16 bg-white z-30 px-6 py-4 border-b transition-all duration-300
        ${isCollapsed ? 'left-20 right-0' : 'left-64 right-0'}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        {showControls && (
          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              onClick={onExport}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export to Excel
            </button>
            <button
              onClick={onAdd}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Employee
            </button>
          </div>
        )}
      </div>
      {onSearch && (
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={onSearch}
            className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default PageHeader;
