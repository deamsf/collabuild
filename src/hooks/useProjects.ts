import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Project } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');

      if (error) throw error;

      if (data) {
        setProjects(data);
        if (!currentProject && data.length > 0) {
          setCurrentProject(data[0]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return {
    projects,
    currentProject,
    setCurrentProject,
    loading,
    error,
    refetch: fetchProjects
  };
}