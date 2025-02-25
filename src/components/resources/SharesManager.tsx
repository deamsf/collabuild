import React, { useState } from 'react';
import { Modal } from '../Modal';
import { ConfirmationModal } from '../ConfirmationModal';
import { Link2, Users, Calendar, Trash2 } from 'lucide-react';

interface SharesManagerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const SharesManager: React.FC<SharesManagerProps> = ({
  isOpen,
  onClose,
  projectId
}) => {
  const [shareToDelete, setShareToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (shareToDelete) {
      try {
        // TODO: Implement share deletion logic
        console.log('Deleting share:', shareToDelete);
        setShareToDelete(null);
      } catch (error) {
        console.error('Error deleting share:', error);
      }
    }
  };

  // Example share data - replace with actual data from your backend
  const shares = [
    {
      id: '1',
      name: 'Foundation Plans Review',
      url: 'https://example.com/share/1',
      recipients: ['john@example.com', 'jane@example.com'],
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Manage Shares"
      >
        <div className="space-y-4">
          {shares.map(share => (
            <div
              key={share.id}
              className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-text-light-primary dark:text-text-dark-primary">
                    {share.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    <Link2 size={16} />
                    <a
                      href={share.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-secondary"
                    >
                      {share.url}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setShareToDelete(share.id)}
                  className="p-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-accent-red rounded-lg"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1 text-text-light-secondary dark:text-text-dark-secondary">
                  <Users size={16} />
                  <span>{share.recipients.length} recipients</span>
                </div>
                <div className="flex items-center gap-1 text-text-light-secondary dark:text-text-dark-secondary">
                  <Calendar size={16} />
                  <span>Expires {new Date(share.expires_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}

          {shares.length === 0 && (
            <div className="text-center py-8 text-text-light-secondary dark:text-text-dark-secondary">
              No active shares found.
            </div>
          )}
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={!!shareToDelete}
        onClose={() => setShareToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Share"
        message="Are you sure you want to delete this share? All recipients will lose access to the shared resources."
        confirmLabel="Delete Share"
      />
    </>
  );
};