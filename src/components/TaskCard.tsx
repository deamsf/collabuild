import React from 'react';
import { Calendar, Clock, Trash2, AlertCircle, User } from 'lucide-react';
import { Task } from '../types';
import { useTeamMembers } from '../hooks/useTeamMembers';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
}

export const TaskCard = ({ task, onEdit, onDelete, isDragging }: TaskCardProps) => {
  const { teamMembers } = useTeamMembers(task.project_id);
  const isUrgent = task.due_date && 
    new Date(task.due_date).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;

  const getStatusColor = () => {
    switch (task.status) {
      case 'canceled':
        return 'border-gray-400';
      case 'done':
        return 'border-accent-green';
      case 'waiting':
        return 'border-yellow-500';
      default:
        return isUrgent ? 'border-accent-red' : 'border-transparent hover:border-secondary/20';
    }
  };

  // Find the assigned team member if there's an assignee_id
  const assignee = task.assignee_id ? teamMembers.find(member => member.id === task.assignee_id) : null;

  return (
    <div 
      className={`
        p-4 bg-background-light dark:bg-background-dark rounded-lg shadow-sm
        border-2 ${getStatusColor()}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        cursor-pointer group transition-all
      `}
      onClick={() => onEdit(task)}
    >
      <div className="flex justify-between items-start">
        <h3 className={`font-medium text-text-light-primary dark:text-text-dark-primary mb-2 ${task.status === 'canceled' ? 'line-through text-text-light-secondary dark:text-text-dark-secondary' : ''}`}>
          {task.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-text-light-secondary hover:text-accent-red transition-all"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      {task.description && (
        <p className={`text-sm text-text-light-secondary dark:text-text-dark-secondary mb-3 line-clamp-2 ${task.status === 'canceled' ? 'line-through' : ''}`}>
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 text-sm">
        {assignee && (
          <div className="flex items-center gap-1 text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
            <User size={14} />
            <span>{assignee.name}</span>
          </div>
        )}

        {task.due_date && (
          <div className={`flex items-center gap-1 ${
            isUrgent && task.status !== 'done' && task.status !== 'canceled' 
              ? 'text-accent-red' 
              : 'text-text-light-secondary dark:text-text-dark-secondary'
          }`}>
            <Calendar size={14} />
            <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
          </div>
        )}

        {task.completion_date && (
          <div className="flex items-center gap-1 text-accent-green">
            <Clock size={14} />
            <span>Completed: {new Date(task.completion_date).toLocaleDateString()}</span>
          </div>
        )}

        {task.status === 'canceled' && (
          <div className="flex items-center gap-1 text-gray-500">
            <AlertCircle size={14} />
            <span>Canceled</span>
          </div>
        )}
      </div>
    </div>
  );
};