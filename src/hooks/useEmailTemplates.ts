import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { EmailTemplate } from '../types';

export function useEmailTemplates(projectId: string | undefined) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchTemplates();
    }
  }, [projectId]);

  async function fetchTemplates() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('project_id', projectId)
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return { templates, loading, error, refetch: fetchTemplates };
}