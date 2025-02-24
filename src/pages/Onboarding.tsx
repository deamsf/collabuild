import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CheckCircle2, ArrowRight, Building2, Users, FileText, Calendar } from 'lucide-react';

export const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.user_metadata?.role || 'homeowner';

  const homeownerSteps = [
    {
      title: 'Welcome to Kompanjon',
      description: 'Your construction project management hub',
      icon: <Building2 className="w-12 h-12 text-secondary" />,
      content: (
        <div className="space-y-4">
          <p>
            Welcome to Kompanjon! We're here to help you manage your construction project
            efficiently and effectively. As a homeowner, you'll have access to powerful
            tools to track progress, communicate with your team, and stay on top of your project.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Users className="w-8 h-8 text-secondary mb-2" />
              <h3 className="font-medium">Team Management</h3>
              <p className="text-sm text-gray-600">Coordinate with architects and contractors</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-8 h-8 text-secondary mb-2" />
              <h3 className="font-medium">Project Timeline</h3>
              <p className="text-sm text-gray-600">Track progress and milestones</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Create Your First Project',
      description: 'Set up your construction project',
      icon: <FileText className="w-12 h-12 text-secondary" />,
      content: (
        <div className="space-y-4">
          <p>
            Ready to get started? Create your first project by providing basic details
            like the project name, address, and description. You can then invite your
            architect and contractors to collaborate.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Quick Tip</h3>
            <p className="text-sm text-gray-600">
              Having your project details and team members' contact information ready
              will help you set up your project quickly.
            </p>
          </div>
        </div>
      )
    }
  ];

  const professionalSteps = [
    {
      title: 'Welcome to Kompanjon',
      description: `Get started as a ${role}`,
      icon: <Building2 className="w-12 h-12 text-secondary" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md">
            <p>
              Thank you for signing up! Your account is pending project assignment.
              You'll be notified when a homeowner adds you to their project.
            </p>
          </div>
          <p>
            As a {role}, you'll have access to specialized tools and features
            designed to help you manage your part of the construction project
            efficiently.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Users className="w-8 h-8 text-secondary mb-2" />
              <h3 className="font-medium">Team Collaboration</h3>
              <p className="text-sm text-gray-600">Work seamlessly with project stakeholders</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-8 h-8 text-secondary mb-2" />
              <h3 className="font-medium">Task Management</h3>
              <p className="text-sm text-gray-600">Track and update project progress</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const steps = role === 'homeowner' ? homeownerSteps : professionalSteps;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 w-4 rounded-full ${
                      index <= currentStep ? 'bg-secondary' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center gap-4 mb-6">
            {steps[currentStep].icon}
            <div>
              <h2 className="text-2xl font-bold text-primary">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600">{steps[currentStep].description}</p>
            </div>
          </div>

          <div className="mb-8">
            {steps[currentStep].content}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};