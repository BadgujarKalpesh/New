import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { X, Building2, Plus, Edit2, Eye, Search } from 'lucide-react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import Modal from './Modal';

function TenantDetailsModal({ tenant, isOpen, onClose }) {
  if (!tenant) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tenant Details" size="large">
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Tenant Name</p>
              <p className="text-sm font-medium text-gray-800">{tenant.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Subdomain</p>
              <p className="text-sm font-medium text-gray-800">{tenant.subdomain}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                tenant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Billing Email</p>
              <p className="text-sm font-medium text-gray-800">{tenant.billing_email}</p>
            </div>
          </div>
        </div>

        {/* Database Info */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Database Configuration</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Host</p>
              <p className="text-sm font-medium text-gray-800">{tenant.host}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Port</p>
              <p className="text-sm font-medium text-gray-800">{tenant.port}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Database Name</p>
              <p className="text-sm font-medium text-gray-800">{tenant.db_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Region</p>
              <p className="text-sm font-medium text-gray-800">{tenant.region}</p>
            </div>
          </div>
        </div>

        {/* Seat Limits */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Seat Limits</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(tenant.seat_limits_json).map(([key, value]) => (
              <div key={key}>
                <p className="text-xs text-gray-500">{key.replace('_cnt', '').replace('_', ' ').toUpperCase()}</p>
                <p className="text-lg font-semibold text-gray-800">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Period */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Subscription Period</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="text-sm font-medium text-gray-800">
                {new Date(tenant.start_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">End Date</p>
              <p className="text-sm font-medium text-gray-800">
                {new Date(tenant.end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}


export default TenantDetailsModal;