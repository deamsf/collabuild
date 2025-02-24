import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Resource } from '../types';

export function useResources(projectId: string | undefined) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchResources();
    }
  }, [projectId]);

  async function fetchResources() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at');

      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return { resources, loading, error, refetch: fetchResources };
}