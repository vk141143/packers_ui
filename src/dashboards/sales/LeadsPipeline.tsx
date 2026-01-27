import React from 'react';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Plus, TrendingUp, Users, DollarSign } from 'lucide-react';

export const LeadsPipeline: React.FC = () => {
  const leads = [
    { id: '1', company: 'Camden Council', contact: 'John Smith', value: '£50,000', status: 'Negotiation', probability: '75%' },
    { id: '2', company: 'Thames Housing', contact: 'Mary Jones', value: '£35,000', status: 'Proposal', probability: '60%' },
    { id: '3', company: 'London Insurance', contact: 'David Brown', value: '£80,000', status: 'Qualified', probability: '40%' },
    { id: '4', company: 'Westminster Council', contact: 'Sarah Wilson', value: '£120,000', status: 'Hot Lead', probability: '90%' },
    { id: '5', company: 'Southwark Housing', contact: 'Michael Chen', value: '£65,000', status: 'Follow-up', probability: '30%' },
    { id: '6', company: 'Aviva Insurance', contact: 'Emma Thompson', value: '£95,000', status: 'Proposal', probability: '65%' },
    { id: '7', company: 'Hackney Council', contact: 'James Rodriguez', value: '£45,000', status: 'Qualified', probability: '50%' },
    { id: '8', company: 'Tower Hamlets', contact: 'Lisa Parker', value: '£75,000', status: 'Negotiation', probability: '80%' },
  ];

  const columns = [
    { header: 'Company', accessor: 'company' as const },
    { header: 'Contact', accessor: 'contact' as const },
    { header: 'Value', accessor: 'value' as const },
    { header: 'Status', accessor: (row: typeof leads[0]) => (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{row.status}</span>
    )},
    { header: 'Probability', accessor: 'probability' as const },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Leads Pipeline</h2>
        <p className="text-blue-100">Manage sales opportunities and conversions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900">£565K</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">62%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Leads</h3>
          <Button variant="primary">
            <Plus size={20} className="mr-2" />
            Add Lead
          </Button>
        </div>
        <DataTable data={leads} columns={columns} />
      </div>
    </div>
  );
};
