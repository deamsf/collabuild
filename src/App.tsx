import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Resources } from './pages/Resources';
import { Team } from './pages/Team';
import { Templates } from './pages/Templates';
import { Advice } from './pages/Advice';
import { Profile } from './pages/Profile';
import { Projects } from './pages/Projects';
import { ProjectSettings } from './pages/ProjectSettings';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Onboarding } from './pages/Onboarding';

function App() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = React.useState(false);

  return (
    <ThemeProvider>
      <ProjectProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route
              path="/*"
              element={
                <div className="min-h-screen bg-surface-light dark:bg-surface-dark transition-colors duration-200">
                  <Navbar isCollapsed={isNavbarCollapsed} onToggleCollapse={setIsNavbarCollapsed} />
                  <main className={`transition-all duration-300 ${isNavbarCollapsed ? 'ml-20' : 'ml-64'} p-8`}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/resources" element={<Resources />} />
                      <Route path="/team" element={<Team />} />
                      <Route path="/templates" element={<Templates />} />
                      <Route path="/advice" element={<Advice />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/project-settings" element={<ProjectSettings />} />
                    </Routes>
                  </main>
                </div>
              }
            />
          </Routes>
        </Router>
      </ProjectProvider>
    </ThemeProvider>
  );
}

export default App;