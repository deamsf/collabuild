import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Task, TaskStatus } from '../types';

export function useTasks(projectId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  async function fetchTasks() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completion_date'>) {
    try {
      const taskData = {
        ...task,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) throw error;
      
      // Update local state with the new task
      setTasks(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error adding task:', err);
      throw err;
    }
  }

  async function updateTask(task: Partial<Task> & { id: string }) {
    try {
      const updateData = {
        ...task,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', task.id);

      if (error) throw error;
      
      // Update local state
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, ...updateData } : t));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating task:', err);
      throw err;
    }
  }

  async function updateTaskStatus(taskId: string, status: TaskStatus) {
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) throw new Error('Task not found');

      const updates: Partial<Task> = {
        status,
        updated_at: new Date().toISOString()
      };

      // If task is marked as done, set completion date
      if (status === 'done') {
        updates.completion_date = new Date().toISOString();
      } else if (taskToUpdate.completion_date) {
        // If task was previously done and now it's not, clear completion date
        updates.completion_date = null;
      }

      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;
      
      // Update local state
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating task status:', err);
      throw err;
    }
  }

  async function removeTask(taskId: string) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      
      // Update local state
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error removing task:', err);
      throw err;
    }
  }

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    updateTaskStatus,
    removeTask,
    refetch: fetchTasks
  };
}