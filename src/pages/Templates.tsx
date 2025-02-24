import React from 'react';
import { Mail, Plus, Edit2, Trash2 } from 'lucide-react';
import { useProjectContext } from '../context/ProjectContext';
import { useEmailTemplates } from '../hooks/useEmailTemplates';

export const Templates = () => {
  const { currentProject } = useProjectContext();
  const { templates, loading, error } = useEmailTemplates(currentProject?.id);

  if (!currentProject) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Please select a project to view templates.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-red-600">Error loading templates: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Templates</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90">
          <Plus size={20} />
          <span>New Template</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Mail size={24} className="text-secondary" />
            <h2 className="text-xl font-semibold">Email Templates</h2>
          </div>

          <div className="space-y-4">
            {templates.map(template => (
              <div key={template.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{template.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">Subject: {template.subject}</p>
                    <p className="text-gray-500 text-sm mt-2">{template.description}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Last modified: {new Date(template.last_modified).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:text-secondary rounded-lg hover:bg-gray-100">
                      <Edit2 size={20} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-accent-red rounded-lg hover:bg-gray-100">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Template Variables</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <code className="text-secondary">[Project Name]</code>
            <p className="text-sm text-gray-600 mt-1">Current project name</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <code className="text-secondary">[Date]</code>
            <p className="text-sm text-gray-600 mt-1">Current date</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <code className="text-secondary">[Team Member]</code>
            <p className="text-sm text-gray-600 mt-1">Recipient's name</p>
          </div>
        </div>
      </div>
    </div>
  );
};