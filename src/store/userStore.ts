interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  address?: string;
  companyName?: string;
  clientType?: string;
  emergencyContact?: string;
  niNumber?: string;
  drivingLicense?: string;
  department?: string;
  experience?: string;
  documents?: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

class UserStore {
  private pendingUsers: PendingUser[] = [];

  addPendingUser(userData: Omit<PendingUser, 'id' | 'status' | 'submittedAt'> | PendingUser) {
    if ('id' in userData && 'status' in userData && 'submittedAt' in userData) {
      // Full user object provided
      this.pendingUsers.push(userData as PendingUser);
    } else {
      // Partial user object, add missing fields
      const newUser: PendingUser = {
        ...userData,
        id: Date.now().toString(),
        status: 'pending',
        submittedAt: new Date().toISOString().split('T')[0]
      };
      this.pendingUsers.push(newUser);
    }
  }

  getPendingUsers(): PendingUser[] {
    return this.pendingUsers;
  }

  updateUserStatus(id: string, status: 'approved' | 'rejected') {
    this.pendingUsers = this.pendingUsers.map(user => 
      user.id === id ? { ...user, status } : user
    );
  }
}

export const userStore = new UserStore();

// Initialize with mock data
import { mockPendingUsers } from '../data/mockData';
mockPendingUsers.forEach(user => userStore.addPendingUser(user));

export type { PendingUser };