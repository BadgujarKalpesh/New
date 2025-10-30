// src/pages/manage-users/ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { UserPlus } from 'lucide-react';
import Modal from './Modal';
import CreateUserForm from './CreateUserForm';
import UsersList from './UsersList';
import Can from '../../components/Can';
import { PERMISSIONS } from '../../utils/permissions';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await fetch(`${apiBaseUrl}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errorMessage || 'Failed to fetch users');
      }

      setUsers(data.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  const handleUserCreated = () => {
    handleCloseModal();
    fetchUsers();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage admin users</p>
          </div>
          <div className="flex gap-3">
            {/* Create Super Admin Button - Only shown if user has permission */}
            <Can perform={PERMISSIONS.CREATE_SUPER_ADMIN}>
              <button
                onClick={() => handleOpenModal('super')}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
              >
                <UserPlus size={18} />
                Create Super Admin
              </button>
            </Can>

            {/* Create Sub Admin Button - Only shown if user has permission */}
            <Can perform={PERMISSIONS.CREATE_SUB_ADMIN}>
              <button
                onClick={() => handleOpenModal('sub')}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
              >
                <UserPlus size={18} />
                Create Sub Admin
              </button>
            </Can>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <UsersList users={users} loading={loading} />
        </div>

        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={`Create ${modalType === 'super' ? 'Super' : 'Sub'} Admin`}
        >
          <CreateUserForm
            userType={modalType}
            onSuccess={handleUserCreated}
            onCancel={handleCloseModal}
          />
        </Modal>
      </div>
    </AdminLayout>
  );
}

export default ManageUsers;