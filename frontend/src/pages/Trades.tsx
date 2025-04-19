import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/bookStore';
import { Trade, TradeStatus } from '../types';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';

const TradeStatusBadge = ({ status }: { status: TradeStatus }) => {
  const colors = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
    accepted: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
    rejected: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300',
    completed: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
    cancelled: 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${colors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const TradeCard = ({ trade }: { trade: Trade }) => {
  const { currentUser, updateTradeStatus } = useStore();
  const isReceiver = trade.receiver === currentUser?._id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateStatus = async (status: TradeStatus) => {
    setIsSubmitting(true);
    try {
      await updateTradeStatus(trade._id, status);
    } catch (error) {
      console.error('Failed to update trade status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trade Request</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(trade.createdAt).toLocaleDateString()}
          </p>
        </div>
        <TradeStatusBadge status={trade.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Offered Book</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {typeof trade.bookOffered === 'object' ? trade.bookOffered.title : 'Loading...'}
          </p>
        </div>
        <div className="space-y-1">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Requested Book</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {typeof trade.bookRequested === 'object' ? trade.bookRequested.title : 'Loading...'}
          </p>
        </div>
      </div>

      {trade.message && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Message</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
            {trade.message}
          </p>
        </div>
      )}

      {isReceiver && trade.status === 'pending' && (
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleUpdateStatus('accepted')}
            variant="primary"
            isLoading={isSubmitting}
          >
            Accept
          </Button>
          <Button
            onClick={() => handleUpdateStatus('rejected')}
            variant="danger"
            isLoading={isSubmitting}
          >
            Reject
          </Button>
        </div>
      )}

      {(trade.status === 'accepted' && !isReceiver) && (
        <Button
          onClick={() => handleUpdateStatus('completed')}
          variant="primary"
          isLoading={isSubmitting}
        >
          Mark as Completed
        </Button>
      )}
    </motion.div>
  );
};

const Trades = () => {
  const { trades, isLoading, error, fetchUserTrades } = useStore();

  useEffect(() => {
    fetchUserTrades();
  }, [fetchUserTrades]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 min-h-screen"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Trades</h1>

        {error && <ErrorAlert message={error} />}

        {isLoading.trades ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        ) : trades.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-gray-400">
              No trades found. Start trading books with other users!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {trades.map(trade => (
                <TradeCard key={trade._id} trade={trade} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Trades;