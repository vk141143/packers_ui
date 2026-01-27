import { getStoredToken } from './authService';

export async function getCrewJobs() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch('/crew-api/crew/jobs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch jobs' }));
    throw new Error(error.message || 'Crew jobs fetch failed');
  }

  return await response.json();
}

export async function arriveAtJob(jobId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(`/crew-api/crew/jobs/${jobId}/arrive`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to mark arrival' }));
    throw new Error(error.message || 'Arrival update failed');
  }

  return await response.json();
}

export async function uploadBeforePhoto(jobId: string, photo: File) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const formData = new FormData();
  formData.append('photo', photo);
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/crew/jobs/${jobId}/upload-before-photo`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to upload photo' }));
    throw new Error(error.message || 'Before photo upload failed');
  }

  return await response.json();
}

export async function getJobChecklist(jobId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/crew/jobs/${jobId}/checklist`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch checklist' }));
    throw new Error(error.message || 'Checklist fetch failed');
  }

  return await response.json();
}

export async function updateJobChecklist(jobId: string, checklistData: any) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/crew/jobs/${jobId}/checklist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(checklistData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update checklist' }));
    throw new Error(error.message || 'Checklist update failed');
  }

  return await response.json();
}

export async function uploadAfterPhoto(jobId: string, photo: File) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const formData = new FormData();
  formData.append('photo', photo);
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/crew/jobs/${jobId}/upload-after-photo`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to upload photo' }));
    throw new Error(error.message || 'After photo upload failed');
  }

  return await response.json();
}

export async function completeWork(jobId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/crew/jobs/${jobId}/complete-work`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to complete work' }));
    throw new Error(error.message || 'Work completion failed');
  }

  return await response.json();
}

export async function getCrewRatings() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/crew/ratings', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch ratings' }));
    throw new Error(error.message || 'Ratings fetch failed');
  }

  return await response.json();
}

export async function getAdminInfo() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/crew/admin-info', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch admin info' }));
    throw new Error(error.message || 'Admin info fetch failed');
  }

  return await response.json();
}

export async function getCrewProfile() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/auth/crew/profile', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch profile' }));
    throw new Error(error.message || 'Profile fetch failed');
  }

  return await response.json();
}

export async function updateCrewProfile(profileData: any) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/auth/crew/profile', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update profile' }));
    throw new Error(error.message || 'Profile update failed');
  }

  return await response.json();
}
