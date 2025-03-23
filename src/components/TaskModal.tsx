import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useAuth } from '../hooks/useAuth';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { Task } from '../types';
import { User } from 'lucide-react';

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
  const { teamMembers, loading: loadingTeamMembers } = useTeamMembers(projectId);
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    due_date: task?.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
    status: task?.status || 'not_yet',
    assignee_id: task?.assignee_id || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
        status: task.status || 'not_yet',
        assignee_id: task.assignee_id || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        due_date: '',
        status: 'not_yet',
        assignee_id: ''
      });
    }
  }, [task]);

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
        assignee_id: formData.assignee_id || null
      });
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find the assigned team member if there's an assignee_id
  const assignedMember = teamMembers.find(member => member.id === formData.assignee_id);

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div>
          <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-1">
            Assignee
          </label>
          
          {loadingTeamMembers ? (
            <div className="flex items-center space-x-2 text-text-light-secondary dark:text-text-dark-secondary">
              <div className="animate-spin h-4 w-4 border-2 border-secondary rounded-full border-t-transparent"></div>
              <span>Loading team members...</span>
            </div>
          ) : teamMembers.length === 0 ? (
            <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
              No team members available. Add team members in the Team section.
            </p>
          ) : (
            <div className="mt-1 space-y-2">
              <div className="flex items-center p-2 bg-surface-light dark:bg-surface-dark rounded-md">
                <input
                  type="radio"
                  id="no-assignee"
                  name="assignee"
                  checked={!formData.assignee_id}
                  onChange={() => setFormData(prev => ({ ...prev, assignee_id: '' }))}
                  className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300"
                />
                <label htmlFor="no-assignee" className="ml-2 block text-text-light-secondary dark:text-text-dark-secondary">
                  No assignee
                </label>
              </div>
              
              {teamMembers.map(member => (
                <div 
                  key={member.id}
                  className={`flex items-center p-2 rounded-md ${
                    formData.assignee_id === member.id 
                      ? 'bg-secondary/10' 
                      : 'bg-surface-light dark:bg-surface-dark'
                  }`}
                >
                  <input
                    type="radio"
                    id={`assignee-${member.id}`}
                    name="assignee"
                    value={member.id}
                    checked={formData.assignee_id === member.id}
                    onChange={() => setFormData(prev => ({ ...prev, assignee_id: member.id }))}
                    className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300"
                  />
                  <label htmlFor={`assignee-${member.id}`} className="ml-2 flex-1">
                    <div className="font-medium text-text-light-primary dark:text-text-dark-primary">
                      {member.name}
                    </div>
                    <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      {member.role} • {member.company}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}
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