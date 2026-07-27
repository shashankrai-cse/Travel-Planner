import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../../components/ui/GlassCard';
import Button from '../../../components/ui/Button';
import { setDates, setTravelers, setStep } from '../bookingSlice';

export const TravelerStep = () => {
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking);

  const [startDate, setStartDateState] = useState(booking.startDate || '2026-09-01');
  const [endDate, setEndDateState] = useState(booking.endDate || '2026-09-08');
  const [travelerList, setTravelerList] = useState(
    booking.travelers.length ? booking.travelers : [{ name: '', age: 25 }]
  );

  const handleAddTraveler = () => {
    setTravelerList([...travelerList, { name: '', age: 25 }]);
  };

  const handleRemoveTraveler = (index) => {
    if (travelerList.length > 1) {
      setTravelerList(travelerList.filter((_, i) => i !== index));
    }
  };

  const handleUpdateTraveler = (index, field, value) => {
    const updated = [...travelerList];
    updated[index] = { ...updated[index], [field]: value };
    setTravelerList(updated);
  };

  const handleNext = () => {
    dispatch(setDates({ startDate, endDate }));
    dispatch(setTravelers(travelerList));
    dispatch(setStep(2));
  };

  return (
    <GlassCard elevated className="space-y-6">
      <div>
        <span className="font-mono text-caption text-sunset-500 uppercase tracking-widest block mb-1">
          STEP 01 OF 05
        </span>
        <h2 className="font-display text-display-lg text-white">Dates & Traveler Information</h2>
        <p className="font-body text-sm text-mist-300">Select your departure dates and enter guest details.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-mist-300 mb-1">Departure Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDateState(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sunset-500"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-mist-300 mb-1">Return Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDateState(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sunset-500"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center">
          <h3 className="font-display text-display-md text-white">Travelers ({travelerList.length})</h3>
          <Button variant="ghost" size="sm" onClick={handleAddTraveler}>
            + Add Traveler
          </Button>
        </div>

        {travelerList.map((t, idx) => (
          <div key={idx} className="glass p-4 rounded-xl flex items-center gap-3">
            <span className="font-mono text-xs text-gold-400 font-bold">#{idx + 1}</span>
            <input
              type="text"
              placeholder="Full Name"
              value={t.name}
              onChange={(e) => handleUpdateTraveler(idx, 'name', e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none"
            />
            <input
              type="number"
              placeholder="Age"
              value={t.age}
              onChange={(e) => handleUpdateTraveler(idx, 'age', Number(e.target.value))}
              className="w-20 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none"
            />
            {travelerList.length > 1 && (
              <button
                onClick={() => handleRemoveTraveler(idx)}
                className="text-red-400 hover:text-red-300 p-1 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="pt-4 flex justify-end">
        <Button variant="primary" onClick={handleNext}>
          Next: Choose Hotel Tier →
        </Button>
      </div>
    </GlassCard>
  );
};

export default TravelerStep;
