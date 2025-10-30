import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { X, Building2, Plus, Edit2, Eye, Search } from 'lucide-react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import Modal from './Modal';


function TenantsList({ tenants, loading, onView, onEdit }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.billing_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4 relative">
        <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search tenants by name, subdomain, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredTenants.length === 0 ? (
        <div className="text-center py-12">
          <Building2 size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">
            {searchTerm ? 'No tenants found matching your search' : 'No tenants found'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Subdomain
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Subscription Status
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Seats
                </th> */}
                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Subscription
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTenants.map((tenant) => {
                // const totalSeats = Object.values(tenant.seat_limits_json || {}).reduce((a, b) => a + b, 0);
                // const daysLeft = Math.ceil((new Date(tenant.end_date) - new Date()) / (1000 * 60 * 60 * 24));
                
                return (
                  <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{tenant.name}</p>
                        <p className="text-sm text-gray-500">{tenant.billing_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {tenant.subdomain}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        tenant.subscription_status === 'active' 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}>
                        {tenant.subscription_status.charAt(0).toUpperCase() + tenant.subscription_status.slice(1)}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-800">{totalSeats}</p>
                    </td> */}
                    {/* <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-700">
                          {new Date(tenant.start_date).toLocaleDateString()} - {new Date(tenant.end_date).toLocaleDateString()}
                        </p>
                        <p className={`text-xs ${daysLeft < 30 ? 'text-red-600' : 'text-gray-500'}`}>
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                        </p>
                      </div>
                    </td> */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onView(tenant)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onEdit(tenant)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Tenant"
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


export default TenantsList;