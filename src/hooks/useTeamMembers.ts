import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { TeamMember } from '../types';

export function useTeamMembers(projectId: string | undefined) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchTeamMembers();
    } else {
      setTeamMembers([]);
      setLoading(false);
    }
  }, [projectId]);

  async function fetchTeamMembers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('project_id', projectId)
        .order('name');

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addMember(member: Omit<TeamMember, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([member])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setTeamMembers(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding team member:', err);
      throw err;
    }
  }

  async function updateMember(member: TeamMember) {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({
          name: member.name,
          email: member.email,
          company: member.company,
          role: member.role,
          phases: member.phases,
          tags: member.tags
        })
        .eq('id', member.id);
      
      if (error) throw error;
      
      // Update local state
      setTeamMembers(prev => prev.map(m => m.id === member.id ? member : m));
    } catch (err) {
      console.error('Error updating team member:', err);
      throw err;
    }
  }

  async function removeMember(memberId: string) {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);
      
      if (error) throw error;
      
      // Update local state
      setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    } catch (err) {
      console.error('Error removing team member:', err);
      throw err;
    }
  }

  return {
    teamMembers,
    loading,
    error,
    addMember,
    updateMember,
    removeMember,
    refetch: fetchTeamMembers
  };
}