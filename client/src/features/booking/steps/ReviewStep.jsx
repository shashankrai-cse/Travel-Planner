import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../../components/ui/GlassCard';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { setStep } from '../bookingSlice';

export const ReviewStep = () => {
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking);
  const pkg = booking.selectedPackage;
  const price = booking.priceBreakdown;

  return (
    <GlassCard elevated className="space-y-6">
      <div>
        <span className="font-mono text-caption text-sunset-500 uppercase tracking-widest block mb-1">
          STEP 04 OF 05
        </span>
        <h2 className="font-display text-display-lg text-white">Review Expedition Summary</h2>
        <p className="font-body text-sm text-mist-300">Verify your reservation details before proceeding to payment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body text-sm">
        {/* Left Column: Trip Specs */}
        <div className="glass p-5 rounded-2xl space-y-4">
          <Badge variant="horizon">PACKAGE DETAILS</Badge>
          <h3 className="font-display text-display-md text-white">{pkg?.title || 'Amalfi Coastal Discovery'}</h3>
          <div className="space-y-2 text-mist-300 font-mono text-xs">
            <p>📍 Destination: {pkg?.destination?.name || 'Amalfi Coast'}</p>
            <p>🗓 Departure: {booking.startDate || '2026-09-01'} to {booking.endDate || '2026-09-08'}</p>
            <p>🏨 Room Tier: {booking.selectedRoomType || 'Standard Ocean View'}</p>
            <p>👥 Guests: {booking.travelers?.length || 1} Person(s)</p>
          </div>

          {booking.addOns && booking.addOns.length > 0 && (
            <div className="pt-2 border-t border-white/10">
              <span className="font-mono text-xs text-sunset-500 uppercase block mb-1">Selected Add-ons:</span>
              <ul className="list-disc list-inside text-xs text-mist-300">
                {booking.addOns.map((a, i) => (
                  <li key={i}>{a.name} (+${a.price})</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Price Breakdown */}
        <div className="glass p-5 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3 font-mono text-xs text-mist-300">
            <Badge variant="gold">PRICING BREAKDOWN</Badge>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span>Base Package ({booking.travelers?.length || 1} guest):</span>
              <span className="text-white font-bold">${price.base}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span>Room Upgrade:</span>
              <span className="text-white font-bold">${price.hotel}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span>Selected Add-ons:</span>
              <span className="text-white font-bold">${price.addOns}</span>
            </div>
            <div className="flex justify-between py-2 text-sm text-white font-bold">
              <span>Total Amount:</span>
              <span className="text-gold-400 font-display text-lg">${price.total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-between">
        <Button variant="secondary" onClick={() => dispatch(setStep(3))}>
          ← Back
        </Button>
        <Button variant="primary" onClick={() => dispatch(setStep(5))}>
          Proceed to Payment →
        </Button>
      </div>
    </GlassCard>
  );
};

export default ReviewStep;
