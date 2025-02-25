import React from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { useTasks } from '../hooks/useTasks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Clock, Upload, AlertTriangle, ListTodo } from 'lucide-react';

const projectProgress = [
  { name: 'Foundations', completed: 100 },
  { name: 'Basement', completed: 85 },
  { name: 'Structure', completed: 60 },
  { name: 'Roof', completed: 30 },
  { name: 'Installations', completed: 10 },
  { name: 'Finishing', completed: 0 },
];

const recentActivity = [
  { time: '1d', documents: 4, photos: 8, tasks: 12 },
  { time: '2d', documents: 3, photos: 5, tasks: 8 },
  { time: '3d', documents: 6, photos: 3, tasks: 15 },
  { time: '4d', documents: 2, photos: 7, tasks: 10 },
  { time: '5d', documents: 5, photos: 4, tasks: 9 },
];

export const Dashboard = () => {
  const { currentProject } = useProjectContext();
  const { tasks, loading, error } = useTasks(currentProject?.id);

  if (!currentProject) {
    return (
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <p className="text-text-light-secondary dark:text-text-dark-secondary">Please select a project to view the dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <p className="text-text-light-secondary dark:text-text-dark-secondary">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <p className="text-accent-red">Error loading dashboard: {error}</p>
      </div>
    );
  }

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'to-do').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'done').length,
    urgent: tasks.filter(t => 
      t.status !== 'done' && 
      t.due_date && 
      new Date(t.due_date).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000
    ).length
  };

  // Create task distribution data for the pie chart
  const taskDistributionData = [
    { name: 'To Do', value: taskStats.todo, color: 'var(--accent-red-light)' },
    { name: 'In Progress', value: taskStats.inProgress, color: 'var(--secondary-light)' },
    { name: 'Done', value: taskStats.completed, color: 'var(--accent-green-light)' }
  ];

  // Get upcoming tasks
  const upcomingTasks = tasks
    .filter(task => task.status === 'to-do' && task.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">Dashboard</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark">
            <Upload size={20} />
            <span>Quick Upload</span>
          </button>
        </div>
      </div>

      {/* Task Overview and Upcoming Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Overview */}
        <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <ListTodo size={24} className="text-secondary" />
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">Task Overview</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
              <p className="text-2xl font-bold text-secondary">
                {taskStats.todo}
              </p>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">To Do</p>
            </div>
            <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
              <p className="text-2xl font-bold text-secondary">
                {taskStats.inProgress}
              </p>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">In Progress</p>
            </div>
            <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
              <p className="text-2xl font-bold text-accent-green">
                {taskStats.completed}
              </p>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Completed</p>
            </div>
            <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
              <p className="text-2xl font-bold text-accent-red">
                {taskStats.urgent}
              </p>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Urgent</p>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={24} className="text-secondary" />
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">Upcoming Tasks</h2>
          </div>
          <div className="space-y-4">
            {upcomingTasks.map(task => (
              <div key={task.id} className="flex items-start gap-3 p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
                <AlertTriangle 
                  size={20} 
                  className={`shrink-0 ${
                    new Date(task.due_date!).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000
                      ? 'text-accent-red'
                      : 'text-secondary'
                  }`}
                />
                <div>
                  <h3 className="font-medium text-text-light-primary dark:text-text-dark-primary">{task.title}</h3>
                  <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    Due: {new Date(task.due_date!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <p className="text-text-light-secondary dark:text-text-dark-secondary text-center py-4">
                No upcoming tasks
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Project Progress and Task Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-text-light-primary dark:text-text-dark-primary">Project Progress</h2>
          <BarChart width={600} height={300} data={projectProgress}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              stroke="currentColor" 
              className="text-text-light-primary dark:text-text-dark-primary"
            />
            <YAxis 
              stroke="currentColor"
              className="text-text-light-primary dark:text-text-dark-primary"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--background-light)',
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              labelStyle={{
                color: 'var(--text-primary-light)'
              }}
            />
            <Legend />
            <Bar dataKey="completed" fill="var(--secondary-light)" />
          </BarChart>
        </div>

        <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-text-light-primary dark:text-text-dark-primary">Task Distribution</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={taskDistributionData}
              cx={150}
              cy={150}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {taskDistributionData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--background-light)',
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              labelStyle={{
                color: 'var(--text-primary-light)'
              }}
            />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-text-light-primary dark:text-text-dark-primary">Recent Activity</h2>
        <LineChart width={800} height={300} data={recentActivity}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          <XAxis 
            dataKey="time" 
            stroke="currentColor"
            className="text-text-light-primary dark:text-text-dark-primary"
          />
          <YAxis 
            stroke="currentColor"
            className="text-text-light-primary dark:text-text-dark-primary"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--background-light)',
              border: 'none',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            labelStyle={{
              color: 'var(--text-primary-light)'
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="documents" stroke="var(--primary-light)" />
          <Line type="monotone" dataKey="photos" stroke="var(--secondary-light)" />
          <Line type="monotone" dataKey="tasks" stroke="var(--secondary-dark)" />
        </LineChart>
      </div>
    </div>
  );
};