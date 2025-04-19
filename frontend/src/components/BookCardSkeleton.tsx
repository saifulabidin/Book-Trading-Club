const BookCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col overflow-hidden animate-pulse transition-colors duration-300">
      {/* Image skeleton */}
      <div className="relative pt-[60%] bg-gray-200 dark:bg-gray-700" />
      
      {/* Content skeleton */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mb-2"></div>
        
        {/* Author skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/5 mb-3"></div>
        
        {/* Owner skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/5 mb-4"></div>
        
        {/* Genre tags skeleton */}
        <div className="flex space-x-2 mb-4">
          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        {/* Button skeleton */}
        <div className="mt-auto pt-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default BookCardSkeleton;