import Modal from './Modal';
import Button from './Button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookTitle: string | undefined;
  isDeleting: boolean;
}

const ConfirmDeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  bookTitle, 
  isDeleting 
}: ConfirmDeleteModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Book?">
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete the book "<strong>{bookTitle || 'this book'}</strong>"?
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={onConfirm} 
            isLoading={isDeleting}
            aria-label={`Confirm deletion of ${bookTitle}`}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
