import { ChecklistItem, ServiceType } from '../types';

export const getChecklistForServiceType = (serviceType: ServiceType): ChecklistItem[] => {
  const baseChecklist: ChecklistItem[] = [
    { id: 'c1', task: 'Verify property access', completed: false, order: 1, autoCompleted: true },
    { id: 'c3', task: 'Document property condition', completed: false, order: 3, autoCompleted: true },
  ];

  const serviceSpecificTasks: Record<ServiceType, ChecklistItem[]> = {
    'emergency-clearance': [
      { id: 'c4', task: 'Remove all items urgently', completed: false, order: 4, autoCompleted: true },
      { id: 'c5', task: 'Secure property', completed: false, order: 5, autoCompleted: true },
      { id: 'c6', task: 'Deep clean property', completed: false, order: 6, autoCompleted: true },
    ],
    'void-turnover': [
      { id: 'c4', task: 'Remove tenant belongings', completed: false, order: 4 },
      { id: 'c5', task: 'Clean all rooms', completed: false, order: 5 },
      { id: 'c6', task: 'Check for damages', completed: false, order: 6 },
    ],
    'hoarder-clearout': [
      { id: 'c4', task: 'Assess hoarding level', completed: false, order: 4 },
      { id: 'c5', task: 'Systematic clearance by room', completed: false, order: 5 },
      { id: 'c6', task: 'Deep clean and sanitize', completed: false, order: 6 },
      { id: 'c7', task: 'Pest control check', completed: false, order: 7 },
    ],
    'fire-flood-moveout': [
      { id: 'c4', task: 'Document damage for insurance', completed: false, requiresPhoto: true, order: 4 },
      { id: 'c5', task: 'Salvage undamaged items', completed: false, order: 5 },
      { id: 'c6', task: 'Remove damaged items', completed: false, order: 6 },
    ],
    'probate-clearance': [
      { id: 'c4', task: 'Catalog valuable items', completed: false, order: 4 },
      { id: 'c5', task: 'Pack and remove items', completed: false, order: 5 },
      { id: 'c6', task: 'Clean property', completed: false, order: 6 },
    ],
    'furniture-removal': [
      { id: 'c4', task: 'Identify items for removal', completed: false, order: 4 },
      { id: 'c5', task: 'Safely remove furniture', completed: false, order: 5 },
    ],
    'lock-change': [
      { id: 'c4', task: 'Remove old locks', completed: false, order: 4 },
      { id: 'c5', task: 'Install new locks', completed: false, order: 5 },
      { id: 'c6', task: 'Test all locks', completed: false, order: 6 },
    ],
    'minor-repairs': [
      { id: 'c4', task: 'Assess repair requirements', completed: false, order: 4 },
      { id: 'c5', task: 'Complete repairs', completed: false, order: 5 },
      { id: 'c6', task: 'Test repairs', completed: false, order: 6 },
    ],
  };

  const endChecklist: ChecklistItem[] = [
    { id: 'c9', task: 'Get client/council sign-off', completed: false, order: 99, autoCompleted: true },
  ];

  return [...baseChecklist, ...(serviceSpecificTasks[serviceType] || []), ...endChecklist];
};

export const autoCompleteChecklistItem = (
  checklist: ChecklistItem[],
  taskName: string,
  completedBy: string
): ChecklistItem[] => {
  return checklist.map(item => {
    if (item.task.toLowerCase().includes(taskName.toLowerCase()) && item.autoCompleted) {
      return {
        ...item,
        completed: true,
        completedAt: new Date().toISOString(),
        completedBy,
      };
    }
    return item;
  });
};

export const canCompleteChecklistItem = (
  checklist: ChecklistItem[],
  itemId: string
): { allowed: boolean; reason?: string } => {
  const item = checklist.find(i => i.id === itemId);
  if (!item) return { allowed: false, reason: 'Item not found' };

  const previousItems = checklist.filter(i => i.order < item.order);
  const incompletePrevious = previousItems.filter(i => !i.completed);

  if (incompletePrevious.length > 0) {
    return {
      allowed: false,
      reason: `Complete previous tasks first: ${incompletePrevious[0].task}`,
    };
  }

  return { allowed: true };
};

export const getChecklistProgress = (checklist: ChecklistItem[]): {
  completed: number;
  total: number;
  percentage: number;
} => {
  const completed = checklist.filter(i => i.completed).length;
  const total = checklist.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
};
