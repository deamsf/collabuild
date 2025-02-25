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

  async function addTemplate(template: Omit<EmailTemplate, 'id' | 'created_at' | 'last_modified'>) {
    try {
      const { error } = await supabase
        .from('email_templates')
        .insert([{
          ...template,
          last_modified: new Date().toISOString()
        }]);
      
      if (error) throw error;
      await fetchTemplates();
    } catch (err) {
      throw err;
    }
  }

  async function updateTemplate(template: EmailTemplate) {
    try {
      const { error } = await supabase
        .from('email_templates')
        .update({
          name: template.name,
          subject: template.subject,
          description: template.description,
          last_modified: new Date().toISOString()
        })
        .eq('id', template.id);
      
      if (error) throw error;
      await fetchTemplates();
    } catch (err) {
      throw err;
    }
  }

  async function removeTemplate(templateId: string) {
    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', templateId);
      
      if (error) throw error;
      await fetchTemplates();
    } catch (err) {
      throw err;
    }
  }

  return {
    templates,
    loading,
    error,
    addTemplate,
    updateTemplate,
    removeTemplate,
    refetch: fetchTemplates
  };
}