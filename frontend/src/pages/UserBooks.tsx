import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/bookStore';
import api from '../utils/api';
import { Book, User } from '../types';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

interface UserBooksResponse {
  user: Partial<User>;
  books: Book[];
}

const UserBooks = () => {
  const { username } = useParams<{ username: string }>();
  const { currentUser, books } = useStore();
  const [profileUser, setProfileUser] = useState<Partial<User> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!username) return;
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await api.get<UserBooksResponse>(`/users/${username}/books`);
        setProfileUser(data.user);
      } catch (err: any) { 
        console.error('Error fetching user books:', err);
        setError(err.message || 'Failed to load books for this user.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [username]);

  const isOwnProfile = currentUser?.username === username;
  const pageTitle = isOwnProfile ? 'My Books' : `${username}'s Books`;

  const userBooks = useMemo(() => {
    if (!username || !profileUser?._id) return [];
    return books.filter(b => {
      const ownerId = typeof b.owner === 'string' ? b.owner : b.owner._id;
      return b.isAvailable && ownerId === profileUser._id;
    });
  }, [books, username, profileUser]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 min-h-screen"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{pageTitle}</h1>
        {profileUser?.location && (
          <p className="text-md text-gray-600 dark:text-gray-400 mb-6">Location: {profileUser.location}</p>
        )}

        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        ) : userBooks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-gray-400">
              {isOwnProfile ? 'You haven\'t added any books yet.' : `${username} hasn\'t added any books yet.`}
            </p>
            {isOwnProfile && (
              <Link to="/add-book" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
                Add Your First Book
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userBooks.map(book => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserBooks;