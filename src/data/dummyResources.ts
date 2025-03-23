import { Resource } from '../types';

export const dummyResources: Resource[] = [
  {
    id: '1',
    project_id: '1',
    type: 'document',
    name: 'Building Permit.pdf',
    size: '2.4 MB',
    mime_type: 'application/pdf',
    storage_path: '/documents/permit.pdf',
    tags: ['permit', 'official', 'approved'],
    created_at: '2025-02-15T10:30:00Z'
  },
  {
    id: '2',
    project_id: '1',
    type: 'photo',
    name: 'Site Survey Photo.jpg',
    size: '5.1 MB',
    mime_type: 'image/jpeg',
    storage_path: '/photos/survey.jpg',
    tags: ['survey', 'site-photos'],
    created_at: '2025-02-16T14:20:00Z'
  },
  {
    id: '3',
    project_id: '1',
    type: 'document',
    name: 'Architectural Plans.pdf',
    size: '8.7 MB',
    mime_type: 'application/pdf',
    storage_path: '/documents/plans.pdf',
    tags: ['plans', 'architecture'],
    created_at: '2025-02-17T09:15:00Z'
  },
  {
    id: '4',
    project_id: '1',
    type: 'photo',
    name: 'Foundation Progress.jpg',
    size: '3.2 MB',
    mime_type: 'image/jpeg',
    storage_path: '/photos/foundation.jpg',
    tags: ['progress', 'foundation'],
    created_at: '2025-02-18T16:45:00Z'
  },
  {
    id: '5',
    project_id: '1',
    type: 'document',
    name: 'Contract Agreement.pdf',
    size: '1.1 MB',
    mime_type: 'application/pdf',
    storage_path: '/documents/contract.pdf',
    tags: ['legal', 'contract'],
    created_at: '2025-02-19T11:30:00Z'
  }
];