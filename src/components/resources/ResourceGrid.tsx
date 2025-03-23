import React from 'react';
import { File, Image, Tag, Trash2, Share2, Download } from 'lucide-react';
import type { Resource } from '../../types';

interface ResourceGridProps {
  resources: Resource[];
  type: 'documents' | 'photos';
  selectedResources: string[];
  onSelectionChange: (ids: string[]) => void;
  onDelete: (id: string) => void;
  onDownload: (resource: Resource) => void;
}

export const ResourceGrid: React.FC<ResourceGridProps> = ({
  resources,
  type,
  selectedResources,
  onSelectionChange,
  onDelete,
  onDownload
}) => {
  const filteredResources = resources.filter(r => 
    type === 'documents' ? r.type === 'document' : r.type === 'photo'
  );

  const handleSelect = (id: string) => {
    if (selectedResources.includes(id)) {
      onSelectionChange(selectedResources.filter(r => r !== id));
    } else {
      onSelectionChange([...selectedResources, id]);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredResources.map(resource => (
        <div
          key={resource.id}
          className={`bg-surface-light dark:bg-surface-dark p-4 rounded-lg border-2 transition-colors ${
            selectedResources.includes(resource.id)
              ? 'border-secondary'
              : 'border-transparent hover:border-secondary/20'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 bg-secondary/10 rounded-lg">
                {type === 'documents' ? (
                  <File size={32} className="text-secondary" />
                ) : (
                  <Image size={32} className="text-secondary" />
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSelect(resource.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    selectedResources.includes(resource.id)
                      ? 'bg-secondary text-white'
                      : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-secondary'
                  }`}
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(resource.id)}
                  className="p-1.5 text-text-light-secondary dark:text-text-dark-secondary hover:text-accent-red rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-text-light-primary dark:text-text-dark-primary truncate mb-1">
                {resource.name}
              </h3>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-3">
                {resource.size}
              </p>
              <div className="flex flex-wrap gap-2">
                {resource.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary rounded text-sm"
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onDownload(resource)}
              className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 bg-surface-light dark:bg-surface-dark text-text-light-secondary dark:text-text-dark-secondary rounded-lg hover:text-secondary"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};