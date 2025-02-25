import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useResources } from '../../hooks/useResources';

interface ResourceUploaderProps {
  projectId: string;
  type: 'documents' | 'photos';
}

export const ResourceUploader: React.FC<ResourceUploaderProps> = ({ projectId, type }) => {
  const { uploadResource } = useResources(projectId);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setError(null);

    try {
      await Promise.all(
        acceptedFiles.map(file => 
          uploadResource(file, type === 'documents' ? 'document' : 'photo')
        )
      );
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [projectId, type, uploadResource]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: type === 'photos' 
      ? { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }
      : { 'application/*': ['.pdf', '.doc', '.docx', '.xls', '.xlsx'] },
    multiple: true
  });

  return (
    <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
      {error && (
        <div className="mb-4 p-4 bg-accent-red/10 text-accent-red rounded-lg">
          {error}
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center transition-colors
          ${isDragActive ? 'border-secondary bg-secondary/5' : 'hover:border-secondary hover:bg-surface-light dark:hover:bg-surface-dark'}`}
      >
        <input {...getInputProps()} />
        <Upload 
          size={32} 
          className={`mx-auto mb-4 ${isDragActive ? 'text-secondary' : 'text-text-light-secondary dark:text-text-dark-secondary'}`} 
        />
        <p className="text-text-light-secondary dark:text-text-dark-secondary mb-2">
          {isDragActive
            ? `Drop your ${type} here...`
            : `Drag and drop ${type} here, or click to select files`}
        </p>
        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
          {type === 'photos' 
            ? 'Supported formats: PNG, JPG, GIF'
            : 'Supported formats: PDF, DOC, DOCX, XLS, XLSX'}
        </p>
        {uploading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary mx-auto"></div>
            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-2">
              Uploading...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};