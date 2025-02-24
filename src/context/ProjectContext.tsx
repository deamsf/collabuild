import React, { createContext, useContext } from 'react';
import { useProjects } from '../hooks/useProjects';
import type { Project } from '../types';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project) => void;
  loading: boolean;
  error: string | null;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { projects, currentProject, setCurrentProject, loading, error } = useProjects();

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      setCurrentProject,
      loading,
      error
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
}