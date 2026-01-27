import React from 'react';
import { DataTable } from '../../components/common/DataTable';
import { Building } from 'lucide-react';

export const SalesClients: React.FC = () => {
  const clients = [
    { id: '1', name: 'Westminster Council', type: 'Council', contact: 'John Smith', phone: '+44 20 7641 6000', email: 'john@westminster.gov.uk', jobs: 12 },
    { id: '2', name: 'British Insurance Ltd', type: 'Insurer', contact: 'Mary Jones', phone: '+44 20 7123 4567', email: 'mary@britishins.co.uk', jobs: 8 },
    { id: '3', name: 'Camden Council', type: 'Council', contact: 'David Brown', phone: '+44 20 7974 4444', email: 'david@camden.gov.uk', jobs: 15 },
  ];

  const columns = [
    { header: 'Client Name', accessor: 'name' as const },
    { header: 'Type', accessor: 'type' as const },
    { header: 'Contact', accessor: 'contact' as const },
    { header: 'Phone', accessor: 'phone' as const },
    { header: 'Total Jobs', accessor: 'jobs' as const },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Client Management</h2>
        <p className="text-green-100">Manage client relationships and accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Building size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Building size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Councils</p>
              <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.type === 'Council').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Building size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Insurers</p>
              <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.type === 'Insurer').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Clients</h3>
        <DataTable data={clients} columns={columns} />
      </div>
    </div>
  );
};
