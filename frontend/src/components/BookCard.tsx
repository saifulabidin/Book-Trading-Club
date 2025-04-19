import { useState, useEffect, useMemo } from 'react';
import { Book, User } from '../types';
import { useStore } from '../store/bookStore';
import Modal from './Modal';
import Button from './Button';
import { motion } from 'framer-motion';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const { currentUser, books, proposeTrade } = useStore();
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Reset form state when modal is closed
  useEffect(() => {
    if (!showTradeModal) {
      setSelectedBookId('');
      setMessage('');
    }
  }, [showTradeModal]);

  // Get book owner ID consistently
  const bookOwnerId = useMemo(() => 
    typeof book.owner === 'string' ? book.owner : (book.owner as User)._id, 
    [book.owner]
  );
  
  // Determine if current user is the owner
  const isOwner = currentUser?._id === bookOwnerId;

  // Filter user's books that are available for trade
  const userBooks = useMemo(() => {
    if (!currentUser) return [];
    
    return books.filter(b => {
      const ownerId = typeof b.owner === 'string' ? b.owner : (b.owner as User)._id;
      return ownerId === currentUser._id && 
        b._id !== book._id &&
        b.isAvailable;
    });
  }, [books, book._id, currentUser]);

  // Handle trade proposal submission
  const handleTrade = async () => {
    if (!selectedBookId) return;
    
    setIsSubmitting(true);
    try {
      await proposeTrade(selectedBookId, book._id, message);
      setShowTradeModal(false);
    } catch (error) {
      console.error('Trade error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form field changes
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBookId(e.target.value);
  };
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const cardVariants = {
    hover: { 
      y: -5,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: { duration: 0.3 }
    }
  };

  const conditionColors = {
    'New': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    'Like New': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    'Very Good': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    'Good': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    'Fair': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
    'Poor': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  };

  return (
    <>
      {/* Book card display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover="hover"
        variants={cardVariants}
        className="h-full"
      >
        {/* Book card content */}
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col overflow-hidden border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300"
          tabIndex={0} 
          aria-label={`Book: ${book.title} by ${book.author}`}
        >
          {/* Book image */}
          {book.image && (
            <div className="relative pt-[60%] bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div className={`absolute inset-0 flex items-center justify-center ${!imageLoaded ? 'block' : 'hidden'}`}>
                <div className="w-8 h-8 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
              <img
                src={book.image}
                alt={book.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          )}
          
          {/* Book details */}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {book.author}
            </p>
            
            {book.owner && typeof book.owner !== 'string' && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Owner: {book.owner.username || 'Unknown'}
              </span>
            )}

            {book.condition && (
              <span className={`inline-flex self-start mt-2 px-2 py-1 text-xs rounded-full ${conditionColors[book.condition] || 'bg-gray-100 dark:bg-gray-700'}`}>
                {book.condition}
              </span>
            )}

            {/* Book genres */}
            {book.genre && book.genre.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {book.genre.slice(0, 3).map((g, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded transition-colors duration-300"
                  >
                    {g}
                  </span>
                ))}
                {book.genre.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                    +{book.genre.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Trade button or availability status */}
            <div className="mt-auto pt-4">
              {!isOwner && book.isAvailable && currentUser && (
                <Button
                  onClick={() => setShowTradeModal(true)}
                  fullWidth
                  aria-label={`Propose trade for ${book.title}`}
                >
                  Propose Trade
                </Button>
              )}

              {!book.isAvailable && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 py-2 px-3 rounded text-yellow-600 dark:text-yellow-400 text-sm text-center">
                  Currently unavailable for trade
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trade proposal modal */}
      <Modal
        isOpen={showTradeModal}
        onClose={() => setShowTradeModal(false)}
        title={`Propose Trade for "${book.title}"`}
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleTrade(); }}>
          {/* Book selection dropdown */}
          <div>
            <label htmlFor="book-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select your book to offer
            </label>
            <select
              id="book-select"
              value={selectedBookId}
              onChange={handleSelectChange}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
              required
            >
              <option value="">Select a book</option>
              {userBooks.map(b => (
                <option key={b._id} value={b._id}>
                  {b.title}
                </option>
              ))}
            </select>
            {userBooks.length === 0 && (
              <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                You don't have any available books to trade. Add a book first!
              </p>
            )}
          </div>

          {/* Trade message textarea */}
          <div>
            <label htmlFor="trade-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message (optional)
            </label>
            <textarea
              id="trade-message"
              value={message}
              onChange={handleMessageChange}
              rows={3}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
              placeholder="Add a message to the trade request..."
            />
          </div>

          {/* Modal action buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowTradeModal(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedBookId || userBooks.length === 0}
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Proposing...' : 'Propose Trade'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default BookCard;