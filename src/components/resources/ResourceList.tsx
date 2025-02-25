import React from 'react';
import { File, Image, Tag, Trash2, Share2 } from 'lucide-react';
import type { Resource } from '../../types';

interface ResourceListProps {
  resources: Resource[];
  type: 'documents' | 'photos';
  selectedResources: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const ResourceList: React.FC<ResourceListProps> = ({
  resources,
  type,
  selectedResources,
  onSelectionChange
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredResources.map(resource => (
        <div
          key={resource.id}
          className={`bg-surface-light dark:bg-surface-dark p-4 rounded-lg border-2 transition-colors ${
            selectedResources.includes(resource.id)
              ? 'border-secondary'
              : 'border-transparent hover:border-secondary/20'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {type === 'documents' ? (
                <File size={24} className="text-secondary" />
              ) : (
                <Image size={24} className="text-secondary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-text-light-primary dark:text-text-dark-primary truncate">
                {resource.name}
              </h3>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                {resource.size}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary rounded text-sm">
                  <Tag size={14} />
                  {type === 'documents' ? 'Permit' : 'Site Photo'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
                className="p-1.5 text-text-light-secondary dark:text-text-dark-secondary hover:text-accent-red rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};