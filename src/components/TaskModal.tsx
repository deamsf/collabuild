import React, { useState } from 'react';
import { Modal } from './Modal';
import { useAuth } from '../hooks/useAuth';
import { Task } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completion_date'>) => Promise<void>;
  projectId: string;
  task?: Task;
  mode: 'create' | 'edit';
}

export const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  task,
  mode
}: TaskModalProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    due_date: task?.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
    status: task?.status || 'not_yet'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        project_id: projectId,
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        status: formData.status as Task['status'],
        author_id: task?.author_id || user?.id || null,
        assignee_id: null // Always set to null since we're not using assignees
      });
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create Task' : 'Edit Task'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
            rows={4}
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
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
          >
            <option value="not_yet">Not Yet</option>
            <option value="to_do">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="waiting">Waiting</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
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
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};