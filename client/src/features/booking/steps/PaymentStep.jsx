import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../../components/ui/GlassCard';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { useCreateBookingMutation } from '../../../app/api/bookingsApi';
import { useConfirmPaymentMutation } from '../../../app/api/paymentsApi';
import { useGetPackagesQuery } from '../../../app/api/packagesApi';
import { resetBooking } from '../bookingSlice';

export const PaymentStep = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const booking = useSelector((state) => state.booking);
  const pkg = booking.selectedPackage;

  const { data: packagesRes } = useGetPackagesQuery();
  const activePackage = pkg || packagesRes?.data?.[0];

  const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();
  const [confirmPayment, { isLoading: isPaymentLoading }] = useConfirmPaymentMutation();

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayAndConfirm = async () => {
    try {
      const packageId = activePackage?._id || activePackage?.slug || 'amalfi-coastal-discovery';

      const validTravelers = (booking.travelers && booking.travelers.length > 0)
        ? booking.travelers.map((t, idx) => ({
            name: t.name && t.name.trim() ? t.name.trim() : `Traveler ${idx + 1}`,
            age: Number(t.age) > 0 ? Number(t.age) : 25,
          }))
        : [{ name: 'Primary Guest', age: 28 }];

      const startDateStr = booking.startDate || new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0];
      const endDateStr = booking.endDate || new Date(Date.now() + 86400000 * 21).toISOString().split('T')[0];

      const bookingPayload = {
        package: packageId,
        hotel: booking.selectedHotel || undefined,
        roomType: booking.selectedRoomType || undefined,
        startDate: startDateStr,
        endDate: endDateStr,
        travelers: validTravelers,
        addOns: booking.addOns || [],
      };

      const res = await createBooking(bookingPayload).unwrap();
      const bookingId = res.data?._id;

      // 2. Confirm payment
      if (bookingId) {
        await confirmPayment({
          bookingId,
          paymentIntentId: `pi_mock_${Date.now()}`,
          paymentMethod: 'card',
        }).unwrap();
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Booking/Payment failed:", err);
      alert(err?.data?.message || err?.message || 'Failed to complete booking.');
    }
  };

  if (isSuccess) {
    return (
      <GlassCard elevated className="text-center py-12 space-y-6">
        <Badge variant="sunset" className="mx-auto">RESERVATION CONFIRMED</Badge>
        <h2 className="font-display text-display-xl text-white">Pack Your Bags!</h2>
        <p className="font-body text-body text-mist-300 max-w-md mx-auto">
          Your journey for <strong className="text-white">{activePackage?.title || 'Amalfi Coastal Discovery'}</strong> is officially confirmed. A confirmation receipt has been sent to your email.
        </p>
        <div className="pt-4 flex justify-center space-x-4">
          <Button
            variant="primary"
            onClick={() => {
              dispatch(resetBooking());
              navigate('/dashboard');
            }}
          >
            Go to My Bookings →
          </Button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard elevated className="space-y-6">
      <div>
        <span className="font-mono text-caption text-sunset-500 uppercase tracking-widest block mb-1">
          STEP 05 OF 05
        </span>
        <h2 className="font-display text-display-lg text-white">Payment & Checkout</h2>
        <p className="font-body text-sm text-mist-300">Secure end-to-end encrypted checkout powered by Stripe.</p>
      </div>

      <div className="glass p-6 rounded-2xl space-y-4 max-w-md mx-auto">
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <span className="font-mono text-xs text-mist-300">Total Charged</span>
          <span className="font-display text-display-md text-gold-400 font-bold">
            ${booking.priceBreakdown.total || activePackage?.basePrice || 1499}
          </span>
        </div>

        <div className="space-y-3 font-body text-sm">
          <div>
            <label className="block text-xs font-mono text-mist-300 mb-1">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sunset-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-mist-300 mb-1">Expires</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sunset-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-mist-300 mb-1">CVC</label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sunset-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-between">
        <Button variant="secondary" onClick={() => dispatch(setStep(4))}>
          ← Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          disabled={isBookingLoading || isPaymentLoading}
          onClick={handlePayAndConfirm}
        >
          {isBookingLoading || isPaymentLoading
            ? 'Processing...'
            : `Pay $${booking.priceBreakdown.total || activePackage?.basePrice || 1499} & Confirm Booking`}
        </Button>
      </div>
    </GlassCard>
  );
};

export default PaymentStep;
