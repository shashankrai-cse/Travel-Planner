import React from 'react';
import PageShell from '../../components/layout/PageShell';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { useGetMyBookingsQuery, useCancelBookingMutation } from '../../app/api/bookingsApi';

const fallbackBookings = [
  {
    _id: '6a66efe806db6b33a2ae1ee2',
    package: {
      title: 'Amalfi Coastal Discovery',
      images: ['https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'],
      durationDays: 7,
    },
    startDate: '2026-09-01T00:00:00.000Z',
    endDate: '2026-09-08T00:00:00.000Z',
    roomType: 'Deluxe Suite with Cliff Terrace',
    totalPrice: 1619,
    status: 'confirmed',
    paymentStatus: 'paid',
    travelers: [{ name: 'Traveler 1', age: 28 }],
  },
];

export const UserDashboard = () => {
  const { data, isLoading } = useGetMyBookingsQuery();
  const [cancelBooking] = useCancelBookingMutation();

  const bookings = data?.data !== undefined ? data.data : (isLoading ? [] : fallbackBookings);

  const handleCancel = async (id) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(id).unwrap();
      } catch (err) {
        alert(err?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  return (
    <PageShell>
      <div className="space-y-8">
        <div>
          <Badge variant="sunset" className="mb-2">TRAVELER DASHBOARD</Badge>
          <h1 className="font-display text-display-lg text-white">My Expeditions & Bookings</h1>
          <p className="font-body text-sm text-mist-300">View and manage your active and past reservations.</p>
        </div>

        {isLoading ? (
          <LoadingSkeleton count={2} />
        ) : bookings.length === 0 ? (
          <EmptyState
            caption="NO BOOKINGS YET"
            title="You haven't booked any expeditions yet"
            actionText="Browse Packages"
            onAction={() => (window.location.href = '/packages')}
          />
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => (
              <GlassCard key={b._id} elevated className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <span className="font-mono text-caption text-mist-300">BOOKING REF: #{b._id}</span>
                    <h3 className="font-display text-display-md text-white">
                      {b.package?.title || 'Custom Tour Package'}
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant={b.status === 'confirmed' ? 'gold' : b.status === 'cancelled' ? 'default' : 'sunset'}>
                      {b.status.toUpperCase()}
                    </Badge>
                    <Badge variant={b.paymentStatus === 'paid' ? 'sunset' : 'default'}>
                      {b.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-mist-300">
                  <div>
                    <span className="block text-caption text-mist-300">DATES</span>
                    <span className="text-white font-semibold">
                      {new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-caption text-mist-300">ACCOMMODATION</span>
                    <span className="text-white font-semibold">{b.roomType || 'Standard Room'}</span>
                  </div>
                  <div>
                    <span className="block text-caption text-mist-300">TOTAL COST</span>
                    <span className="text-gold-400 font-bold text-sm">${b.totalPrice}</span>
                  </div>
                </div>

                {b.status !== 'cancelled' && (
                  <div className="pt-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel(b._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Cancel Booking
                    </Button>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default UserDashboard;
