import React, { useState } from 'react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { useSafeUser } from '../auth/useSafeAuth';
import {
  useGetDestinationsQuery,
  useCreateDestinationMutation,
  useDeleteDestinationMutation,
} from '../../app/api/destinationsApi';
import {
  useGetPackagesQuery,
  useCreatePackageMutation,
  useDeletePackageMutation,
} from '../../app/api/packagesApi';
import {
  useGetHotelsQuery,
  useCreateHotelMutation,
  useDeleteHotelMutation,
} from '../../app/api/hotelsApi';
import {
  useGetAllUsersAdminQuery,
  useUpdateUserRoleAdminMutation,
} from '../../app/api/usersApi';

export const AdminDashboard = () => {
  const { user } = useSafeUser();
  const currentRole = user?.publicMetadata?.role || 'vendor';

  const [activeTab, setActiveTab] = useState(currentRole === 'vendor' ? 'hotels' : 'destinations');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // RTK Query Hooks
  const { data: destRes, isLoading: loadingDest } = useGetDestinationsQuery();
  const { data: packRes, isLoading: loadingPack } = useGetPackagesQuery();
  const { data: hotelRes, isLoading: loadingHotel } = useGetHotelsQuery();
  const { data: usersRes, isLoading: loadingUsers } = useGetAllUsersAdminQuery(undefined, {
    skip: currentRole !== 'admin',
  });

  const [createDestination] = useCreateDestinationMutation();
  const [deleteDestination] = useDeleteDestinationMutation();

  const [createPackage] = useCreatePackageMutation();
  const [deletePackage] = useDeletePackageMutation();

  const [createHotel] = useCreateHotelMutation();
  const [deleteHotel] = useDeleteHotelMutation();

  const [updateUserRoleAdmin] = useUpdateUserRoleAdminMutation();

  const destinations = destRes?.data || [];
  const packages = packRes?.data || [];
  const hotels = hotelRes?.data || [];
  const usersList = usersRes?.data || [
    { _id: 'u1', name: 'Demo Traveler', email: 'traveler@example.com', role: 'traveler' },
    { _id: 'u2', name: 'Demo Hotel Owner', email: 'owner@example.com', role: 'vendor' },
    { _id: 'u3', name: 'Demo System Admin', email: 'admin@example.com', role: 'admin' },
  ];

  // Form states
  const [destForm, setDestForm] = useState({ name: '', country: '', description: '', images: '' });
  const [packForm, setPackForm] = useState({
    title: '',
    destination: '',
    description: '',
    basePrice: 999,
    durationDays: 5,
    maxGroupSize: 12,
  });
  const [hotelForm, setHotelForm] = useState({
    name: '',
    destination: '',
    address: '',
    starRating: 4,
    roomTypeName: 'Deluxe Room',
    roomPrice: 150,
    roomCapacity: 2,
    totalRooms: 10,
  });

  const handleCreateDestination = async (e) => {
    e.preventDefault();
    try {
      const imgArray = destForm.images
        ? destForm.images.split(',').map((s) => s.trim())
        : ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'];
      await createDestination({
        name: destForm.name,
        country: destForm.country,
        description: destForm.description,
        images: imgArray,
      }).unwrap();
      setIsModalOpen(false);
      setDestForm({ name: '', country: '', description: '', images: '' });
    } catch (err) {
      alert(err?.data?.message || 'Failed to create destination');
    }
  };

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    try {
      await createPackage({
        ...packForm,
        basePrice: Number(packForm.basePrice),
        durationDays: Number(packForm.durationDays),
        maxGroupSize: Number(packForm.maxGroupSize),
        images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'],
      }).unwrap();
      setIsModalOpen(false);
      setPackForm({ title: '', destination: '', description: '', basePrice: 999, durationDays: 5, maxGroupSize: 12 });
    } catch (err) {
      alert(err?.data?.message || 'Failed to create package');
    }
  };

  const handleCreateHotel = async (e) => {
    e.preventDefault();
    try {
      await createHotel({
        name: hotelForm.name,
        destination: hotelForm.destination,
        address: hotelForm.address,
        starRating: Number(hotelForm.starRating),
        roomTypes: [
          {
            name: hotelForm.roomTypeName,
            pricePerNight: Number(hotelForm.roomPrice),
            capacity: Number(hotelForm.roomCapacity),
            totalRooms: Number(hotelForm.totalRooms),
          },
        ],
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
      }).unwrap();
      setIsModalOpen(false);
      setHotelForm({
        name: '',
        destination: '',
        address: '',
        starRating: 4,
        roomTypeName: 'Deluxe Room',
        roomPrice: 150,
        roomCapacity: 2,
        totalRooms: 10,
      });
    } catch (err) {
      alert(err?.data?.message || 'Failed to create hotel');
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await updateUserRoleAdmin({ id: userId, role: newRole }).unwrap();
      alert(`User role updated to ${newRole}`);
    } catch (err) {
      alert(err?.data?.message || 'Failed to update user role');
    }
  };

  const availableTabs = currentRole === 'admin'
    ? ['destinations', 'packages', 'hotels', 'users']
    : ['hotels', 'packages', 'destinations'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant={currentRole === 'admin' ? 'gold' : 'horizon'} className="mb-2">
            {currentRole === 'admin' ? 'SYSTEM ADMIN CONSOLE' : 'HOTEL & TOUR OWNER PORTAL'}
          </Badge>
          <h1 className="font-display text-display-lg text-white">
            {currentRole === 'admin' ? 'Global Platform Management' : 'Property & Expedition Listings'}
          </h1>
          <p className="text-mist-300 font-body text-sm">
            {currentRole === 'admin'
              ? 'Manage system users, owner catalog listings, tour packages, and hotels.'
              : 'Upload and manage your hotel rooms, star ratings, and tour package offerings.'}
          </p>
        </div>
        {activeTab !== 'users' && (
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Add New {activeTab.slice(0, -1)}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="glass rounded-full p-1.5 inline-flex space-x-2">
        {availableTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-body text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-sunset-500 text-white shadow-lg shadow-sunset-500/30'
                : 'text-mist-300 hover:text-white'
            }`}
          >
            {tab === 'users' ? '👥 Users & Roles' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'destinations' && (
        <GlassCard>
          <h3 className="font-display text-display-md text-white mb-4">Destinations</h3>
          {loadingDest ? (
            <LoadingSkeleton count={3} />
          ) : destinations.length === 0 ? (
            <EmptyState
              caption="CATALOG EMPTY"
              title="No destinations created yet"
              actionText="Create Destination"
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-caption font-mono text-mist-300 uppercase">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-body text-sm text-white">
                  {destinations.map((dest) => (
                    <tr key={dest._id} className="hover:bg-white/5">
                      <td className="py-3 px-4 font-semibold">{dest.name}</td>
                      <td className="py-3 px-4">{dest.country}</td>
                      <td className="py-3 px-4 font-mono text-xs text-mist-300">{dest.slug}</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteDestination(dest._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {activeTab === 'packages' && (
        <GlassCard>
          <h3 className="font-display text-display-md text-white mb-4">Tour Packages</h3>
          {loadingPack ? (
            <LoadingSkeleton count={3} />
          ) : packages.length === 0 ? (
            <EmptyState
              caption="CATALOG EMPTY"
              title="No tour packages created yet"
              actionText="Create Package"
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-caption font-mono text-mist-300 uppercase">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Base Price</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-body text-sm text-white">
                  {packages.map((pkg) => (
                    <tr key={pkg._id} className="hover:bg-white/5">
                      <td className="py-3 px-4 font-semibold">{pkg.title}</td>
                      <td className="py-3 px-4">{pkg.destination?.name || 'Unlinked'}</td>
                      <td className="py-3 px-4 font-mono text-xs">{pkg.durationDays} Days</td>
                      <td className="py-3 px-4 font-mono text-gold-400">${pkg.basePrice}</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePackage(pkg._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {activeTab === 'hotels' && (
        <GlassCard>
          <h3 className="font-display text-display-md text-white mb-4">Hotels & Accommodations</h3>
          {loadingHotel ? (
            <LoadingSkeleton count={3} />
          ) : hotels.length === 0 ? (
            <EmptyState
              caption="CATALOG EMPTY"
              title="No hotels added yet"
              actionText="Add Hotel"
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-caption font-mono text-mist-300 uppercase">
                    <th className="py-3 px-4">Hotel Name</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Room Types</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-body text-sm text-white">
                  {hotels.map((htl) => (
                    <tr key={htl._id} className="hover:bg-white/5">
                      <td className="py-3 px-4 font-semibold">{htl.name}</td>
                      <td className="py-3 px-4">{htl.destination?.name || 'Unlinked'}</td>
                      <td className="py-3 px-4 font-mono text-gold-400">{'★'.repeat(htl.starRating)}</td>
                      <td className="py-3 px-4 text-xs font-mono">{htl.roomTypes?.length || 0} tiers</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHotel(htl._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {/* Users & Roles Management Tab (Admin Only) */}
      {activeTab === 'users' && (
        <GlassCard>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-display-md text-white">Users & Role Permissions</h3>
            <Badge variant="gold">System Admin Access</Badge>
          </div>
          {loadingUsers ? (
            <LoadingSkeleton count={3} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-caption font-mono text-mist-300 uppercase">
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Current Role</th>
                    <th className="py-3 px-4 text-right">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-body text-sm text-white">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-white/5">
                      <td className="py-3 px-4 font-semibold">{u.name || 'Wayfarer Member'}</td>
                      <td className="py-3 px-4 font-mono text-xs text-mist-300">{u.email}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            u.role === 'admin'
                              ? 'gold'
                              : u.role === 'vendor'
                              ? 'horizon'
                              : 'sunset'
                          }
                        >
                          {u.role ? u.role.toUpperCase() : 'TRAVELER'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={u.role || 'traveler'}
                          onChange={(e) => handleUserRoleChange(u._id, e.target.value)}
                          className="bg-dusk-950 border border-white/20 rounded-lg px-3 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
                        >
                          <option value="traveler">Traveler (User)</option>
                          <option value="vendor">Hotel / Tour Owner (Vendor)</option>
                          <option value="admin">System Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {/* Creation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Add New ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}`}
      >
        {activeTab === 'destinations' && (
          <form onSubmit={handleCreateDestination} className="space-y-4 font-body">
            <div>
              <label className="block text-xs font-mono text-mist-300 mb-1">Destination Name</label>
              <input
                type="text"
                required
                value={destForm.name}
                onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
                placeholder="e.g. Amalfi Coast"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-mist-300 mb-1">Country</label>
              <input
                type="text"
                required
                value={destForm.country}
                onChange={(e) => setDestForm({ ...destForm, country: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
                placeholder="e.g. Italy"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-mist-300 mb-1">Description</label>
              <textarea
                required
                rows={3}
                value={destForm.description}
                onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
                placeholder="Detailed description of the destination..."
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-mist-300 mb-1">Image URLs (comma separated)</label>
              <input
                type="text"
                value={destForm.images}
                onChange={(e) => setDestForm({ ...destForm, images: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
                placeholder="https://..."
              />
            </div>
            <div className="pt-4 flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Destination
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'packages' && (
          <form onSubmit={handleCreatePackage} className="space-y-4 font-body">
            <div>
              <label className="block text-xs font-mono text-mist-300 mb-1">Package Title</label>
              <input
                type="text"
                required
                value={packForm.title}
                onChange={(e) => setPackForm({ ...packForm, title: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
                placeholder="e.g. Amalfi Coastal Discovery"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-mist-300 mb-1">Destination</label>
              <select
                required
                value={packForm.destination}
                onChange={(e) => setPackForm({ ...packForm, destination: e.target.value })}
                className="w-full bg-dusk-950 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
              >
                <option value="">Select a Destination</option>
                {destinations.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.country})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-mist-300 mb-1">Base Price ($)</label>
                <input
                  type="number"
                  required
                  value={packForm.basePrice}
                  onChange={(e) => setPackForm({ ...packForm, basePrice: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-mist-300 mb-1">Duration (Days)</label>
                <input
                  type="number"
                  required
                  value={packForm.durationDays}
                  onChange={(e) => setPackForm({ ...packForm, durationDays: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-mist-300 mb-1">Max Travelers</label>
                <input
                  type="number"
                  required
                  value={packForm.maxGroupSize}
                  onChange={(e) => setPackForm({ ...packForm, maxGroupSize: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-mist-300 mb-1">Description</label>
              <textarea
                required
                rows={3}
                value={packForm.description}
                onChange={(e) => setPackForm({ ...packForm, description: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
                placeholder="Overview of the tour experience..."
              />
            </div>
            <div className="pt-4 flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Package
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'hotels' && (
          <form onSubmit={handleCreateHotel} className="space-y-4 font-body">
            <div>
              <label className="block text-xs font-mono text-mist-300 mb-1">Hotel Name</label>
              <input
                type="text"
                required
                value={hotelForm.name}
                onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
                placeholder="e.g. Grand Hotel Positano"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-mist-300 mb-1">Destination</label>
              <select
                required
                value={hotelForm.destination}
                onChange={(e) => setHotelForm({ ...hotelForm, destination: e.target.value })}
                className="w-full bg-dusk-950 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
              >
                <option value="">Select a Destination</option>
                {destinations.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.country})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-mist-300 mb-1">Address</label>
              <input
                type="text"
                required
                value={hotelForm.address}
                onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
                placeholder="e.g. Via Cristoforo Colombo 2, Positano"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-mist-300 mb-1">Room Tier Name</label>
                <input
                  type="text"
                  required
                  value={hotelForm.roomTypeName}
                  onChange={(e) => setHotelForm({ ...hotelForm, roomTypeName: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-mist-300 mb-1">Price / Night ($)</label>
                <input
                  type="number"
                  required
                  value={hotelForm.roomPrice}
                  onChange={(e) => setHotelForm({ ...hotelForm, roomPrice: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sunset-500"
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Hotel
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
