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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function uploadResource(file: File, type: 'document' | 'photo', tags: string[] = []) {
    try {
      if (!projectId) throw new Error('No project selected');

      // Upload file to storage
      const bucket = type === 'document' ? 'documents' : 'photos';
      const path = `${projectId}/${Date.now()}_${file.name}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(path, file);

      if (uploadError) throw uploadError;

      // Create resource record
      const { error: dbError } = await supabase
        .from('resources')
        .insert([{
          project_id: projectId,
          type,
          name: file.name,
          storage_path: path,
          size: file.size,
          mime_type: file.type,
          tags
        }]);

      if (dbError) throw dbError;

      await fetchResources();
    } catch (err) {
      throw err;
    }
  }

  async function deleteResource(resourceId: string) {
    try {
      const { data: resource } = await supabase
        .from('resources')
        .select('storage_path, type')
        .eq('id', resourceId)
        .single();

      if (!resource) throw new Error('Resource not found');

      // Delete from storage
      const bucket = resource.type === 'document' ? 'documents' : 'photos';
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove([resource.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (dbError) throw dbError;

      await fetchResources();
    } catch (err) {
      throw err;
    }
  }

  async function updateResourceTags(resourceId: string, tags: string[]) {
    try {
      const { error } = await supabase
        .from('resources')
        .update({ tags })
        .eq('id', resourceId);

      if (error) throw error;
      await fetchResources();
    } catch (err) {
      throw err;
    }
  }

  return {
    resources,
    loading,
    error,
    uploadResource,
    deleteResource,
    updateResourceTags,
    refetch: fetchResources
  };
}