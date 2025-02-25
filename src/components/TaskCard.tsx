import React from 'react';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
}

export const TaskCard = ({ task, onEdit, onDelete, isDragging }: TaskCardProps) => {
  const isUrgent = task.due_date && 
    new Date(task.due_date).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div 
      className={`
        p-4 bg-background-light dark:bg-background-dark rounded-lg shadow-sm
        ${isUrgent ? 'border-3 border-accent-red' : 'border-2 border-transparent hover:border-secondary/20'}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        cursor-pointer group transition-all
      `}
      onClick={() => onEdit(task)}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
          {task.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-text-light-secondary hover:text-accent-red transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      {task.description && (
        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 text-sm">
        {task.due_date && (
          <div className={`flex items-center gap-1 ${
            isUrgent ? 'text-accent-red' : 'text-text-light-secondary dark:text-text-dark-secondary'
          }`}>
            <Calendar size={14} />
            <span>{new Date(task.due_date).toLocaleDateString()}</span>
          </div>
        )}

        {task.completion_date && (
          <div className="flex items-center gap-1 text-accent-green">
            <Clock size={14} />
            <span>Completed {new Date(task.completion_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};