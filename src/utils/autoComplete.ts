import { ChecklistItem } from '../types';

export const autoCompleteChecklist = (checklist: ChecklistItem[]): ChecklistItem[] => {
  return checklist.map(item => {
    if (item.autoCompleted && !item.completed) {
      // Auto-complete after random delay (1-5 minutes simulation)
      const delay = Math.random() * 4 + 1; // 1-5 minutes
      
      setTimeout(() => {
        item.completed = true;
        item.completedAt = new Date().toISOString();
        item.completedBy = 'System Auto-Complete';
      }, delay * 60 * 1000);
    }
    return item;
  });
};

export const triggerAutoComplete = (jobId: string) => {
  // Simulate auto-completion of checklist items
  const autoCompleteTasks = [
    'Verify property access',
    'Document property condition', 
    'Remove all items urgently',
    'Secure property',
    'Deep clean property',
    'Get client/council sign-off'
  ];
  
  autoCompleteTasks.forEach((task, index) => {
    setTimeout(() => {
      console.log(`Auto-completed: ${task} for job ${jobId}`);
      // In real app, this would update the job's checklist in the database
    }, (index + 1) * 30000); // Complete every 30 seconds
  });
};