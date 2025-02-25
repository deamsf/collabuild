import React, { useState } from 'react';
import { ListTodo, Calendar, ClipboardList } from 'lucide-react';
import { useProjectContext } from '../context/ProjectContext';
import { useTasks } from '../hooks/useTasks';
import { usePhases } from '../hooks/usePhases';
import { TaskModal } from '../components/TaskModal';
import { PhaseModal } from '../components/PhaseModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { AgendaView } from '../components/tasks/AgendaView';
import { PlanningView } from '../components/tasks/PlanningView';
import { Task, TaskStatus, Phase } from '../types';

type TaskView = 'tasks' | 'agenda' | 'planning';

export const Tasks = () => {
  const { currentProject } = useProjectContext();
  const { tasks, addTask, updateTask, updateTaskStatus, removeTask } = useTasks(currentProject?.id);
  const { phases, addPhase, updatePhase, removePhase } = usePhases(currentProject?.id);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [isDeletePhaseModalOpen, setIsDeletePhaseModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [phaseToDelete, setPhaseToDelete] = useState<Phase | null>(null);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [editingPhase, setEditingPhase] = useState<Phase | undefined>();
  const [currentView, setCurrentView] = useState<TaskView>('tasks');

  if (!currentProject) {
    return (
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          Please select a project to view tasks.
        </p>
      </div>
    );
  }

  const handleTaskSubmit = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completion_date'>) => {
    if (editingTask) {
      await updateTask({ ...taskData, id: editingTask.id });
    } else {
      await addTask(taskData);
    }
    setIsTaskModalOpen(false);
    setEditingTask(undefined);
  };

  const handlePhaseSubmit = async (phaseData: Omit<Phase, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingPhase) {
      await updatePhase({ ...phaseData, id: editingPhase.id });
    } else {
      await addPhase(phaseData);
    }
    setIsPhaseModalOpen(false);
    setEditingPhase(undefined);
  };

  const handleTaskDelete = async () => {
    if (taskToDelete) {
      await removeTask(taskToDelete.id);
      setIsDeleteTaskModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const handlePhaseDelete = async () => {
    if (phaseToDelete) {
      await removePhase(phaseToDelete.id);
      setIsDeletePhaseModalOpen(false);
      setPhaseToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">
        Tasks
      </h1>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          <button
            onClick={() => setCurrentView('tasks')}
            className={`px-4 py-2 border-b-2 ${
              currentView === 'tasks'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary'
            }`}
          >
            <div className="flex items-center gap-2">
              <ListTodo size={20} />
              <span>Tasks</span>
            </div>
          </button>
          <button
            onClick={() => setCurrentView('agenda')}
            className={`px-4 py-2 border-b-2 ${
              currentView === 'agenda'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>Agenda</span>
            </div>
          </button>
          <button
            onClick={() => setCurrentView('planning')}
            className={`px-4 py-2 border-b-2 ${
              currentView === 'planning'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary'
            }`}
          >
            <div className="flex items-center gap-2">
              <ClipboardList size={20} />
              <span>Planning</span>
            </div>
          </button>
        </nav>
      </div>

      {currentView === 'tasks' && (
        <KanbanBoard
          tasks={tasks}
          onUpdateStatus={updateTaskStatus}
          onEditTask={(task) => {
            setEditingTask(task);
            setIsTaskModalOpen(true);
          }}
          onDeleteTask={(taskId) => {
            const taskToDelete = tasks.find(t => t.id === taskId);
            if (taskToDelete) {
              setTaskToDelete(taskToDelete);
              setIsDeleteTaskModalOpen(true);
            }
          }}
          onCreateTask={() => {
            setEditingTask(undefined);
            setIsTaskModalOpen(true);
          }}
        />
      )}

      {currentView === 'agenda' && <AgendaView />}

      {currentView === 'planning' && (
        <PlanningView
          phases={phases}
          onCreatePhase={() => {
            setEditingPhase(undefined);
            setIsPhaseModalOpen(true);
          }}
          onEditPhase={(phase) => {
            setEditingPhase(phase);
            setIsPhaseModalOpen(true);
          }}
          onDeletePhase={(phase) => {
            setPhaseToDelete(phase);
            setIsDeletePhaseModalOpen(true);
          }}
        />
      )}

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(undefined);
        }}
        onSubmit={handleTaskSubmit}
        projectId={currentProject?.id || ''}
        task={editingTask}
        mode={editingTask ? 'edit' : 'create'}
      />

      <PhaseModal
        isOpen={isPhaseModalOpen}
        onClose={() => {
          setIsPhaseModalOpen(false);
          setEditingPhase(undefined);
        }}
        onSubmit={handlePhaseSubmit}
        projectId={currentProject?.id || ''}
        phase={editingPhase}
        mode={editingPhase ? 'edit' : 'create'}
      />

      <ConfirmationModal
        isOpen={isDeleteTaskModalOpen}
        onClose={() => {
          setIsDeleteTaskModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleTaskDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Task"
      />

      <ConfirmationModal
        isOpen={isDeletePhaseModalOpen}
        onClose={() => {
          setIsDeletePhaseModalOpen(false);
          setPhaseToDelete(null);
        }}
        onConfirm={handlePhaseDelete}
        title="Delete Phase"
        message={`Are you sure you want to delete "${phaseToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Phase"
      />
    </div>
  );
};