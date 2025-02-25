import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  FolderOpen, 
  Users, 
  FileText, 
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  SwitchCamera
} from 'lucide-react';
import { useProjectContext } from '../context/ProjectContext';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export const Navbar = ({ isCollapsed, onToggleCollapse }: NavbarProps) => {
  const location = useLocation();
  const { currentProject, projects, setCurrentProject } = useProjectContext();
  const { user } = useAuth();
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`h-screen bg-primary text-white flex flex-col fixed left-0 top-0 transition-all duration-300
      ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-6 flex items-center justify-between">
        <h1 className={`text-3xl font-bold text-secondary whitespace-nowrap transition-opacity duration-300
          ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
          Collabuild
        </h1>
        <button 
          onClick={() => onToggleCollapse(!isCollapsed)}
          className="text-secondary hover:text-secondary-dark p-1 z-10"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {currentProject && (
        <div className={`px-6 py-4 border-y border-secondary/20 relative ${isCollapsed ? 'text-center' : ''}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold truncate transition-opacity duration-300
              ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
              {currentProject.name}
            </h2>
            {!isCollapsed && (
              <div className="flex items-center gap-1">
                <Link 
                  to="/project-settings" 
                  className="p-1.5 text-secondary hover:text-secondary-dark"
                >
                  <Settings size={20} />
                </Link>
                <button
                  onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                  className="p-1.5 text-secondary hover:text-secondary-dark"
                >
                  <SwitchCamera size={20} />
                </button>
              </div>
            )}
          </div>
          <p className={`text-sm text-gray-400 truncate transition-opacity duration-300
            ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            {currentProject.address}
          </p>
          {isCollapsed ? (
            <div className="mt-2">
              <button
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                className="w-full flex items-center justify-center p-2 bg-secondary/10 rounded-lg text-secondary hover:bg-secondary/20 transition-colors"
              >
                <SwitchCamera size={20} />
              </button>
            </div>
          ) : null}
          {showProjectDropdown && (
            <div 
              className={`absolute z-50 bg-white rounded-lg shadow-lg overflow-y-auto max-h-[calc(100vh-200px)]
                ${isCollapsed 
                  ? 'left-full top-0 ml-2 w-56' 
                  : 'left-0 right-0 top-full mt-2'
                }`}
            >
              {projects.map(project => (
                <button
                  key={project.id}
                  onClick={() => {
                    setCurrentProject(project);
                    setShowProjectDropdown(false);
                  }}
                  className={`w-full p-2.5 text-left hover:bg-secondary/10 transition-colors
                    ${project.id === currentProject.id ? 'bg-secondary/10 text-secondary' : 'text-gray-700'}`}
                >
                  <div className="font-medium text-sm">{project.name}</div>
                  <div className="text-xs text-gray-500 truncate">{project.address}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex-1 py-6 flex flex-col">
        <div className="flex-1">
          <NavLink to="/dashboard" icon={<Home size={20} />} active={isActive('/dashboard')} collapsed={isCollapsed}>
            Dashboard
          </NavLink>
          <NavLink to="/tasks" icon={<Calendar size={20} />} active={isActive('/tasks')} collapsed={isCollapsed}>
            Tasks & Planning
          </NavLink>
          <NavLink to="/resources" icon={<FolderOpen size={20} />} active={isActive('/resources')} collapsed={isCollapsed}>
            Resources
          </NavLink>
          <NavLink to="/team" icon={<Users size={20} />} active={isActive('/team')} collapsed={isCollapsed}>
            Team
          </NavLink>
          <NavLink to="/templates" icon={<FileText size={20} />} active={isActive('/templates')} collapsed={isCollapsed}>
            Templates
          </NavLink>
          <NavLink to="/advice" icon={<HelpCircle size={20} />} active={isActive('/advice')} collapsed={isCollapsed}>
            Advice
          </NavLink>
        </div>

        <Link
          to="/profile"
          className={`flex items-center gap-3 px-6 py-3 mt-auto transition-colors
            ${location.pathname === '/profile'
              ? 'bg-secondary text-white' 
              : 'text-gray-300 hover:bg-secondary/10 hover:text-white'
            } ${isCollapsed ? 'justify-center' : ''}`}
        >
          <UserCircle size={20} />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">My Profile</span>
              <span className="text-xs text-gray-400">{user?.email}</span>
            </div>
          )}
        </Link>
      </div>
    </nav>
  );
};

const NavLink = ({ 
  to, 
  icon, 
  children, 
  active,
  collapsed
}: { 
  to: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
  active: boolean;
  collapsed: boolean;
}) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-6 py-3 transition-colors
      ${active 
        ? 'bg-secondary text-white' 
        : 'text-gray-300 hover:bg-secondary/10 hover:text-white'
      } ${collapsed ? 'justify-center' : ''}`}
  >
    {icon}
    <span className={`transition-opacity duration-300 ${collapsed ? 'hidden' : 'block'}`}>
      {children}
    </span>
  </Link>
);