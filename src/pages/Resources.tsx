import React, { useState, useMemo } from 'react';
import { File, Image, Upload, Share2, Grid, List as ListIcon, Filter, SortDesc, Download, Trash2 } from 'lucide-react';
import { useProjectContext } from '../context/ProjectContext';
import { ResourceUploader } from '../components/resources/ResourceUploader';
import { ResourceList } from '../components/resources/ResourceList';
import { ResourceGrid } from '../components/resources/ResourceGrid';
import { ShareModal } from '../components/resources/ShareModal';
import { SharesManager } from '../components/resources/SharesManager';
import { dummyResources } from '../data/dummyResources';

type ResourceView = 'documents' | 'photos';
type ViewMode = 'list' | 'grid';
type SortField = 'name' | 'size' | 'created_at';
type SortOrder = 'asc' | 'desc';

export const Resources = () => {
  const { currentProject } = useProjectContext();
  const [currentView, setCurrentView] = useState<ResourceView>('documents');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSharesManagerOpen, setIsSharesManagerOpen] = useState(false);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Get unique tags from all resources
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    dummyResources.forEach(resource => {
      resource.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  // Filter and sort resources
  const filteredAndSortedResources = useMemo(() => {
    return dummyResources
      .filter(resource => {
        const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.every(tag => resource.tags?.includes(tag));
        return matchesSearch && matchesTags;
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          return sortOrder === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortField === 'size') {
          const sizeA = parseInt(a.size);
          const sizeB = parseInt(b.size);
          return sortOrder === 'asc' ? sizeA - sizeB : sizeB - sizeA;
        }
        return sortOrder === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [dummyResources, searchTerm, selectedTags, sortField, sortOrder]);

  const handleDownload = (resource: Resource) => {
    console.log('Downloading resource:', resource.name);
  };

  const handleDelete = (resourceId: string) => {
    console.log('Deleting resource:', resourceId);
  };

  const handleBulkDelete = () => {
    console.log('Bulk deleting resources:', selectedResources);
    setSelectedResources([]);
  };

  if (!currentProject) {
    return (
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          Please select a project to view resources.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">
          Resources
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsSharesManagerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-text-light-primary dark:text-text-dark-primary hover:bg-surface-light dark:hover:bg-surface-dark rounded-lg"
          >
            <Share2 size={20} />
            <span>Manage Shares</span>
          </button>
          {selectedResources.length > 0 && (
            <>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
              >
                <Share2 size={20} />
                <span>Share Selected ({selectedResources.length})</span>
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-accent-red text-white rounded-lg hover:bg-accent-red-dark"
              >
                <Trash2 size={20} />
                <span>Delete Selected</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md space-y-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search and View Toggle */}
          <div className="flex-1 flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="flex gap-2 border-l border-gray-300 dark:border-gray-600 pl-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-secondary text-white'
                    : 'text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-secondary text-white'
                    : 'text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark'
                }`}
              >
                <ListIcon size={20} />
              </button>
            </div>
          </div>

          {/* Filter and Sort */}
          <div className="flex gap-4">
            <div className="relative">
              <button
                onClick={() => {}}
                className="px-4 py-2 flex items-center gap-2 bg-surface-light dark:bg-surface-dark rounded-lg"
              >
                <Filter size={20} />
                <span>Filter</span>
              </button>
              {/* Filter dropdown would go here */}
            </div>
            <div className="relative">
              <button
                onClick={() => {}}
                className="px-4 py-2 flex items-center gap-2 bg-surface-light dark:bg-surface-dark rounded-lg"
              >
                <SortDesc size={20} />
                <span>Sort</span>
              </button>
              {/* Sort dropdown would go here */}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => {
                if (selectedTags.includes(tag)) {
                  setSelectedTags(selectedTags.filter(t => t !== tag));
                } else {
                  setSelectedTags([...selectedTags, tag]);
                }
              }}
              className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                selectedTags.includes(tag)
                  ? 'bg-secondary text-white'
                  : 'bg-surface-light dark:bg-surface-dark text-text-light-secondary dark:text-text-dark-secondary'
              }`}
            >
              <Tag size={14} />
              {tag}
            </button>
          ))}
        </div>

        {/* View Toggle */}
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

        {/* Resource Display */}
        {viewMode === 'grid' ? (
          <ResourceGrid
            resources={filteredAndSortedResources}
            type={currentView}
            selectedResources={selectedResources}
            onSelectionChange={setSelectedResources}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
        ) : (
          <ResourceList
            resources={filteredAndSortedResources}
            type={currentView}
            selectedResources={selectedResources}
            onSelectionChange={setSelectedResources}
          />
        )}
      </div>

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