import { makeApiCall } from '../utils/apiIntegration';

interface CrewLoginData {
  email: string;
  password: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
  contact_method: string;
}

interface CrewLoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface TokenRefreshResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface CrewRegistrationData {
  email: string;
  full_name: string;
  phone_number: string;
  drivers_license: File;
  dbs_certificate: File;
  proof_of_address: File;
  insurance_certificate: File;
  right_to_work: File;
}

interface CrewRegistrationResponse {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  drivers_license: string;
  dbs_certificate: string;
  proof_of_address: string;
  insurance_certificate: string;
  right_to_work: string;
  is_approved: boolean;
  status: string;
}

export const forgotPassword = async (data: ForgotPasswordData): Promise<ForgotPasswordResponse> => {
  return makeApiCall('/api/auth/forgot-password/crew', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }, 'crew');
};

export const refreshToken = async (refreshToken: string): Promise<TokenRefreshResponse> => {
  return makeApiCall('/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${refreshToken}`
    }
  }, 'crew');
};

export const loginCrew = async (data: CrewLoginData): Promise<CrewLoginResponse> => {
  return makeApiCall('/api/auth/login/crew', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }, 'crew');
};

export const registerCrew = async (data: CrewRegistrationData): Promise<CrewRegistrationResponse> => {
  const formData = new FormData();
  
  formData.append('email', data.email);
  formData.append('full_name', data.full_name);
  formData.append('phone_number', data.phone_number);
  formData.append('drivers_license', data.drivers_license);
  formData.append('dbs_certificate', data.dbs_certificate);
  formData.append('proof_of_address', data.proof_of_address);
  formData.append('insurance_certificate', data.insurance_certificate);
  formData.append('right_to_work', data.right_to_work);

  return makeApiCall('/api/auth/register/crew', {
    method: 'POST',
    body: formData,
    headers: {} // Remove Content-Type to let browser set multipart boundary
  }, 'crew');
};