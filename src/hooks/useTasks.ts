import { useState } from 'react';
import type { Task, TaskStatus } from '../types';

// In-memory storage for tasks
let tasks: Task[] = [];

export function useTasks(projectId: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completion_date'>) {
    try {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completion_date: null,
        ...task
      };
      tasks = [...tasks, newTask];
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }

  async function updateTask(task: Partial<Task> & { id: string }) {
    try {
      tasks = tasks.map(t => t.id === task.id ? {
        ...t,
        ...task,
        updated_at: new Date().toISOString()
      } : t);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }

  async function updateTaskStatus(taskId: string, status: TaskStatus) {
    try {
      tasks = tasks.map(t => t.id === taskId ? {
        ...t,
        status,
        updated_at: new Date().toISOString(),
        completion_date: status === 'done' ? new Date().toISOString() : null
      } : t);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }

  async function removeTask(taskId: string) {
    try {
      tasks = tasks.filter(t => t.id !== taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }

  return {
    tasks: tasks.filter(t => t.project_id === projectId),
    loading,
    error,
    addTask,
    updateTask,
    updateTaskStatus,
    removeTask
  };
}