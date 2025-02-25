import React, { useState } from 'react';
import { UserPlus, Tag, GitBranch, Pencil, Trash2 } from 'lucide-react';
import { useProjectContext } from '../context/ProjectContext';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { Modal } from '../components/Modal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import type { TeamMember } from '../types';

export const Team = () => {
  const { currentProject } = useProjectContext();
  const { teamMembers, addMember, updateMember, removeMember, loading, error } = useTeamMembers(currentProject?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
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
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <p className="text-text-light-secondary dark:text-text-dark-secondary">Please select a project to view team members.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <p className="text-text-light-secondary dark:text-text-dark-secondary">Loading team members...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <p className="text-accent-red">Error loading team members: {error}</p>
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

  const handleDelete = async () => {
    if (memberToDelete) {
      try {
        await removeMember(memberToDelete.id);
        setIsDeleteModalOpen(false);
        setMemberToDelete(null);
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

  const openDeleteModal = (member: TeamMember) => {
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">Team</h1>
        <button 
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
        >
          <UserPlus size={20} />
          <span>Add Team Member</span>
        </button>
      </div>

      <div className="bg-background-light dark:bg-background-dark rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-text-light-primary dark:text-text-dark-primary">Project Partners</h2>
          <div className="space-y-6">
            {teamMembers.map(member => (
              <div key={member.id} className="bg-surface-light dark:bg-surface-dark rounded-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Member Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary">
                          {member.name}
                        </h3>
                        <p className="text-text-light-secondary dark:text-text-dark-secondary">{member.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEditModal(member)}
                          className="p-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-secondary transition-colors rounded-lg hover:bg-background-light dark:hover:bg-background-dark"
                        >
                          <Pencil size={20} />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(member)}
                          className="p-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-accent-red transition-colors rounded-lg hover:bg-background-light dark:hover:bg-background-dark"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary">{member.company}</p>
                    <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm capitalize">
                      {member.role}
                    </span>
                  </div>

                  {/* Tags & Phases */}
                  <div className="flex flex-col sm:flex-row gap-6 lg:w-2/3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag size={16} className="text-secondary" />
                        <h4 className="font-medium text-text-light-primary dark:text-text-dark-primary">Tags</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {member.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-accent-green/10 text-text-light-primary dark:text-text-dark-primary rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <GitBranch size={16} className="text-secondary" />
                        <h4 className="font-medium text-text-light-primary dark:text-text-dark-primary">Phases</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {member.phases.map((phase, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                          >
                            {phase}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as TeamMember['role'] }))}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
            >
              <option value="contractor">Contractor</option>
              <option value="architect">Architect</option>
              <option value="landlord">Landlord</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
              Phases (comma-separated)
            </label>
            <input
              type="text"
              value={formData.phases.join(', ')}
              onChange={(e) => setFormData(prev => ({ ...prev, phases: e.target.value.split(',').map(p => p.trim()) }))}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
              placeholder="Foundations, Structure, Roof"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()) }))}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
              placeholder="Design, Planning, Management"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
            >
              {editingMember ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMemberToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Confirm Removal"
        message={`Are you sure you want to remove ${memberToDelete?.name} from the team?`}
        confirmLabel="Remove Member"
      />
    </div>
  );
};