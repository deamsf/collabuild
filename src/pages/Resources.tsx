import React, { useState } from 'react';
import { File, Image, Upload, Share2 } from 'lucide-react';
import { useProjectContext } from '../context/ProjectContext';
import { useResources } from '../hooks/useResources';
import { ResourceUploader } from '../components/resources/ResourceUploader';
import { ResourceList } from '../components/resources/ResourceList';
import { ShareModal } from '../components/resources/ShareModal';
import { SharesManager } from '../components/resources/SharesManager';

type ResourceView = 'documents' | 'photos';

export const Resources = () => {
  const { currentProject } = useProjectContext();
  const { resources, loading, error } = useResources(currentProject?.id);
  const [currentView, setCurrentView] = useState<ResourceView>('documents');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSharesManagerOpen, setIsSharesManagerOpen] = useState(false);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);

  if (!currentProject) {
    return (
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <p className="text-text-light-secondary dark:text-text-dark-secondary">Please select a project to view resources.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <p className="text-text-light-secondary dark:text-text-dark-secondary">Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <p className="text-accent-red">Error loading resources: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">Resources</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsSharesManagerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-text-light-primary dark:text-text-dark-primary hover:bg-surface-light dark:hover:bg-surface-dark rounded-lg"
          >
            <Share2 size={20} />
            <span>Manage Shares</span>
          </button>
          {selectedResources.length > 0 && (
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
            >
              <Share2 size={20} />
              <span>Share Selected ({selectedResources.length})</span>
            </button>
          )}
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          <button
            onClick={() => setCurrentView('documents')}
            className={`px-4 py-2 border-b-2 ${
              currentView === 'documents'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary'
            }`}
          >
            <div className="flex items-center gap-2">
              <File size={20} />
              <span>Documents</span>
            </div>
          </button>
          <button
            onClick={() => setCurrentView('photos')}
            className={`px-4 py-2 border-b-2 ${
              currentView === 'photos'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary'
            }`}
          >
            <div className="flex items-center gap-2">
              <Image size={20} />
              <span>Photos</span>
            </div>
          </button>
        </nav>
      </div>

      <ResourceList
        resources={resources}
        type={currentView}
        selectedResources={selectedResources}
        onSelectionChange={setSelectedResources}
      />

      <ResourceUploader
        projectId={currentProject.id}
        type={currentView}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        resourceIds={selectedResources}
        projectId={currentProject.id}
      />

      <SharesManager
        isOpen={isSharesManagerOpen}
        onClose={() => setIsSharesManagerOpen(false)}
        projectId={currentProject.id}
      />
    </div>
  );
};