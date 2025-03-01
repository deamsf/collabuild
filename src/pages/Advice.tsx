import React from 'react';
import { HelpCircle, MessageSquare } from 'lucide-react';

const faqs = [
  {
    question: 'What documents do I need before starting construction?',
    answer: 'Before starting construction, you typically need: building permits, architectural plans, structural calculations, and contractor agreements. Make sure to check local regulations for specific requirements.',
  },
  {
    question: 'How do I track project expenses effectively?',
    answer: 'Use the Resources section to upload and categorize all financial documents. Create separate categories for materials, labor, and permits. Regular updates help maintain accurate cost tracking.',
  },
  {
    question: 'What should I do if there are construction delays?',
    answer: 'Document the cause of delays, update the project timeline in the Tasks section, and communicate with all stakeholders using email templates. Consider adding buffer time to future phase estimates.',
  },
];

export const Advice = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">Advice</h1>

      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle size={24} className="text-secondary" />
          <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
              <h3 className="font-medium text-lg text-text-light-primary dark:text-text-dark-primary mb-2">{faq.question}</h3>
              <p className="text-text-light-secondary dark:text-text-dark-secondary">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare size={24} className="text-secondary" />
          <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">AI Construction Assistant</h2>
        </div>
        
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg text-center">
          <h3 className="text-lg font-medium text-text-light-primary dark:text-text-dark-primary mb-2">Coming Soon</h3>
          <p className="text-text-light-secondary dark:text-text-dark-secondary mb-4">
            Our AI assistant will help you with construction advice, best practices, and regulatory compliance.
          </p>
          <button className="px-4 py-2 bg-surface-light dark:bg-surface-dark text-text-light-secondary dark:text-text-dark-secondary rounded-lg" disabled>
            Join Waitlist
          </button>
        </div>
      </div>
    </div>
  );
};