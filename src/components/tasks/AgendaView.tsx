import React from 'react';
import { Calendar } from 'lucide-react';

export const AgendaView: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
      <div className="text-center py-12">
        <Calendar size={48} className="mx-auto text-secondary mb-4" />
        <h2 className="text-2xl font-semibold text-text-light-primary dark:text-text-dark-primary mb-2">
          Agenda View Coming Soon
        </h2>
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          A better way to view and manage your tasks is on the way.
        </p>
      </div>
    </div>
  );
};