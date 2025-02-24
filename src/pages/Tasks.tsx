import React from 'react';
import { Calendar, ListTodo, GitBranch } from 'lucide-react';
import { useProjectContext } from '../context/ProjectContext';
import { useTasks } from '../hooks/useTasks';

export const Tasks = () => {
  const { currentProject } = useProjectContext();
  const { tasks, loading, error } = useTasks(currentProject?.id);

  if (!currentProject) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Please select a project to view tasks.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-red-600">Error loading tasks: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Tasks & Planning</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={24} className="text-secondary" />
            <h2 className="text-xl font-semibold">Agenda</h2>
          </div>
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.phase}</p>
                </div>
                <span className="text-sm text-gray-500">
                  Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date set'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <ListTodo size={24} className="text-secondary" />
            <h2 className="text-xl font-semibold">Kanban Board</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-600">To Do</h3>
              {tasks.filter(t => t.status === 'to-do').map(task => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-500">{task.phase}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-600">In Progress</h3>
              {tasks.filter(t => t.status === 'in-progress').map(task => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-500">{task.phase}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-600">Done</h3>
              {tasks.filter(t => t.status === 'done').map(task => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-500">{task.phase}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <GitBranch size={24} className="text-secondary" />
          <h2 className="text-xl font-semibold">Project Phases</h2>
        </div>
        <div className="space-y-4">
          {Array.from(new Set(tasks.map(t => t.phase))).map((phase, index, array) => {
            const phaseProgress = Math.round(
              (tasks.filter(t => t.phase === phase && t.status === 'done').length / 
              tasks.filter(t => t.phase === phase).length) * 100
            );
            
            return (
              <div key={phase} className="relative">
                <div className="flex items-center gap-4">
                  <div className="w-32 shrink-0">
                    <h3 className="font-medium">{phase}</h3>
                  </div>
                  <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary transition-all duration-500"
                      style={{ width: `${phaseProgress}%` }}
                    />
                  </div>
                  <span className="w-16 text-right">{phaseProgress}%</span>
                </div>
                {index < array.length - 1 && (
                  <div className="absolute left-16 top-8 bottom-0 w-px bg-gray-200" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};