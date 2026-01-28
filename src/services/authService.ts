import { getApiUrl, FALLBACK_ENDPOINTS, tryMultipleEndpoints, API_CONFIG } from '../config/api';
import { fetchWithTimeout, isTokenExpired } from '../utils/requestUtils';

export async function registerClient(payload: any): Promise<any> {
  const response = await fetchWithTimeout(getApiUrl('/auth/register/client'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Registration failed' }));
    throw new Error(error.detail || error.message || 'Client registration failed');
  }

  return await response.json();
}

export async function verifyOtp(identifier: string, otp: string): Promise<any> {
  const response = await fetch(getApiUrl('/auth/verify-otp'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier, otp }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'OTP verification failed' }));
    throw new Error(error.message || 'OTP verification failed');
  }

  const data = await response.json();
  
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  
  return data;
}

export async function resendOtp(identifier: string, otpMethod: 'email' | 'sms' = 'email'): Promise<any> {
  const response = await fetch(getApiUrl('/auth/resend-otp'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier, otp_method: otpMethod }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to resend OTP' }));
    throw new Error(error.message || 'Resend OTP failed');
  }

  return await response.json();
}

export async function loginClient(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  const response = await fetch(getApiUrl('/auth/login/client'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Client login failed');
  }

  const data = await response.json();
  
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  localStorage.setItem('user_data', JSON.stringify({
    id: data.user_id || '1',
    name: data.full_name || email,
    email: email,
    role: 'client',
    company: data.organization_name || 'Client',
    clientType: 'client'
  }));
  
  return data;
}

export async function refreshToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const response = await fetch(getApiUrl('/auth/refresh'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  
  return data;
}

export async function forgotPassword(identifier: string, otpMethod: 'email' | 'sms' = 'email') {
  const response = await fetch(getApiUrl('/auth/forgot-password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier, otp_method: otpMethod }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to send OTP' }));
    throw new Error(error.message || 'Forgot password failed');
  }

  return await response.json();
}

export async function forgotPasswordCrew(email: string) {
  const response = await fetch(getApiUrl('/auth/forgot-password/crew', 'crew'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to send reset email' }));
    throw new Error(error.message || 'Forgot password failed');
  }

  return await response.json();
}

export async function forgotPasswordAdmin(email: string) {
  const response = await fetch(getApiUrl('/auth/forgot-password/admin', 'crew'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to send reset email' }));
    throw new Error(error.message || 'Forgot password failed');
  }

  return await response.json();
}

export async function resendForgotOtp(identifier: string, otpMethod: 'email' | 'sms' = 'email') {
  const response = await fetch(getApiUrl('/auth/resend-forgot-otp'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier, otp_method: otpMethod }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to resend OTP' }));
    throw new Error(error.detail || error.message || 'Resend forgot OTP failed');
  }

  return await response.json();
}
export async function verifyForgotOtp(identifier: string, otp: string) {
  const response = await fetch(getApiUrl('/auth/verify-forgot-otp'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier, otp }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Invalid OTP' }));
    throw new Error(error.detail || error.message || 'OTP verification failed');
  }

  return await response.json();
}

export async function verifyForgotOtpCrew(email: string, otp: string) {
  const response = await fetch(getApiUrl('/auth/verify-forgot-otp/crew', 'crew'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Invalid OTP' }));
    throw new Error(error.detail || error.message || 'OTP verification failed');
  }

  return await response.json();
}

export async function verifyForgotOtpAdmin(email: string, otp: string) {
  const response = await fetch(getApiUrl('/auth/verify-forgot-otp/admin', 'crew'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Invalid OTP' }));
    throw new Error(error.detail || error.message || 'OTP verification failed');
  }

  return await response.json();
}

export async function resetPassword(resetToken: string, newPassword: string, confirmPassword: string) {
  const response = await fetch(getApiUrl('/auth/reset-password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reset_token: resetToken, new_password: newPassword, confirm_password: confirmPassword }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Password reset failed' }));
    throw new Error(error.message || 'Password reset failed');
  }

  return await response.json();
}

export async function resetPasswordCrew(resetToken: string, newPassword: string) {
  const response = await fetch(getApiUrl('/auth/reset-password/crew', 'crew'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reset_token: resetToken, new_password: newPassword }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Password reset failed' }));
    throw new Error(error.detail || error.message || 'Password reset failed');
  }

  return await response.json();
}

export async function resetPasswordAdmin(resetToken: string, newPassword: string) {
  const response = await fetch(getApiUrl('/auth/reset-password/admin', 'crew'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reset_token: resetToken, new_password: newPassword }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Password reset failed' }));
    throw new Error(error.detail || error.message || 'Password reset failed');
  }

  return await response.json();
}

export async function createClientJob(jobData: any) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('Authentication required. Please login again.');
  }
  
  const response = await fetch(getApiUrl('/jobs'), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: jobData,
  });

  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create job' }));
    throw new Error(error.detail || error.message || 'Job creation failed');
  }

  return await response.json();
}

