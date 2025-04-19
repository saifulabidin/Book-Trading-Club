import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/bookStore';
import { BookCondition } from '../types';
import Button from '../components/Button';
import ErrorAlert from '../components/ErrorAlert';
import { motion } from 'framer-motion';

const AddBook = () => {
  const navigate = useNavigate();
  const addBook = useStore(state => state.addBook);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const bookData = {
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      description: formData.get('description') as string,
      condition: formData.get('condition') as BookCondition,
      isbn: formData.get('isbn') as string,
      genre: (formData.get('genre') as string).split(',').map(g => g.trim()),
      publishedYear: parseInt(formData.get('publishedYear') as string),
      image: formData.get('image') as string,
    };

    try {
      await addBook(bookData);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add book');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto p-4 sm:p-6"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Add New Book</h1>

      {error && (
        <ErrorAlert message={error} onDismiss={() => setError(null)} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Author *
          </label>
          <input
            type="text"
            id="author"
            name="author"
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
          />
        </div>

        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Condition *
          </label>
          <select
            id="condition"
            name="condition"
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
          >
            <option value="">Select condition</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>

        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ISBN
          </label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
          />
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Genres (comma-separated)
          </label>
          <input
            type="text"
            id="genre"
            name="genre"
            placeholder="Fiction, Fantasy, Adventure"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
          />
        </div>

        <div>
          <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Published Year
          </label>
          <input
            type="number"
            id="publishedYear"
            name="publishedYear"
            min="1000"
            max={new Date().getFullYear()}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Book Cover URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            type="button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Book'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddBook;