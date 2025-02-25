import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface ResourceShare {
  id: string;
  name: string;
  project_id: string;
  expires_at: string;
  created_at: string;
  created_by: string;
  resources: string[];
  recipients: string[];
}

export function useResourceShares(projectId: string | undefined) {
  const [shares, setShares] = useState<ResourceShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchShares();
    }
  }, [projectId]);

  async function fetchShares() {
    try {
      setLoading(true);
      const { data: sharesData, error: sharesError } = await supabase
        .from('resource_shares')
        .select(`
          *,
          shared_resources (resource_id),
          share_recipients (email)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (sharesError) throw sharesError;

      setShares(sharesData?.map(share => ({
        ...share,
        resources: share.shared_resources.map(sr => sr.resource_id),
        recipients: share.share_recipients.map(r => r.email)
      })) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function createShare(
    name: string,
    resourceIds: string[],
    password: string,
    recipients: string[],
    expiresInDays: number = 7
  ) {
    try {
      // Create share
      const { data: share, error: shareError } = await supabase
        .from('resource_shares')
        .insert([{
          name,
          project_id: projectId,
          password_hash: password, // In production, hash the password
          expires_at: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        }])
        .select()
        .single();

      if (shareError) throw shareError;

      // Add resources to share
      const { error: resourcesError } = await supabase
        .from('shared_resources')
        .insert(resourceIds.map(resourceId => ({
          share_id: share.id,
          resource_id: resourceId
        })));

      if (resourcesError) throw resourcesError;

      // Add recipients
      const { error: recipientsError } = await supabase
        .from('share_recipients')
        .insert(recipients.map(email => ({
          share_id: share.id,
          email
        })));

      if (recipientsError) throw recipientsError;

      await fetchShares();
      return share.id;
    } catch (err) {
      throw err;
    }
  }

  async function deleteShare(shareId: string) {
    try {
      const { error } = await supabase
        .from('resource_shares')
        .delete()
        .eq('id', shareId);

      if (error) throw error;
      await fetchShares();
    } catch (err) {
      throw err;
    }
  }

  async function addResourcesToShare(shareId: string, resourceIds: string[]) {
    try {
      const { error } = await supabase
        .from('shared_resources')
        .insert(resourceIds.map(resourceId => ({
          share_id: shareId,
          resource_id: resourceId
        })));

      if (error) throw error;
      await fetchShares();
    } catch (err) {
      throw err;
    }
  }

  async function removeResourceFromShare(shareId: string, resourceId: string) {
    try {
      const { error } = await supabase
        .from('shared_resources')
        .delete()
        .eq('share_id', shareId)
        .eq('resource_id', resourceId);

      if (error) throw error;
      await fetchShares();
    } catch (err) {
      throw err;
    }
  }

  return {
    shares,
    loading,
    error,
    createShare,
    deleteShare,
    addResourcesToShare,
    removeResourceFromShare,
    refetch: fetchShares
  };
}