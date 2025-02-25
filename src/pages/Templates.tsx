import React, { useState } from 'react';
import { Mail, Plus, Pencil, Trash2, Code } from 'lucide-react';
import { useProjectContext } from '../context/ProjectContext';
import { useEmailTemplates } from '../hooks/useEmailTemplates';
import { Modal } from '../components/Modal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { RichTextEditor } from '../components/RichTextEditor';
import type { EmailTemplate } from '../types';

export const Templates = () => {
  const { currentProject } = useProjectContext();
  const { templates, addTemplate, updateTemplate, removeTemplate, loading, error } = useEmailTemplates(currentProject?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<EmailTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showHtmlView, setShowHtmlView] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: ''
  });

  if (!currentProject) {
    return (
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <p className="text-text-light-secondary dark:text-text-dark-secondary">Please select a project to view templates.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <p className="text-text-light-secondary dark:text-text-dark-secondary">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <p className="text-accent-red">Error loading templates: {error}</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTemplate) {
        await updateTemplate({
          ...editingTemplate,
          ...formData
        });
      } else {
        await addTemplate({
          ...formData,
          project_id: currentProject.id
        });
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleDelete = async () => {
    if (templateToDelete) {
      try {
        await removeTemplate(templateToDelete.id);
        setIsDeleteModalOpen(false);
        setTemplateToDelete(null);
      } catch (error) {
        console.error('Error removing template:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      description: ''
    });
    setEditingTemplate(null);
    setShowHtmlView(false);
  };

  const openEditModal = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      description: template.description
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (template: EmailTemplate) => {
    setTemplateToDelete(template);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">Templates</h1>
        <button 
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
        >
          <Plus size={20} />
          <span>New Template</span>
        </button>
      </div>

      <div className="bg-background-light dark:bg-background-dark rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Mail size={24} className="text-secondary" />
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">Email Templates</h2>
          </div>

          <div className="space-y-4">
            {templates.map(template => (
              <div key={template.id} className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg text-text-light-primary dark:text-text-dark-primary">{template.name}</h3>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm mt-1">
                      Subject: {template.subject}
                    </p>
                    <div 
                      className="text-text-light-secondary dark:text-text-dark-secondary text-sm mt-2 line-clamp-3"
                      dangerouslySetInnerHTML={{ 
                        __html: template.description.substring(0, 200) + 
                          (template.description.length > 200 ? '...' : '') 
                      }}
                    />
                    <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm mt-2">
                      Last modified: {new Date(template.last_modified).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(template)}
                      className="p-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-secondary rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark"
                    >
                      <Pencil size={20} />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(template)}
                      className="p-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-accent-red rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark"
                    >
                      <Trash2 size={20} />
                    </button>
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
        title={editingTemplate ? 'Edit Template' : 'New Template'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">Template Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">Subject Line</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">Content</label>
              <button
                type="button"
                onClick={() => setShowHtmlView(!showHtmlView)}
                className="flex items-center gap-1 text-sm text-secondary hover:text-secondary-light"
              >
                <Code size={16} />
                {showHtmlView ? 'Visual Editor' : 'HTML View'}
              </button>
            </div>
            <RichTextEditor
              content={formData.description}
              onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
              showHtml={showHtmlView}
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
              {editingTemplate ? 'Save Changes' : 'Create Template'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTemplateToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the template "${templateToDelete?.name}"?`}
        confirmLabel="Delete Template"
      />

      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-text-light-primary dark:text-text-dark-primary">Template Variables</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-surface-light dark:bg-surface-dark rounded-lg">
            <code className="text-secondary">[Project Name]</code>
            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">Current project name</p>
          </div>
          <div className="p-3 bg-surface-light dark:bg-surface-dark rounded-lg">
            <code className="text-secondary">[Date]</code>
            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">Current date</p>
          </div>
          <div className="p-3 bg-surface-light dark:bg-surface-dark rounded-lg">
            <code className="text-secondary">[Team Member]</code>
            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">Recipient's name</p>
          </div>
        </div>
      </div>
    </div>
  );
};