import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, XCircle, Clock, Mail, Phone, MapPin, FileText, User, Building } from 'lucide-react';
import { getPendingCrew, approveCrewMember, rejectCrewMember } from '../../services/authService';

interface PendingUser {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  created_at: string;
}

export const UserApproval: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const data = await getPendingCrew();
        setPendingUsers(data);
      } catch (error) {
        console.error('Failed to fetch pending users:', error);
        alert('Failed to load pending users');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      console.log('Approving user:', userId);
      const result = await approveCrewMember(userId);
      console.log('Approve result:', result);
      alert('User approved successfully! Welcome email sent.');
      const data = await getPendingCrew();
      setPendingUsers(data);
      setShowModal(false);
    } catch (error) {
      console.error('Approve error:', error);
      alert(`Failed to approve user: ${error.message}`);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      console.log('Rejecting user:', userId);
      const result = await rejectCrewMember(userId);
      console.log('Reject result:', result);
      alert('User application rejected. Notification email sent.');
      const data = await getPendingCrew();
      setPendingUsers(data);
      setShowModal(false);
    } catch (error) {
      console.error('Reject error:', error);
      alert(`Failed to reject user: ${error.message}`);
    }
  };

  const pendingCount = pendingUsers.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 p-8 mb-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Users size={40} />
                User Approval Center
              </h2>
              <p className="text-indigo-200">
                Review and approve new crew applications
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{pendingCount}</div>
                <div className="text-indigo-200 text-sm">Pending Approvals</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Pending', count: pendingUsers.length, icon: Clock, color: 'orange' },
            { label: 'Approved', count: 0, icon: CheckCircle, color: 'green' },
            { label: 'Rejected', count: 0, icon: XCircle, color: 'red' },
            { label: 'Total', count: pendingUsers.length, icon: Users, color: 'blue' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center mb-4`}>
                  <Icon size={24} className={`text-${stat.color}-600`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.count}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Pending Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="text-orange-600" />
            Pending Applications ({pendingCount})
          </h3>

          {pendingUsers.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h4>
              <p className="text-gray-600">No pending user applications to review.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingUsers.map((user, index) => (
                <motion.div
                  key={`${user.id}-${index}`}
                  whileHover={{ scale: 1.02 }}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowModal(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        👷
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{user.full_name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Mail size={14} />
                            {user.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={14} />
                            {user.phone_number}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Crew
                      </span>
                      <div className="text-right text-sm text-gray-500">
                        <div>Applied</div>
                        <div>{new Date(user.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* User Detail Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                      👷
                    </div>
                    {selectedUser.full_name}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-400" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium">{selectedUser.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-400" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium">{selectedUser.phone_number}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="text-gray-400" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Role</div>
                      <div className="font-medium">Crew</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-gray-400" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Applied</div>
                      <div className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleApprove(selectedUser.id)}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Approve Application
                  </button>
                  <button
                    onClick={() => handleReject(selectedUser.id)}
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} />
                    Reject Application
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};