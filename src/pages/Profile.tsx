import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { LogOut, User, Bell, Moon, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

export const Profile = () => {
  const { user, loading, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    emailNotifications: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        company: user.user_metadata?.company || '',
        emailNotifications: user.user_metadata?.email_notifications ?? true
      });
    }
  }, [user]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          company: formData.company,
          email_notifications: formData.emailNotifications
        }
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">Profile Settings</h1>
      
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-accent-green/20 text-primary dark:text-accent-green' : 'bg-accent-red/20 text-accent-red'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">Personal Information</h2>
            </div>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-secondary hover:text-secondary-light"
              >
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 disabled:bg-surface-light dark:disabled:bg-surface-dark disabled:text-text-light-secondary dark:disabled:text-text-dark-secondary dark:bg-surface-dark dark:text-text-dark-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 disabled:bg-surface-light dark:disabled:bg-surface-dark disabled:text-text-light-secondary dark:disabled:text-text-dark-secondary dark:bg-surface-dark dark:text-text-dark-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-surface-light dark:bg-surface-dark text-text-light-secondary dark:text-text-dark-secondary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary/20 disabled:bg-surface-light dark:disabled:bg-surface-dark disabled:text-text-light-secondary dark:disabled:text-text-dark-secondary dark:bg-surface-dark dark:text-text-dark-primary"
              />
            </div>
          </div>
        </section>

        <section className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-secondary" />
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-text-light-primary dark:text-text-dark-primary">Email Notifications</h3>
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Receive updates about your projects</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emailNotifications}
                  onChange={(e) => setFormData(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-text-light-primary dark:text-text-dark-primary">Dark Mode</h3>
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Use dark theme</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>
          </div>
        </section>

        {isEditing && (
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-text-light-primary dark:text-text-dark-primary hover:text-text-light-secondary dark:hover:text-text-dark-secondary flex items-center gap-2"
              disabled={isSaving}
            >
              <X size={20} />
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark flex items-center gap-2 disabled:opacity-50"
              disabled={isSaving}
            >
              <Save size={20} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>

      <section className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-text-light-primary dark:text-text-dark-primary">Account Actions</h2>
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 text-accent-red hover:text-accent-red-dark hover:bg-accent-red/10 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </section>
    </div>
  );
};