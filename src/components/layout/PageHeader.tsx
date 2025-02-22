'use client';

import { Search } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  searchTerm?: string;
  onSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
}

const PageHeader = ({
  title,
  searchTerm = '',
  onSearch,
  searchPlaceholder = 'Search...',
}: PageHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{title}</h1>
      {onSearch && (
        <div className="relative">
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
