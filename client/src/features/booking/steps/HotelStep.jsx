import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../../components/ui/GlassCard';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { setHotelSelection, setStep } from '../bookingSlice';

const mockHotels = [
  {
    _id: 'h1',
    name: 'Villa Positano Resort',
    starRating: 5,
    address: 'Via Cristoforo Colombo 2, Positano',
    roomTypes: [
      { name: 'Standard Ocean View', pricePerNight: 0, capacity: 2 },
      { name: 'Deluxe Suite with Cliff Terrace', pricePerNight: 120, capacity: 2 },
      { name: 'Penthouse Villa Tier', pricePerNight: 250, capacity: 4 },
    ],
  },
];

export const HotelStep = () => {
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking);
  const pkg = booking.selectedPackage;

  const [selectedRoom, setSelectedRoom] = useState(booking.selectedRoomType || 'Standard Ocean View');
  const [selectedHotel] = useState(mockHotels[0]);

  const handleNext = () => {
    const room = selectedHotel.roomTypes.find((r) => r.name === selectedRoom);
    dispatch(
      setHotelSelection({
        hotel: selectedHotel._id,
        roomType: room.name,
        pricePerNight: room.pricePerNight,
        nights: pkg?.durationDays || 7,
      })
    );
    dispatch(setStep(3));
  };

  return (
    <GlassCard elevated className="space-y-6">
      <div>
        <span className="font-mono text-caption text-sunset-500 uppercase tracking-widest block mb-1">
          STEP 02 OF 05
        </span>
        <h2 className="font-display text-display-lg text-white">Select Accommodation Tier</h2>
        <p className="font-body text-sm text-mist-300">Choose your preferred room tier for the duration of the trip.</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-display-md text-white">{selectedHotel.name}</h3>
        <p className="font-mono text-xs text-mist-300">📍 {selectedHotel.address}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {selectedHotel.roomTypes.map((rt, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedRoom(rt.name)}
              className={`glass p-5 rounded-2xl cursor-pointer flex flex-col justify-between space-y-4 transition-all ${
                selectedRoom === rt.name
                  ? 'border-2 border-sunset-500 bg-sunset-500/10 shadow-lg'
                  : 'hover:border-white/30'
              }`}
            >
              <div>
                <Badge variant={selectedRoom === rt.name ? 'sunset' : 'default'} className="mb-2">
                  {rt.pricePerNight === 0 ? 'Included' : `+$${rt.pricePerNight}/night`}
                </Badge>
                <h4 className="font-display text-display-md text-white">{rt.name}</h4>
                <p className="font-mono text-xs text-mist-300 mt-1">Up to {rt.capacity} guests</p>
              </div>

              <div className="font-mono text-xs text-gold-400 font-bold">
                {rt.pricePerNight === 0 ? '$0 Upgrade' : `+$${rt.pricePerNight * (pkg?.durationDays || 7)} Total`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 flex justify-between">
        <Button variant="secondary" onClick={() => dispatch(setStep(1))}>
          ← Back
        </Button>
        <Button variant="primary" onClick={handleNext}>
          Next: Optional Add-ons →
        </Button>
      </div>
    </GlassCard>
  );
};

export default HotelStep;
