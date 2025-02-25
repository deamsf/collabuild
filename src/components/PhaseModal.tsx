import React, { useState } from 'react';
import { Modal } from './Modal';
import { Phase } from '../types';

interface PhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phase: Omit<Phase, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  projectId: string;
  phase?: Phase;
  mode: 'create' | 'edit';
}

export const PhaseModal = ({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  phase,
  mode
}: PhaseModalProps) => {
  const [formData, setFormData] = useState({
    name: phase?.name || '',
    description: phase?.description || '',
    start_date: phase?.start_date ? new Date(phase.start_date).toISOString().split('T')[0] : '',
    due_date: phase?.due_date ? new Date(phase.due_date).toISOString().split('T')[0] : '',
    progress: phase?.progress || 0,
    status: phase?.status || 'not_started' as Phase['status']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        project_id: projectId,
        name: formData.name,
        description: formData.description,
        start_date: new Date(formData.start_date).toISOString(),
        due_date: new Date(formData.due_date).toISOString(),
        progress: formData.progress,
        status: formData.status
      });
      onClose();
    } catch (error) {
      console.error('Error saving phase:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create Phase' : 'Edit Phase'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
              Start Date
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
              Due Date
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
            Progress
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
            className="mt-1 block w-full"
          />
          <div className="mt-1 text-sm text-text-light-secondary dark:text-text-dark-secondary text-right">
            {formData.progress}%
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Phase['status'] }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="delayed">Delayed</option>
          </select>
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
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Phase' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};