import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ListTodo, Plus, ChevronUp } from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from '../TaskCard';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'to_do', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'waiting', title: 'Waiting' },
  { id: 'done', title: 'Done' },
  { id: 'canceled', title: 'Canceled' }
];

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onCreateTask: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onUpdateStatus,
  onEditTask,
  onDeleteTask,
  onCreateTask
}) => {
  const [showCanceled, setShowCanceled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async (result: DropResult) => {
    setIsDragging(false);
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    await onUpdateStatus(draggableId, destination.droppableId as TaskStatus);
  };

  return (
    <>
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ListTodo size={24} className="text-secondary" />
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">
              Kanban Board
            </h2>
          </div>
          <button
            onClick={onCreateTask}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
          >
            <Plus size={20} />
            <span>New Task</span>
          </button>
        </div>

        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {COLUMNS.map(column => {
              if (column.id === 'canceled' && !showCanceled) return null;

              return (
                <div key={column.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-text-light-secondary dark:text-text-dark-secondary flex items-center gap-2">
                      {column.id === 'canceled' && (
                        <button
                          onClick={() => setShowCanceled(!showCanceled)}
                          className="p-1 hover:bg-surface-light dark:hover:bg-surface-dark rounded"
                          aria-label={showCanceled ? "Hide canceled tasks" : "Show canceled tasks"}
                        >
                          <ChevronUp
                            size={16}
                            className={`transition-transform ${showCanceled ? '' : 'rotate-180'}`}
                          />
                        </button>
                      )}
                      <span>{column.title}</span>
                    </h3>
                    <span className="text-sm bg-surface-light dark:bg-surface-dark px-2 py-1 rounded">
                      {tasks.filter(t => t.status === column.id).length}
                    </span>
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] p-4 rounded-lg transition-colors
                          ${snapshot.isDraggingOver
                            ? 'bg-secondary/5'
                            : 'bg-surface-light dark:bg-surface-dark'
                          }`}
                      >
                        {tasks
                          .filter(t => t.status === column.id)
                          .map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-3 last:mb-0"
                                >
                                  <TaskCard
                                    task={task}
                                    onEdit={onEditTask}
                                    onDelete={onDeleteTask}
                                    isDragging={snapshot.isDragging}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4 text-text-light-primary dark:text-text-dark-primary">
          Not Yet Tasks
        </h2>
        <div className="space-y-4">
          {tasks
            .filter(task => task.status === 'not_yet')
            .map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-text-light-primary dark:text-text-dark-primary">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdateStatus(task.id, 'to_do')}
                    className="px-3 py-1 text-sm bg-secondary text-white rounded hover:bg-secondary-dark"
                  >
                    Move to To Do
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="px-3 py-1 text-sm text-accent-red hover:bg-accent-red/10 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          {tasks.filter(task => task.status === 'not_yet').length === 0 && (
            <p className="text-center text-text-light-secondary dark:text-text-dark-secondary py-4">
              No tasks in backlog
            </p>
          )}
        </div>
      </div>
    </>
  );
};