import React from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { Building2, Users } from 'lucide-react';

export const Projects = () => {
  const { projects, setCurrentProject } = useProjectContext();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{project.name}</h2>
                <p className="text-gray-600">{project.address}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm
                ${project.status === 'active' ? 'bg-accent-green/20 text-primary' :
                  project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 size={20} />
                <span>Construction Project</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={20} />
                <span>3 Team Members</span>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentProject(project)}
              className="mt-6 w-full px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Switch to Project
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};