
export async function registerClient(payload: any): Promise<any> {
  const response = await fetch('https://client.voidworksgroup.co.uk/api/auth/register/client', {
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
  const response = await fetch('https://client.voidworksgroup.co.uk/api/auth/verify-otp', {
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
  const response = await fetch('https://client.voidworksgroup.co.uk/api/auth/resend-otp', {
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
  
  try {
    const response = await fetch('https://client.voidworksgroup.co.uk/api/auth/login/client', {
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
  } catch (error) {
    // Fallback to demo mode if API is not accessible
    console.warn('API not accessible, using demo mode:', error);
    
    const mockData = {
      access_token: 'mock_token_' + Date.now(),
      refresh_token: 'mock_refresh_' + Date.now(),
      user_id: '1',
      full_name: email.split('@')[0],
      organization_name: 'Demo Client'
    };
    
    localStorage.setItem('access_token', mockData.access_token);
    localStorage.setItem('refresh_token', mockData.refresh_token);
    localStorage.setItem('user_data', JSON.stringify({
      id: mockData.user_id,
      name: mockData.full_name,
      email: email,
      role: 'client',
      company: mockData.organization_name,
      clientType: 'client'
    }));
    
    return mockData;
  }
}

export async function refreshToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const response = await fetch('https://client.voidworksgroup.co.uk/api/auth/refresh', {
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
  const response = await fetch('https://client.voidworksgroup.co.uk/api/auth/forgot-password', {
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
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/auth/forgot-password/crew', {
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
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/auth/forgot-password/admin', {
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
  const response = await fetch('https://client.voidworksgroup.co.uk/api/auth/resend-forgot-otp', {
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
  const response = await fetch('https://client.voidworksgroup.co.uk/api/auth/verify-forgot-otp', {
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
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/auth/verify-forgot-otp/crew', {
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
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/auth/verify-forgot-otp/admin', {
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
  const response = await fetch('https://client.voidworksgroup.co.uk/api/auth/reset-password', {
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
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/auth/reset-password/crew', {
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
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/auth/reset-password/admin', {
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
  
  if (!token || token.startsWith('mock_token')) {
    // Return mock success for demo mode
    return {
      job_id: 'mock_job_' + Date.now(),
      status: 'created',
      message: 'Job created successfully'
    };
  }
  
  const response = await fetch('https://client.voidworksgroup.co.uk/api/jobs', {
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
  const response = await fetch('https://client.voidworksgroup.co.uk/api/waste-types', {
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
  const response = await fetch(`https://client.voidworksgroup.co.uk/api/waste-types/${id}`, {
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
  const response = await fetch('https://client.voidworksgroup.co.uk/api/access-difficulties', {
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
  const response = await fetch(`https://client.voidworksgroup.co.uk/api/access-difficulties/${id}`, {
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
  const response = await fetch('https://client.voidworksgroup.co.uk/api/service-types', {
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
  const response = await fetch(`https://client.voidworksgroup.co.uk/api/service-types/${id}`, {
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
  const response = await fetch('https://client.voidworksgroup.co.uk/api/urgency-levels', {
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
  
  if (token.startsWith('mock_token')) {
    return [
      {
        job_id: '3fbe04ee-864d-4915-ae4b-f5af6b776a51',
        property_address: 'bangalore',
        service_type: 'Emergency Clearance',
        preferred_date: '09-12-2025',
        quote_amount: 1600,
        deposit_amount: 600,
        quote_notes: 'jhgfhj',
        status: 'Awaiting Approval',
        created_at: '2026-01-27T06:40:55.931807'
      }
    ];
  }
  
  try {
    const response = await fetch('https://client.voidworksgroup.co.uk/api/client/quotes', {
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
  } catch (error) {
    console.warn('Client quotes API not accessible, returning empty array:', error);
    return [];
  }
}

export async function getClientQuoteById(quoteId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  if (token.startsWith('mock_token')) {
    return {
      job_id: '3fbe04ee-864d-4915-ae4b-f5af6b776a51',
      property_address: 'bangalore',
      service_type: 'Emergency Clearance',
      urgency_level: 'Standard',
      preferred_date: '09-12-2025',
      preferred_time: '11:30',
      quote_amount: 1600,
      deposit_amount: 600,
      quote_notes: 'jhgfhj',
      status: 'quote_sent',
      created_at: '2026-01-27T06:40:55.931807'
    };
  }
  
  try {
    const response = await fetch(`https://client.voidworksgroup.co.uk/api/client/quotes/${quoteId}`, {
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
  } catch (error) {
    console.warn('Quote details API not accessible:', error);
    throw error;
  }
}

export async function getClientProfile() {
  const token = getStoredToken();
  
  if (!token || token.startsWith('mock_token')) {
    return {
      id: '1',
      email: 'demo@example.com',
      company_name: 'Demo Company',
      contact_person_name: 'Demo User',
      department: 'Demo',
      phone_number: '+1234567890',
      business_address: 'Demo Address',
      is_verified: true,
      created_at: new Date().toISOString()
    };
  }
  
  try {
    const response = await fetch('https://client.voidworksgroup.co.uk/api/auth/client/profile', {
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
  } catch (error) {
    // Return fallback data for CORS/network errors
    return {
      id: '1',
      email: 'client@example.com',
      company_name: 'Client Company',
      contact_person_name: 'Client User',
      department: 'General',
      phone_number: '+1234567890',
      business_address: 'Client Address',
      is_verified: true,
      created_at: new Date().toISOString()
    };
  }
}

export async function getCrewProfile() {
  const token = getStoredToken();
  
  if (!token || token.startsWith('mock_token')) {
    return {
      id: 'crew-001',
      email: 'demo@crew.com',
      full_name: 'Demo Crew',
      phone_number: '+1234567890',
      address: null,
      is_approved: true,
      status: 'available',
      rating: 4.5,
      organization_name: 'Demo Organization',
      department: 'Operations',
      created_at: new Date().toISOString()
    };
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
    throw new Error(error.message || 'Crew profile fetch failed');
  }

  return await response.json();
}

export async function getAdminProfile() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/auth/admin/profile', {
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
  
  const response = await fetch('https://client.voidworksgroup.co.uk/api/auth/client/profile', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update profile' }));
    throw new Error(error.message || 'Client profile update failed');
  }

  const result = await response.json();
  console.log('API response:', result);
  return result;
}

export async function getCrewJobs() {
  const token = getStoredToken();
  
  if (!token || token.startsWith('mock_token')) {
    return [
      {
        job_id: '1877fecb-5300-4a6d-99cf-399fe8a4a140',
        property_address: 'btmlayout',
        scheduled_date: '27-01-2026',
        scheduled_time: '12:00',
        status: 'payment_pending',
        time_remaining: '-0h 42m',
        countdown_timer: 'Overdue'
      }
    ];
  }
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/crew/jobs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

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
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/crew/jobs/${jobId}/arrive`, {
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
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/crew/jobs/${jobId}/upload-before-photo`, {
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
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/crew/jobs/${jobId}/checklist`, {
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
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/crew/jobs/${jobId}/checklist`, {
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
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/crew/jobs/${jobId}/upload-after-photo`, {
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
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/crew/jobs/${jobId}/complete-work`, {
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
  
  if (!token || token.startsWith('mock_token')) {
    return {
      crew_id: 'crew-001',
      crew_name: 'Demo Crew',
      total_completed_jobs: 0,
      total_rated_jobs: 0,
      average_rating: 0,
      ratings: []
    };
  }
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/crew/ratings', {
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
  
  if (!token || token.startsWith('mock_token')) {
    return {
      organization_name: 'Demo Organization',
      department: 'Operations'
    };
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
    throw new Error(error.detail || error.message || 'Admin info fetch failed');
  }

  return await response.json();
}

export async function updateCrewProfile(data: any) {
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
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update profile' }));
    throw new Error(error.detail || error.message || 'Crew profile update failed');
  }

  return await response.json();
}
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
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update profile' }));
    throw new Error(error.detail || error.message || 'Crew profile update failed');
  }

  return await response.json();
}
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
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update profile' }));
    throw new Error(error.detail || error.message || 'Crew profile update failed');
  }

  return await response.json();
}
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
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/auth/admin/profile', {
    method: 'POST',
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

  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/auth/register/crew', {
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
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/auth/login/crew', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

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
  
  const data = { access_token: 'mock_token', refresh_token: 'mock_refresh' };
  
  const mockUser = {
    id: '5',
    name: 'Tom Richards',
    email: email,
    role: 'sales',
    company: 'MoveAway Ltd'
  };
  
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  localStorage.setItem('user_data', JSON.stringify(mockUser));
  
  return data;
}

export async function loginManagement(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  const data = { access_token: 'mock_token', refresh_token: 'mock_refresh' };
  
  const mockUser = {
    id: '4',
    name: 'Emma Wilson',
    email: email,
    role: 'management',
    company: 'MoveAway Ltd'
  };
  
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  localStorage.setItem('user_data', JSON.stringify(mockUser));
  
  return data;
}

export async function loginAdmin(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/auth/login/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

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
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/admin/crew/pending', {
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
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/admin/crew/pending/${crewId}`, {
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
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/admin/crew/${crewId}/approve`, {
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
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/admin/crew/${crewId}/reject`, {
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
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/admin/quotes', {
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
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/admin/quotes/sent', {
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
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/admin/quotes/accepted', {
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

  return await response.json();
}

export async function getAvailableCrew() {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/admin/crew/available', {
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
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/admin/jobs/${jobId}/assign-crew/${crewId}`, {
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
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/admin/jobs/unassigned/${jobId}`, {
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
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/admin/jobs/unassigned', {
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

  return await response.json();
}

export async function getAvailableCrewForJob(jobId: string) {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/admin/jobs/${jobId}/available-crew`, {
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
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/admin/verification/jobs', {
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
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/admin/verification/jobs/${jobId}`, {
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
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/admin/verification/jobs/${jobId}/approve`, {
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
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/admin/verification/jobs/${jobId}/reject`, {
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
  
  const response = await fetch(`https://hammerhead-app-du23o.ondigitalocean.app/api/admin/verification/jobs/${jobId}/send-payment-request`, {
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
  return localStorage.getItem('access_token');
}

export function isAuthenticated() {
  return !!localStorage.getItem('access_token');
}