import React, { useState } from 'react';
import { ListTodo, Plus, Calendar, Pencil, Trash2 } from 'lucide-react';
import { Phase } from '../../types';

interface PlanningViewProps {
  phases: Phase[];
  onCreatePhase: () => void;
  onEditPhase: (phase: Phase) => void;
  onDeletePhase: (phase: Phase) => void;
}

export const PlanningView: React.FC<PlanningViewProps> = ({
  phases,
  onCreatePhase,
  onEditPhase,
  onDeletePhase
}) => {
  const [phaseView, setPhaseView] = useState<'list' | 'gantt'>('list');

  return (
    <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">
              Project Phases
            </h2>
            <div className="flex items-center gap-2 border-l border-gray-300 dark:border-gray-600 pl-4">
              <button
                onClick={() => setPhaseView('list')}
                className={`p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark ${
                  phaseView === 'list' 
                    ? 'text-secondary' 
                    : 'text-text-light-secondary dark:text-text-dark-secondary'
                }`}
                title="List View"
              >
                <ListTodo size={20} />
              </button>
              <button
                onClick={() => setPhaseView('gantt')}
                className={`p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark ${
                  phaseView === 'gantt'
                    ? 'text-secondary'
                    : 'text-text-light-secondary dark:text-text-dark-secondary'
                }`}
                title="Gantt Chart"
              >
                <Calendar size={20} />
              </button>
            </div>
          </div>
          <button
            onClick={onCreatePhase}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
          >
            <Plus size={20} />
            <span>Add Phase</span>
          </button>
        </div>

        {phaseView === 'list' ? (
          <div className="space-y-4">
            {phases.length === 0 ? (
              <div className="text-center py-8 text-text-light-secondary dark:text-text-dark-secondary">
                No phases defined yet. Add your first project phase to get started.
              </div>
            ) : (
              phases.map(phase => (
                <div
                  key={phase.id}
                  className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-text-light-primary dark:text-text-dark-primary">
                        {phase.name}
                      </h3>
                      <div className="flex gap-4 text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">
                        <span>
                          {new Date(phase.start_date).toLocaleDateString()} - {new Date(phase.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditPhase(phase)}
                        className="p-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-secondary rounded-lg hover:bg-background-light dark:hover:bg-background-dark"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => onDeletePhase(phase)}
                        className="p-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-accent-red rounded-lg hover:bg-background-light dark:hover:bg-background-dark"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-light-primary dark:text-text-dark-primary">Progress</span>
                      <span className="text-text-light-secondary dark:text-text-dark-secondary">{phase.progress}%</span>
                    </div>
                    <div className="h-2 bg-background-light dark:bg-background-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full transition-all"
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="mt-8 p-6 bg-surface-light dark:bg-surface-dark rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={24} className="text-secondary" />
              <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">
                Gantt Chart
              </h2>
            </div>
            <div className="p-8 text-center text-text-light-secondary dark:text-text-dark-secondary">
              <p className="text-lg mb-2">Gantt Chart View Coming Soon</p>
              <p>A visual timeline of your project phases will be available here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};