export async function getWasteTypes() {
  const response = await fetch(getApiUrl('/waste-types'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch waste types' }));
    throw new Error(error.message || 'Waste types fetch failed');
  }

  return await response.json();
}

export async function getWasteTypeById(id: number) {
  const response = await fetch(getApiUrl(`/waste-types/${id}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch waste type' }));
    throw new Error(error.message || 'Waste type fetch failed');
  }

  return await response.json();
}

export async function getAccessDifficulties() {
  const response = await fetch(getApiUrl('/access-difficulties'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch access difficulties' }));
    throw new Error(error.message || 'Access difficulties fetch failed');
  }

  return await response.json();
}

export async function getAccessDifficultyById(id: number) {
  const response = await fetch(getApiUrl(`/access-difficulties/${id}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch access difficulty' }));
    throw new Error(error.message || 'Access difficulty fetch failed');
  }

  return await response.json();
}

export async function getServiceTypes() {
  const response = await fetch(getApiUrl('/service-types'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch service types' }));
    throw new Error(error.message || 'Service types fetch failed');
  }

  return await response.json();
}

export async function getServiceTypeById(id: number) {
  const response = await fetch(getApiUrl(`/service-types/${id}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch service type' }));
    throw new Error(error.message || 'Service type fetch failed');
  }

  return await response.json();
}

export async function getUrgencyLevels() {
  const response = await fetch(getApiUrl('/urgency-levels'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch urgency levels' }));
    throw new Error(error.message || 'Urgency levels fetch failed');
  }

  return await response.json();
}

export async function getClientQuotes() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl('/client/quotes'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch quotes' }));
    throw new Error(error.message || 'Client quotes fetch failed');
  }

  return await response.json();
}

export async function getClientQuoteById(quoteId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl(`/client/quotes/${quoteId}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch quote details' }));
    throw new Error(error.message || 'Quote details fetch failed');
  }

  return await response.json();
}

export async function getClientProfile() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch('/api/auth/client/profile', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    throw new Error('Session expired');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch profile' }));
    throw new Error(error.message || 'Client profile fetch failed');
  }

  return await response.json();
}

export async function getCrewProfile() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl('/auth/crew/profile', 'crew'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch profile' }));
    throw new Error(error.message || 'Crew profile fetch failed');
  }

  return await response.json();
}

export async function getAdminProfile() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl('/auth/admin/profile', 'crew'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch profile' }));
    throw new Error(error.message || 'Admin profile fetch failed');
  }

  return await response.json();
}

export async function updateClientProfile(data: any) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  // Map field names to match API expectations
  const mappedData = {
    organization_name: data.company_name || data.organization_name,
    contact_person: data.contact_person_name || data.contact_person,
    department: data.department,
    phone_number: data.phone_number,
    business_address: data.business_address
  };
  
  const response = await fetch('/api/auth/client/profile', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(mappedData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update profile' }));
    throw new Error(error.message || 'Client profile update failed');
  }

  const result = await response.json();
  return result;
}

export async function getCrewJobById(jobId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const jobEndpoints = [
    `${API_CONFIG.CREW_API}/crew/jobs/${jobId}`,
    `${API_CONFIG.CREW_API}/api/crew/jobs/${jobId}`,
    `${API_CONFIG.CREW_API}/jobs/${jobId}`
  ];
  
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  
  const response = await tryMultipleEndpoints(jobEndpoints, requestOptions);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch job details' }));
    throw new Error(error.detail || error.message || 'Job details fetch failed');
  }

  return await response.json();
}

