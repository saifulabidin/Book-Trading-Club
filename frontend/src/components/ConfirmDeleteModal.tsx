import Modal from './Modal';
import Button from './Button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookTitle?: string;
  isDeleting: boolean;
}

/**
 * Reusable confirmation dialog for book deletion
 * 
 * @param isOpen - Controls modal visibility
 * @param onClose - Handler for cancel/close actions
 * @param onConfirm - Handler for confirming deletion
 * @param bookTitle - The title of the book being deleted
 * @param isDeleting - Loading state during deletion process
 */
const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  bookTitle = 'this book',
  isDeleting
}: ConfirmDeleteModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
    >
      <div className="py-4">
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete <strong>{bookTitle}</strong>? This action cannot be undone.
        </p>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            type="button"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          
          <Button
            variant="danger"
            onClick={onConfirm}
            type="button"
            isLoading={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Book'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
