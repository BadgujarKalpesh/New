import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { X, Building2, Plus, Edit2, Eye, Search } from 'lucide-react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import Modal from './Modal';
import TenantsList from './TenantsList';
import TenantForm from './TenantForm';
import TenantDetailsModal from './TenantDetailsModal';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Main ManageTenants Component
export default function ManageTenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await fetch(`${apiBaseUrl}/api/tenants`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        setTenants(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenantDetails = async (tenantId) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await fetch(`${apiBaseUrl}/api/tenants/${tenantId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        return data.data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching tenant details:', err);
      return null;
    }
  };

  const handleViewTenant = async (tenant) => {
    const details = await fetchTenantDetails(tenant.id);
    if (details) {
      setSelectedTenant(details);
      setShowDetailsModal(true);
    }
  };

  const handleEditTenant = async (tenant) => {
    const details = await fetchTenantDetails(tenant.id);
    if (details) {
      setSelectedTenant(details);
      setShowEditModal(true);
    }
  };

  const handleTenantCreated = () => {
    setShowCreateModal(false);
    fetchTenants();
  };

  const handleTenantUpdated = () => {
    setShowEditModal(false);
    setSelectedTenant(null);
    fetchTenants();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Tenants</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage client tenants</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
          >
            <Plus size={18} />
            Create Tenant
          </button>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Tenants</p>
                <p className="text-3xl font-bold text-gray-800">{tenants.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Tenants</p>
                <p className="text-3xl font-bold text-green-600">
                  {tenants.filter(t => t.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Trial Tenants</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {tenants.filter(t => t.status === 'trial').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div> */}

        {/* Tenants List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">All Tenants</h2>
          </div> */}
          <TenantsList
            tenants={tenants}
            loading={loading}
            onView={handleViewTenant}
            onEdit={handleEditTenant}
          />
        </div>

        {/* Create Tenant Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Tenant"
          size="large"
        >
          <TenantForm
            onSuccess={handleTenantCreated}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>

        {/* Edit Tenant Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTenant(null);
          }}
          title="Edit Tenant"
          size="large"
        >
          {selectedTenant && (
            <TenantForm
              tenant={selectedTenant}
              onSuccess={handleTenantUpdated}
              onCancel={() => {
                setShowEditModal(false);
                setSelectedTenant(null);
              }}
            />
          )}
        </Modal>

        {/* Tenant Details Modal */}
        <TenantDetailsModal
          tenant={selectedTenant}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTenant(null);
          }}
        />
      </div>
    </AdminLayout>
  );
}