export async function getCrewJobs() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  
  const response = await tryMultipleEndpoints(FALLBACK_ENDPOINTS.CREW_JOBS, requestOptions);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch crew jobs' }));
    throw new Error(error.detail || error.message || 'Crew jobs fetch failed');
  }

  return await response.json();
}

export async function crewArriveAtJob(jobId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl(`/crew/jobs/${jobId}/arrive`, 'crew'), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to mark arrival' }));
    throw new Error(error.detail || error.message || 'Crew arrival failed');
  }

  return await response.json();
}

export async function uploadCrewBeforePhoto(jobId: string, photoFile: File) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const formData = new FormData();
  formData.append('before_photo', photoFile);
  
  const response = await fetch(getApiUrl(`/crew/jobs/${jobId}/upload-before-photo`, 'crew'), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to upload before photo' }));
    throw new Error(error.detail || error.message || 'Before photo upload failed');
  }

  return await response.json();
}

export async function getCrewJobChecklist(jobId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl(`/crew/jobs/${jobId}/checklist`, 'crew'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch job checklist' }));
    throw new Error(error.detail || error.message || 'Job checklist fetch failed');
  }

  return await response.json();
}

export async function updateCrewJobChecklist(jobId: string, checklistData: any) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl(`/crew/jobs/${jobId}/checklist`, 'crew'), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(checklistData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update job checklist' }));
    throw new Error(error.detail || error.message || 'Job checklist update failed');
  }

  return await response.json();
}

export async function uploadCrewAfterPhoto(jobId: string, photoFile: File) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const formData = new FormData();
  formData.append('after_photo', photoFile);
  
  const response = await fetch(getApiUrl(`/crew/jobs/${jobId}/upload-after-photo`, 'crew'), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to upload after photo' }));
    throw new Error(error.detail || error.message || 'After photo upload failed');
  }

  return await response.json();
}

export async function completeCrewWork(jobId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl(`/crew/jobs/${jobId}/complete-work`, 'crew'), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to complete work' }));
    throw new Error(error.detail || error.message || 'Work completion failed');
  }

  return await response.json();
}

export async function getCrewRatings() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl('/crew/ratings', 'crew'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch crew ratings' }));
    throw new Error(error.detail || error.message || 'Crew ratings fetch failed');
  }

  return await response.json();
}

export async function getCrewAdminInfo() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl('/crew/admin-info', 'crew'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch admin info' }));
    throw new Error(error.detail || error.message || 'Admin info fetch failed');
  }

  return await response.json();
}

export async function updateCrewProfile(data: any) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl('/auth/crew/profile', 'crew'), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update profile' }));
    throw new Error(error.detail || error.message || 'Crew profile update failed');
  }

  return await response.json();
}

export async function updateAdminProfile(data: any) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl('/auth/admin/profile', 'crew'), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update profile' }));
    throw new Error(error.message || 'Admin profile update failed');
  }

  return await response.json();
}

