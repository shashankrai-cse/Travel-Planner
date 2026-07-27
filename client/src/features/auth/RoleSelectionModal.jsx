import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useSafeUser } from './useSafeAuth';
import { useUpdateSelfRoleMutation } from '../../app/api/usersApi';

export const RoleSelectionModal = ({ isOpen, onClose }) => {
  const { user } = useSafeUser();
  const [updateSelfRole, { isLoading }] = useUpdateSelfRoleMutation();
  const [selectedRole, setSelectedRole] = useState(
    user?.publicMetadata?.role === 'vendor' ? 'vendor' : 'traveler'
  );

  const handleSaveRole = async (roleToSet) => {
    try {
      const targetRole = roleToSet || selectedRole;
      await updateSelfRole(targetRole).unwrap();

      if (onClose) onClose();
      window.location.reload();
    } catch (err) {
      alert(err?.data?.message || 'Failed to update account role');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Account Type">
      <div className="space-y-4">
        <p className="font-body text-sm text-mist-300">
          Welcome to Wayfarer! Choose how you plan to use the platform:
        </p>

        <div className="space-y-3 font-body">
          {/* User / Traveler Option */}
          <div
            onClick={() => setSelectedRole('traveler')}
            className={`p-5 rounded-2xl cursor-pointer border transition-all ${
              selectedRole === 'traveler'
                ? 'bg-sunset-500/20 border-sunset-500 shadow-lg shadow-sunset-500/10'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-display text-display-md text-white">✈️ Traveler (User)</h4>
              <Badge variant={selectedRole === 'traveler' ? 'sunset' : 'default'}>
                Book & Explore
              </Badge>
            </div>
            <p className="text-xs text-mist-300">
              Browse curated global destinations, customize day-by-day itineraries, and book multi-day travel expeditions.
            </p>
          </div>

          {/* Owner / Vendor Option */}
          <div
            onClick={() => setSelectedRole('vendor')}
            className={`p-5 rounded-2xl cursor-pointer border transition-all ${
              selectedRole === 'vendor'
                ? 'bg-sunset-500/20 border-sunset-500 shadow-lg shadow-sunset-500/10'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-display text-display-md text-white">🏨 Hotel & Tour Owner</h4>
              <Badge variant={selectedRole === 'vendor' ? 'horizon' : 'default'}>
                Host & List
              </Badge>
            </div>
            <p className="text-xs text-mist-300">
              Upload and manage your hotel rooms, star ratings, tour package offerings, custom itineraries, and pricing.
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={isLoading}
            onClick={() => handleSaveRole(selectedRole)}
          >
            {isLoading ? 'Saving...' : `Register as ${selectedRole === 'vendor' ? 'Owner' : 'User'}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RoleSelectionModal;
