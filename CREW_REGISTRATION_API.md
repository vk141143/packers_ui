# Crew Registration API Integration

## ✅ Implementation Complete

The crew registration API has been successfully integrated into the application.

### API Endpoint
```
POST https://hammerhead-app-du23o.ondigitalocean.app/api/auth/register/crew
```

### Request Format
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Fields**:
  - `email` (string, required)
  - `full_name` (string, required)
  - `password` (string, required)
  - `phone_number` (string, required) - Format: `+44XXXXXXXXXX`
  - `drivers_license` (file, required)
  - `dbs_certificate` (file, required)
  - `proof_of_address` (file, required)
  - `insurance_certificate` (file, required)
  - `right_to_work` (file, required)

### Response Format (201 Created)
```typescript
{
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  drivers_license: string;        // URL to uploaded document
  dbs_certificate: string;        // URL to uploaded document
  proof_of_address: string;       // URL to uploaded document
  insurance_certificate: string;  // URL to uploaded document
  right_to_work: string;          // URL to uploaded document
  is_approved: boolean;           // false by default
  status: 'available' | 'busy' | 'offline';
}
```

### Implementation Files

#### 1. Type Definition (`src/types/index.ts`)
```typescript
export interface CrewRegistrationResponse {
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
  status: 'available' | 'busy' | 'offline';
}
```

#### 2. Service Function (`src/services/authService.ts`)
```typescript
export async function registerCrew(payload: any): Promise<CrewRegistrationResponse> {
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
```

#### 3. UI Integration (`src/pages/SignUp.tsx`)
The SignUp page already includes:
- Multi-step form with role selection
- File upload fields for all required documents
- Phone number input with country code selector
- Form validation
- API integration with error handling
- Success message with registration details

### User Flow

1. **Role Selection**: User selects "Field Crew" role
2. **Basic Info**: User enters email, full name, and password
3. **Documents Upload**: User uploads:
   - Driver's License
   - DBS Certificate (Background Check)
   - Proof of Address
   - Insurance Certificate
   - Right to Work Document
4. **Phone Number**: User enters phone with country code
5. **Submit**: Form data sent to API as multipart/form-data
6. **Success**: User receives confirmation message and redirected to login

### Success Message
```
✅ Crew Registration Submitted!

🚛 Welcome to the Field Team!

📋 Your application includes:
• All required documents uploaded
• Background verification pending
• Skills assessment complete
• Equipment training scheduled

🔄 Status: Under review
📧 You'll receive approval notification within 24-48 hours
⏱️ Background checks typically take 2-3 business days
```

### Error Handling
- Network errors are caught and displayed to user
- Invalid file types are validated before upload
- Required fields are validated before submission
- API errors are parsed and shown with meaningful messages

### Next Steps
The crew member will:
1. Receive email confirmation
2. Wait for admin approval (`is_approved: true`)
3. Receive login credentials
4. Access crew dashboard once approved

### Testing
To test the integration:
1. Navigate to `/signup`
2. Select "Field Crew" role
3. Fill in all required fields
4. Upload all 5 required documents
5. Submit the form
6. Verify API response in Network tab
7. Check success message display
