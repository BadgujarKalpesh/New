import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { X, Building2, Plus, Edit2, Eye, Search } from 'lucide-react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import Modal from './Modal';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


function TenantForm({ tenant = null, onSuccess, onCancel }) {
  const isEdit = !!tenant;
  
  const [formData, setFormData] = useState({
    name: tenant?.name || '',
    subdomain: tenant?.subdomain || '',
    billing_email: tenant?.billing_email || '',
    db_engine: tenant?.db_engine || 'postgres',
    db_host: tenant?.host || '',
    db_port: tenant?.port || 5432,
    db_name: tenant?.db_name || '',
    db_username: tenant?.db_username || '',
    db_password: '',
    db_region: tenant?.region || '',
    seat_limits_json: {
      admin_cnt: tenant?.seat_limits_json?.admin_cnt || 0,
      manager_cnt: tenant?.seat_limits_json?.manager_cnt || 0,
      supervisor_cnt: tenant?.seat_limits_json?.supervisor_cnt || 0,
      quality_cnt: tenant?.seat_limits_json?.quality_cnt || 0,
      mis_cnt: tenant?.seat_limits_json?.mis_cnt || 0,
      agent_cnt: tenant?.seat_limits_json?.agent_cnt || 0
    },
    start_date: tenant?.start_date ? new Date(tenant.start_date).toISOString().split('T')[0] : '',
    end_date: tenant?.end_date ? new Date(tenant.end_date).toISOString().split('T')[0] : '',
    assigned_subadmin_ids: []
  });

  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingSubAdmins, setLoadingSubAdmins] = useState(false);

  useEffect(() => {
    if (!isEdit) {
      fetchSubAdmins();
    }
  }, [isEdit]);

  const fetchSubAdmins = async () => {
    setLoadingSubAdmins(true);
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await fetch(`${apiBaseUrl}/api/users/sub-admins`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (response.ok) {
        setSubAdmins(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching sub admins:', err);
    } finally {
      setLoadingSubAdmins(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSeatLimitChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      seat_limits_json: {
        ...prev.seat_limits_json,
        [name]: parseInt(value) || 0
      }
    }));
  };

  const handleSubAdminToggle = (subAdminId) => {
    setFormData(prev => ({
      ...prev,
      assigned_subadmin_ids: prev.assigned_subadmin_ids.includes(subAdminId)
        ? prev.assigned_subadmin_ids.filter(id => id !== subAdminId)
        : [...prev.assigned_subadmin_ids, subAdminId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = sessionStorage.getItem('accessToken');
      const url = isEdit 
        ? `${apiBaseUrl}/api/tenants/${tenant.id}`
        : `${apiBaseUrl}/api/tenants`;
      
      const method = isEdit ? 'PUT' : 'POST';
      
      // For edit, only send changed fields
      const payload = isEdit ? {
        ...(formData.name !== tenant.name && { name: formData.name }),
        ...(formData.billing_email !== tenant.billing_email && { billing_email: formData.billing_email }),
        ...(formData.db_host !== tenant.host && { db_host: formData.db_host }),
        ...(formData.db_port !== tenant.port && { db_port: formData.db_port }),
        ...(formData.db_name !== tenant.db_name && { db_name: formData.db_name }),
        ...(formData.db_region !== tenant.region && { db_region: formData.db_region }),
        ...(formData.db_password && { db_password: formData.db_password }),
        seat_limits_json: formData.seat_limits_json,
        ...(formData.start_date && { start_date: formData.start_date }),
        ...(formData.end_date && { end_date: formData.end_date })
      } : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errorMessage || `Failed to ${isEdit ? 'update' : 'create'} tenant`);
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
        
        <InputField
          label="Tenant Name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter tenant name"
          name="name"
        />

        {!isEdit && (
          <InputField
            label="Subdomain"
            type="text"
            value={formData.subdomain}
            onChange={handleInputChange}
            placeholder="client-subdomain"
            name="subdomain"
          />
        )}

        <InputField
          label="Billing Email"
          type="email"
          value={formData.billing_email}
          onChange={handleInputChange}
          placeholder="billing@example.com"
          name="billing_email"
        />
      </div>

      {/* Database Configuration */}
      {!isEdit && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Database Configuration</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Database Engine"
              type="text"
              value={formData.db_engine}
              onChange={handleInputChange}
              placeholder="postgres"
              name="db_engine"
            />
            
            <InputField
              label="Database Host"
              type="text"
              value={formData.db_host}
              onChange={handleInputChange}
              placeholder="db.example.com"
              name="db_host"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Database Port"
              type="number"
              value={formData.db_port}
              onChange={handleInputChange}
              placeholder="5432"
              name="db_port"
            />
            
            <InputField
              label="Database Name"
              type="text"
              value={formData.db_name}
              onChange={handleInputChange}
              placeholder="client_db"
              name="db_name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Database Username"
              type="text"
              value={formData.db_username}
              onChange={handleInputChange}
              placeholder="admin"
              name="db_username"
            />
            
            <InputField
              label="Database Password"
              type="password"
              value={formData.db_password}
              onChange={handleInputChange}
              placeholder="Enter password"
              name="db_password"
            />
          </div>

          <InputField
            label="Database Region"
            type="text"
            value={formData.db_region}
            onChange={handleInputChange}
            placeholder="us-west-2"
            name="db_region"
          />
        </div>
      )}

      {/* Seat Limits */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Seat Limits</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Admin</label>
            <input
              type="number"
              name="admin_cnt"
              value={formData.seat_limits_json.admin_cnt}
              onChange={handleSeatLimitChange}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Manager</label>
            <input
              type="number"
              name="manager_cnt"
              value={formData.seat_limits_json.manager_cnt}
              onChange={handleSeatLimitChange}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Supervisor</label>
            <input
              type="number"
              name="supervisor_cnt"
              value={formData.seat_limits_json.supervisor_cnt}
              onChange={handleSeatLimitChange}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Quality</label>
            <input
              type="number"
              name="quality_cnt"
              value={formData.seat_limits_json.quality_cnt}
              onChange={handleSeatLimitChange}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">MIS</label>
            <input
              type="number"
              name="mis_cnt"
              value={formData.seat_limits_json.mis_cnt}
              onChange={handleSeatLimitChange}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Agent</label>
            <input
              type="number"
              name="agent_cnt"
              value={formData.seat_limits_json.agent_cnt}
              onChange={handleSeatLimitChange}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Subscription Period */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Subscription Period</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Start Date"
            type="date"
            value={formData.start_date}
            onChange={handleInputChange}
            name="start_date"
          />
          
          <InputField
            label="End Date"
            type="date"
            value={formData.end_date}
            onChange={handleInputChange}
            name="end_date"
          />
        </div>
      </div>

      {/* Sub Admins Assignment (Create Only) */}
      {!isEdit && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Assign Sub Admins</h3>
          
          {loadingSubAdmins ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : subAdmins.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No sub admins available</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200">
              {subAdmins.map((subAdmin) => (
                <label
                  key={subAdmin.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.assigned_subadmin_ids.includes(subAdmin.id)}
                    onChange={() => handleSubAdminToggle(subAdmin.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{subAdmin.full_name}</p>
                    <p className="text-xs text-gray-500">{subAdmin.email}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
        >
          Cancel
        </button>
        <div className="flex-1">
          <Button
            type="submit"
            label={loading ? 'Processing...' : (isEdit ? 'Update Tenant' : 'Create Tenant')}
            loading={loading}
          />
        </div>
      </div>
    </form>
  );
}


export default TenantForm;