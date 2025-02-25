import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Lock, Mail, Users } from 'lucide-react';
import { useTeamMembers } from '../../hooks/useTeamMembers';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceIds: string[];
  projectId: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  resourceIds,
  projectId
}) => {
  const { teamMembers } = useTeamMembers(projectId);
  const [password, setPassword] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [additionalEmails, setAdditionalEmails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement share creation logic
      console.log('Creating share with:', {
        resourceIds,
        password,
        selectedTemplate,
        recipients,
        additionalEmails
      });
      onClose();
    } catch (error) {
      console.error('Error creating share:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Resources"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
            Password Protection
          </label>
          <div className="mt-1 relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
              placeholder="Enter a password for the share link"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary" size={16} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
            Email Template
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
          >
            <option value="">Select a template</option>
            <option value="review">Review Request</option>
            <option value="update">Project Update</option>
            <option value="custom">Custom Message</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
            Team Members
          </label>
          <div className="mt-1 space-y-2">
            {teamMembers.map(member => (
              <label key={member.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={recipients.includes(member.email)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRecipients([...recipients, member.email]);
                    } else {
                      setRecipients(recipients.filter(r => r !== member.email));
                    }
                  }}
                  className="rounded border-gray-300 text-secondary focus:ring-secondary"
                />
                <span className="ml-2 text-text-light-primary dark:text-text-dark-primary">
                  {member.name} ({member.email})
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
            Additional Recipients
          </label>
          <div className="mt-1 relative">
            <textarea
              value={additionalEmails}
              onChange={(e) => setAdditionalEmails(e.target.value)}
              placeholder="Enter email addresses (one per line)"
              rows={3}
              className="pl-10 mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
            />
            <Mail className="absolute left-3 top-3 text-text-light-secondary dark:text-text-dark-secondary" size={16} />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Share...' : 'Create Share'}
          </button>
        </div>
      </form>
    </Modal>
  );
};