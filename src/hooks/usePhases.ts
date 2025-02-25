import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Phase } from '../types';

export function usePhases(projectId: string | undefined) {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchPhases();
    }
  }, [projectId]);

  async function fetchPhases() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('phases')
        .select('*')
        .eq('project_id', projectId)
        .order('start_date');

      if (error) throw error;
      setPhases(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function addPhase(phase: Omit<Phase, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { error } = await supabase
        .from('phases')
        .insert([phase]);
      
      if (error) throw error;
      await fetchPhases();
    } catch (err) {
      throw err;
    }
  }

  async function updatePhase(phase: Phase) {
    try {
      const { error } = await supabase
        .from('phases')
        .update({
          name: phase.name,
          description: phase.description,
          start_date: phase.start_date,
          due_date: phase.due_date,
          progress: phase.progress,
          status: phase.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', phase.id);
      
      if (error) throw error;
      await fetchPhases();
    } catch (err) {
      throw err;
    }
  }

  async function removePhase(phaseId: string) {
    try {
      const { error } = await supabase
        .from('phases')
        .delete()
        .eq('id', phaseId);
      
      if (error) throw error;
      await fetchPhases();
    } catch (err) {
      throw err;
    }
  }

  return {
    phases,
    loading,
    error,
    addPhase,
    updatePhase,
    removePhase,
    refetch: fetchPhases
  };
}