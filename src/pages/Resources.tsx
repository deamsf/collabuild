import React from 'react';
import { File, Image, DollarSign, Share2 } from 'lucide-react';
import { useProjectContext } from '../context/ProjectContext';
import { useResources } from '../hooks/useResources';

export const Resources = () => {
  const { currentProject } = useProjectContext();
  const { resources, loading, error } = useResources(currentProject?.id);

  if (!currentProject) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Please select a project to view resources.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-red-600">Error loading resources: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Resources</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90">
          <Share2 size={20} />
          <span>Manage Shares</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <File size={24} className="text-secondary" />
            <h2 className="text-xl font-semibold">Documents</h2>
          </div>
          <div className="space-y-3">
            {resources
              .filter(r => r.type === 'document')
              .map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{doc.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{doc.size}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Image size={24} className="text-secondary" />
            <h2 className="text-xl font-semibold">Photos</h2>
          </div>
          <div className="space-y-3">
            {resources
              .filter(r => r.type === 'photo')
              .map((photo) => (
                <div key={photo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{photo.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(photo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{photo.size}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={24} className="text-secondary" />
            <h2 className="text-xl font-semibold">Financial</h2>
          </div>
          <div className="space-y-3">
            {resources
              .filter(r => r.type === 'financial')
              .map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{doc.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{doc.size}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Upload Resources</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-600">
            Drag and drop files here, or click to select files
          </p>
          <button className="mt-4 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90">
            Select Files
          </button>
        </div>
      </div>
    </div>
  );
};