export async function registerCrew(payload: any): Promise<any> {
  const formData = new FormData();
  formData.append('email', payload.email);
  formData.append('full_name', payload.fullName);
  formData.append('password', payload.password);
  formData.append('phone_number', `${payload.countryCode}${payload.phone}`);
  
  if (payload.driversLicense) formData.append('drivers_license', payload.driversLicense);
  if (payload.dbsCertificate) formData.append('dbs_certificate', payload.dbsCertificate);
  if (payload.proofOfAddress) formData.append('proof_of_address', payload.proofOfAddress);
  if (payload.insurance) formData.append('insurance_certificate', payload.insurance);
  if (payload.rightToWork) formData.append('right_to_work', payload.rightToWork);

  const response = await fetch(getApiUrl('/auth/register/crew', 'crew'), {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Registration failed' }));
    throw new Error(error.message || 'Crew registration failed');
  }

  return await response.json();
}

export async function loginCrew(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  };
  
  const response = await tryMultipleEndpoints(FALLBACK_ENDPOINTS.LOGIN_CREW, requestOptions);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Crew login failed');
  }

  const data = await response.json();
  
  const crewUser = {
    id: 'crew-001',
    name: 'Crew Member',
    email: email,
    role: 'crew',
    company: 'MoveAway Ltd'
  };
  
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  localStorage.setItem('user_data', JSON.stringify(crewUser));
  
  return data;
}

export async function loginSales(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  const response = await fetch(getApiUrl('/auth/login/sales', 'crew'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Sales login failed');
  }

  const data = await response.json();
  
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  localStorage.setItem('user_data', JSON.stringify({
    id: data.user_id || '5',
    name: data.full_name || email,
    email: email,
    role: 'sales',
    company: 'MoveAway Ltd'
  }));
  
  return data;
}

export async function loginManagement(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  const response = await fetch(getApiUrl('/auth/login/management', 'crew'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Management login failed');
  }

  const data = await response.json();
  
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  localStorage.setItem('user_data', JSON.stringify({
    id: data.user_id || '4',
    name: data.full_name || email,
    email: email,
    role: 'management',
    company: 'MoveAway Ltd'
  }));
  
  return data;
}

export async function loginAdmin(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  };
  
  const response = await tryMultipleEndpoints(FALLBACK_ENDPOINTS.LOGIN_ADMIN, requestOptions);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Admin login failed');
  }

  const data = await response.json();
  
  const adminUser = {
    id: '1',
    name: 'Admin User',
    email: email,
    role: 'admin',
    company: 'MoveAway Ltd',
    clientType: 'admin'
  };
  
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  localStorage.setItem('user_data', JSON.stringify(adminUser));
  
  return data;
}

export async function getPendingCrew() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl('/admin/crew/pending', 'crew'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch pending crew' }));
    throw new Error(error.message || 'Pending crew fetch failed');
  }

  return await response.json();
}

export async function getPendingCrewById(crewId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl(`/admin/crew/pending/${crewId}`, 'crew'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch pending crew details' }));
    throw new Error(error.message || 'Pending crew details fetch failed');
  }

  return await response.json();
}

export async function approveCrewMember(crewId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl(`/admin/crew/${crewId}/approve`, 'crew'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to approve crew member' }));
    throw new Error(error.message || 'Crew approval failed');
  }

  return await response.json();
}

export async function rejectCrewMember(crewId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl(`/admin/crew/${crewId}/reject`, 'crew'), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to reject crew member' }));
    throw new Error(error.message || 'Crew rejection failed');
  }

  return await response.json();
}

export async function getAdminQuotes() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl('/admin/quotes', 'crew'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch quotes' }));
    throw new Error(error.message || 'Admin quotes fetch failed');
  }

  return await response.json();
}

export async function getSentQuotes() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl('/admin/quotes/sent', 'crew'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch sent quotes' }));
    throw new Error(error.message || 'Sent quotes fetch failed');
  }

  return await response.json();
}

