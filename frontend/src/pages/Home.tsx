import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/bookStore';
import BookCard from '../components/BookCard';
import BookCardSkeleton from '../components/BookCardSkeleton';
import SearchAndFilter from '../components/SearchAndFilter';
import ErrorAlert from '../components/ErrorAlert';

const Home = () => {
  const { 
    books, 
    isLoading, 
    error, 
    filters,
    fetchBooks,
    searchBooks,
    filterByCategory,
    filterByCondition
  } = useStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         book.author.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategories = filters.categories.length === 0 || 
                             book.genre?.some(g => filters.categories.includes(g));
    
    const matchesCondition = filters.condition.length === 0 ||
                            filters.condition.includes(book.condition);
    
    return matchesSearch && matchesCategories && matchesCondition;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SearchAndFilter 
            onSearch={searchBooks}
            onCategoryFilter={filterByCategory}
            onConditionFilter={filterByCondition}
          />
        </motion.div>

        {error && (
          <div className="mt-6">
            <ErrorAlert message={error} />
          </div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6"
        >
          {isLoading.books ? (
            [...Array(8)].map((_, i) => (
              <motion.div key={i} variants={item}>
                <BookCardSkeleton />
              </motion.div>
            ))
          ) : filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <motion.div key={book._id} variants={item}>
                <BookCard book={book} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <div className="text-gray-500 dark:text-gray-400">
                {filters.search || filters.categories.length > 0 || filters.condition.length > 0 ? (
                  <>
                    <h3 className="text-lg font-medium mb-2">No books found</h3>
                    <p>Try adjusting your search filters</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium mb-2">No books available</h3>
                    <p>Be the first to add a book!</p>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;