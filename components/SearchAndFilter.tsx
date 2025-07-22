
'use client';

import { useState } from 'react';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  darkMode: boolean;
}

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  darkMode
}: SearchAndFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const categories = ['All', 'Simple', 'Luxury', 'Vintage'];

  return (
    <div className="mb-12">
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={`ri-search-line text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}></i>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search watches..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-amber-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-amber-500'
            } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === category
                  ? 'bg-amber-600 text-white shadow-lg'
                  : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