export async function getAcceptedQuotes() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl('/admin/quotes/accepted', 'crew'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch accepted quotes' }));
    throw new Error(error.message || 'Accepted quotes fetch failed');
  }

  const data = await response.json();
  
  // Transform API data to match UI expectations
  return data.map((quote: any) => ({
    id: quote.job_id || quote.id,
    clientName: quote.client_name || quote.client || 'Unknown Client',
    serviceType: quote.service_type || 'Service',
    status: quote.status || 'booking-confirmed',
    finalQuote: {
      fixedPrice: quote.total_amount || quote.quote_amount || 0,
      depositAmount: quote.deposit_amount || 0,
      quotedBy: quote.quoted_by || 'Admin',
      quotedAt: quote.quoted_at || quote.created_at || new Date().toISOString()
    },
    clientApproval: {
      approvedAt: quote.accepted_at || quote.approved_at || new Date().toISOString()
    },
    initialPayment: {
      amount: quote.deposit_amount || 0,
      paidAt: quote.payment_date || quote.paid_at || new Date().toISOString()
    },
    paymentStatus: quote.payment_status || 'success'
  }));
}

export async function getAvailableCrew() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl('/admin/crew/available', 'crew'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch available crew' }));
    throw new Error(error.message || 'Available crew fetch failed');
  }

  return await response.json();
}

export async function assignCrewToJob(jobId: string, crewId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl(`/admin/jobs/${jobId}/assign-crew/${crewId}`, 'crew'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to assign crew to job' }));
    throw new Error(error.message || 'Crew assignment failed');
  }

  return await response.json();
}

export async function getUnassignedJobById(jobId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl(`/admin/jobs/unassigned/${jobId}`, 'crew'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch unassigned job details' }));
    throw new Error(error.message || 'Unassigned job fetch failed');
  }

  return await response.json();
}

export async function getUnassignedJobs() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch('https://voidworksgroup.co.uk/api/admin/jobs/unassigned', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch unassigned jobs' }));
    throw new Error(error.message || 'Unassigned jobs fetch failed');
  }

  const data = await response.json();
  
  // Transform API data to match component expectations
  return data.map((job: any) => ({
    id: job.job_id,
    job_id: job.job_id,
    client: job.client,
    propertyAddress: job.property_address,
    property_address: job.property_address,
    serviceType: job.service_type,
    service_type: job.service_type,
    urgencyLevel: job.urgency_level,
    urgency_level: job.urgency_level,
    preferredDate: job.preferred_date,
    preferred_date: job.preferred_date,
    status: job.status
  }));
}

export async function getAvailableCrewForJob(jobId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl(`/admin/jobs/${jobId}/available-crew`, 'crew'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch available crew for job' }));
    throw new Error(error.message || 'Available crew for job fetch failed');
  }

  return await response.json();
}

export async function getJobsPendingVerification() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl('/admin/verification/jobs', 'crew'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch jobs pending verification' }));
    throw new Error(error.message || 'Jobs pending verification fetch failed');
  }

  return await response.json();
}

export async function getJobVerificationDetails(jobId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl(`/admin/verification/jobs/${jobId}`, 'crew'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch job verification details' }));
    throw new Error(error.message || 'Job verification details fetch failed');
  }

  return await response.json();
}

export async function approveJobVerification(jobId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl(`/admin/verification/jobs/${jobId}/approve`, 'crew'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to approve job verification' }));
    throw new Error(error.message || 'Job verification approval failed');
  }

  return await response.json();
}

export async function rejectJobVerification(jobId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl(`/admin/verification/jobs/${jobId}/reject`, 'crew'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to reject job verification' }));
    throw new Error(error.message || 'Job verification rejection failed');
  }

  return await response.json();
}

export async function sendPaymentRequest(jobId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(getApiUrl(`/admin/verification/jobs/${jobId}/send-payment-request`, 'crew'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to send payment request' }));
    throw new Error(error.message || 'Payment request failed');
  }

  return await response.json();
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_data');
}

export function getStoredToken() {
  const token = localStorage.getItem('access_token');
  if (token && isTokenExpired(token)) {
    logout();
    return null;
  }
  return token;
}

export function isAuthenticated() {
  return !!localStorage.getItem('access_token');
}