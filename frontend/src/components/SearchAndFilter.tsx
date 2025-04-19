import { useState, useEffect, useRef } from 'react';
import { BookCondition } from '../types';
import { useStore } from '../store/bookStore';
import { motion, AnimatePresence } from 'framer-motion';
import useKeyPress from '../hooks/useKeyPress';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (categories: string[]) => void;
  onConditionFilter: (conditions: BookCondition[]) => void;
}

const SearchAndFilter = ({
  onSearch,
  onCategoryFilter,
  onConditionFilter,
}: SearchAndFilterProps) => {
  const { books } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<BookCondition[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Listen for escape key to close filters
  const isEscapePressed = useKeyPress('Escape');

  // Handle escape key press to close filters
  useEffect(() => {
    if (isEscapePressed && isFilterOpen) {
      setIsFilterOpen(false);
    }
  }, [isEscapePressed, isFilterOpen]);

  // Extract unique categories from all books
  const allCategories = Array.from(
    new Set(
      books
        .flatMap(book => book.genre || [])
        .filter(Boolean)
    )
  ).sort();

  const conditions: BookCondition[] = [
    'New',
    'Like New',
    'Very Good',
    'Good',
    'Fair',
    'Poor'
  ];

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  const handleCategoryChange = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(updatedCategories);
    onCategoryFilter(updatedCategories);
  };

  const handleConditionChange = (condition: BookCondition) => {
    const updatedConditions = selectedConditions.includes(condition)
      ? selectedConditions.filter(c => c !== condition)
      : [...selectedConditions, condition];
    
    setSelectedConditions(updatedConditions);
    onConditionFilter(updatedConditions);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedConditions([]);
    onCategoryFilter([]);
    onConditionFilter([]);
    
    // Auto-focus search after clearing
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedConditions.length > 0;

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-lg shadow-md transition-all duration-300">
      {/* Search input */}
      <div className="relative">
        <div className="relative flex items-center">
          <span className="absolute left-3 text-gray-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            ref={searchInputRef}
            aria-label="Search books"
            type="text"
            placeholder="Search books by title or author..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={handleSearchClear}
                className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 focus:outline-none focus:text-indigo-500 rounded-full p-1"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          aria-expanded={isFilterOpen}
          aria-controls="filter-panel"
          className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 px-2 py-1"
        >
          <svg className={`w-5 h-5 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span>Filters</span>
          <AnimatePresence mode="wait">
            {hasActiveFilters && (
              <motion.span
                key="filter-count"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full"
              >
                {selectedCategories.length + selectedConditions.length}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              onClick={clearFilters}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900 rounded-md px-2 py-1 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filters
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Filter panel */}
      <motion.div
        initial={false}
        animate={{ 
          height: isFilterOpen ? 'auto' : 0, 
          opacity: isFilterOpen ? 1 : 0,
          marginTop: isFilterOpen ? '1rem' : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700"
        id="filter-panel"
      >
        <div className="p-4 space-y-6">
          {/* Categories section */}
          {allCategories.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Categories
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {allCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCategoryChange(category);
                      }
                    }}
                    aria-pressed={selectedCategories.includes(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 ${
                      selectedCategories.includes(category)
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {selectedCategories.includes(category) && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conditions section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Condition
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {conditions.map(condition => (
                <button
                  key={condition}
                  onClick={() => handleConditionChange(condition)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleConditionChange(condition);
                    }
                  }}
                  aria-pressed={selectedConditions.includes(condition)}
                  className={`px-3 py-1 rounded-full text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 ${
                    selectedConditions.includes(condition)
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {selectedConditions.includes(condition) && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {condition}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Applied Filters */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap gap-2 pt-2"
          >
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
              Applied filters:
            </div>
            {selectedCategories.map(category => (
              <span 
                key={`filter-${category}`}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs"
              >
                {category}
                <button 
                  onClick={() => handleCategoryChange(category)}
                  aria-label={`Remove ${category} filter`}
                  className="ml-1 text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-200 focus:outline-none focus:text-indigo-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            {selectedConditions.map(condition => (
              <span 
                key={`filter-${condition}`}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs"
              >
                {condition}
                <button 
                  onClick={() => handleConditionChange(condition)}
                  aria-label={`Remove ${condition} filter`}
                  className="ml-1 text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-200 focus:outline-none focus:text-purple-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchAndFilter;