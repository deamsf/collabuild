import React from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { useTasks } from '../hooks/useTasks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Clock, Upload, AlertCircle } from 'lucide-react';

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

const taskDistribution = [
  { name: 'To Do', value: 15, color: '#ff3f4c' },
  { name: 'In Progress', value: 8, color: '#1ca5b8' },
  { name: 'Done', value: 22, color: '#daefb2' },
];

export const Dashboard = () => {
  const { currentProject } = useProjectContext();
  const { tasks, loading, error } = useTasks(currentProject?.id);

  if (!currentProject) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Please select a project to view the dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-red-600">Error loading dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90">
            <Clock size={20} />
            <span>Time Tracking</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90">
            <Upload size={20} />
            <span>Quick Upload</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
          <h2 className="text-xl font-semibold mb-4">Project Progress</h2>
          <BarChart width={600} height={300} data={projectProgress}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" fill="#1ca5b8" />
          </BarChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Task Distribution</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={taskDistribution}
              cx={150}
              cy={150}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {taskDistribution.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <LineChart width={500} height={300} data={recentActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="documents" stroke="#012c3f" />
            <Line type="monotone" dataKey="photos" stroke="#1ca5b8" />
            <Line type="monotone" dataKey="tasks" stroke="#21c3d8" />
          </LineChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Alerts & Notifications</h2>
          <div className="space-y-4">
            {tasks.filter(task => task.status === 'to-do').slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <AlertCircle className="text-accent-red shrink-0" />
                <div>
                  <h3 className="font-medium">Task Deadline Approaching</h3>
                  <p className="text-sm text-gray-600">
                    "{task.title}" is due {task.due_date ? `on ${new Date(task.due_date).toLocaleDateString()}` : 'soon'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};