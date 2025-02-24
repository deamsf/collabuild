import React from 'react';
import { useProjectContext } from '../context/ProjectContext';

export const ProjectSettings = () => {
  const { currentProject } = useProjectContext();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Project Settings</h1>
      {currentProject ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Project Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Name</label>
              <p className="mt-1">{currentProject.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1">{currentProject.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <p className="mt-1">{currentProject.description || 'No description provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <p className="mt-1 capitalize">{currentProject.status.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">Please select a project to view its settings.</p>
        </div>
      )}
    </div>
  );
};