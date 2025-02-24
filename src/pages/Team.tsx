import React, { useState, useEffect } from 'react';
import { UserPlus, Tag, GitBranch, X } from 'lucide-react';
import { useProjectContext } from '../context/ProjectContext';
import { useTeamMembers } from '../hooks/useTeamMembers';
import type { TeamMember } from '../types';

export const Team = () => {
  const { currentProject } = useProjectContext();
  const { teamMembers, addMember, updateMember, removeMember, loading, error } = useTeamMembers(currentProject?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: 'contractor' as const,
    phases: [] as string[],
    tags: [] as string[]
  });

  if (!currentProject) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Please select a project to view team members.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Loading team members...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-red-600">Error loading team members: {error}</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingMember) {
        await updateMember({
          ...editingMember,
          ...formData
        });
      } else {
        await addMember({
          ...formData,
          project_id: currentProject.id
        });
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleDelete = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      try {
        await removeMember(memberId);
      } catch (error) {
        console.error('Error removing team member:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      role: 'contractor',
      phases: [],
      tags: []
    });
    setEditingMember(null);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      company: member.company,
      role: member.role,
      phases: member.phases,
      tags: member.tags
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Team</h1>
        <button 
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90"
        >
          <UserPlus size={20} />
          <span>Add Team Member</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Project Partners</h2>
          <div className="space-y-6">
            {teamMembers.map(member => (
              <div key={member.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{member.name}</h3>
                  <p className="text-gray-600">{member.email}</p>
                  <p className="text-gray-500 text-sm">{member.company}</p>
                  <span className="inline-block px-3 py-1 mt-2 bg-secondary/10 text-secondary rounded-full text-sm capitalize">
                    {member.role}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag size={16} className="text-secondary" />
                      <span className="text-sm font-medium">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {member.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-accent-green/20 text-primary rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <GitBranch size={16} className="text-secondary" />
                      <span className="text-sm font-medium">Phases</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {member.phases.map((phase, index) => (
                        <span key={index} className="px-2 py-1 bg-secondary/10 text-secondary rounded text-sm">
                          {phase}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(member)}
                      className="text-secondary hover:text-secondary/80"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="text-accent-red hover:text-accent-red/80"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as TeamMember['role'] }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20"
                >
                  <option value="contractor">Contractor</option>
                  <option value="architect">Architect</option>
                  <option value="landlord">Landlord</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phases (comma-separated)</label>
                <input
                  type="text"
                  value={formData.phases.join(', ')}
                  onChange={(e) => setFormData(prev => ({ ...prev, phases: e.target.value.split(',').map(p => p.trim()) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20"
                  placeholder="Foundations, Structure, Roof"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20"
                  placeholder="Design, Planning, Management"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90"
                >
                  {editingMember ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};