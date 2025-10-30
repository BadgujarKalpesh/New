import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { X, UserPlus, Users as UsersIcon, Mail, Lock, User, Shield } from 'lucide-react';
import Modal from './Modal';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function CreateUserForm({ userType, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    features: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const superAdminFeatures = [
    { value: 'user.subadmin.create', label: 'Create Sub Admin' },
    { value: 'user.superadmin.create', label: 'Create Super Admin' },
    { value: 'tenant.management', label: 'Tenant Management' }
  ];

  const subAdminFeatures = [
    { value: 'user.subadmin.create', label: 'Create Sub Admin' }
  ];

  const availableFeatures = userType === 'super' ? superAdminFeatures : subAdminFeatures;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = userType === 'super' 
      ? `${apiBaseUrl}/api/users/super-admin`
      : `${apiBaseUrl}/api/users/sub-admin`;

    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errorMessage || `Failed to create ${userType} admin`);
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <User size={16} />
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter full name"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Mail size={16} />
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Lock size={16} />
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          minLength={8}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter strong password"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <Shield size={16} />
          Features & Permissions
        </label>
        <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
          {availableFeatures.map((feature) => (
            <label
              key={feature.value}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.features.includes(feature.value)}
                onChange={() => handleFeatureToggle(feature.value)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-medium">{feature.label}</span>
              <code className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {feature.value}
              </code>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : `Create ${userType === 'super' ? 'Super' : 'Sub'} Admin`}
        </button>
      </div>
    </form>
  );
}


export default CreateUserForm;