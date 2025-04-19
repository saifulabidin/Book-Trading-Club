import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/bookStore';
import { BookCondition } from '../types';
import Button from '../components/Button';
import ErrorAlert from '../components/ErrorAlert';
import { motion } from 'framer-motion';
import useFormValidation from '../hooks/useFormValidation';
import { validateBook } from '../utils/validation';
import { safeSplit } from '../utils/types';

const AddBook = () => {
  const navigate = useNavigate();
  const addBook = useStore(state => state.addBook);
  const [error, setError] = useState<string | null>(null);
  
  // Define proper types for form values
  interface BookFormValues {
    title: string;
    author: string;
    description: string;
    condition: BookCondition | '';
    isbn: string;
    genre: string;  // Store as comma-separated string in form
    publishedYear: string;  // Store as string in form, parse to number when submitting
    image: string;
  }
  
  const initialValues: BookFormValues = {
    title: '',
    author: '',
    description: '',
    condition: '' as BookCondition | '',
    isbn: '',
    genre: '',
    publishedYear: '',
    image: ''
  };
  
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setServerErrors
  } = useFormValidation<BookFormValues>({
    initialValues,
    validate: validateBook,
    onSubmit: async (values: BookFormValues) => {
      setError(null);
      
      try {
        // Process form values properly with safe type conversions
        const genreArray = safeSplit(values.genre, ',').map(g => g.trim()).filter(Boolean);
        const publishedYearValue = values.publishedYear ? parseInt(values.publishedYear, 10) : undefined;
        
        // Construct properly typed book data
        const bookData = {
          title: values.title,
          author: values.author,
          description: values.description,
          condition: values.condition as BookCondition, // Type assertion after validation
          isbn: values.isbn,
          genre: genreArray,
          publishedYear: publishedYearValue,
          image: values.image || undefined,
          isAvailable: true,
          updatedAt: new Date().toISOString(),
        };
        
        await addBook(bookData);
        navigate('/');
      } catch (err: any) {
        // Handle both general error message and field-specific errors
        if (err.errors && Object.keys(err.errors).length > 0) {
          setServerErrors(err.errors);
        }
        setError(err.message || 'Failed to add book');
        throw err; // Rethrow to keep form in submitting state
      }
    }
  });

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
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
              touched.title && errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            }`}
          />
          {touched.title && errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Author *
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={values.author}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
              touched.author && errors.author ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            }`}
          />
          {touched.author && errors.author && (
            <p className="mt-1 text-sm text-red-600">{errors.author}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={4}
            className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
              touched.description && errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            }`}
          />
          {touched.description && errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Condition *
          </label>
          <select
            id="condition"
            name="condition"
            value={values.condition}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
              touched.condition && errors.condition ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            }`}
          >
            <option value="">Select condition</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
          {touched.condition && errors.condition && (
            <p className="mt-1 text-sm text-red-600">{errors.condition}</p>
          )}
        </div>

        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ISBN
          </label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={values.isbn}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
              touched.isbn && errors.isbn ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            }`}
          />
          {touched.isbn && errors.isbn && (
            <p className="mt-1 text-sm text-red-600">{errors.isbn}</p>
          )}
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Genres (comma-separated)
          </label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={values.genre}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Fiction, Fantasy, Adventure"
            className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
              touched.genre && errors.genre ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            }`}
          />
          {touched.genre && errors.genre && (
            <p className="mt-1 text-sm text-red-600">{errors.genre}</p>
          )}
        </div>

        <div>
          <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Published Year
          </label>
          <input
            type="number"
            id="publishedYear"
            name="publishedYear"
            value={values.publishedYear}
            onChange={handleChange}
            onBlur={handleBlur}
            min="1000"
            max={new Date().getFullYear()}
            className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
              touched.publishedYear && errors.publishedYear ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            }`}
          />
          {touched.publishedYear && errors.publishedYear && (
            <p className="mt-1 text-sm text-red-600">{errors.publishedYear}</p>
          )}
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Book Cover URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={values.image}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
              touched.image && errors.image ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            }`}
          />
          {touched.image && errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}
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