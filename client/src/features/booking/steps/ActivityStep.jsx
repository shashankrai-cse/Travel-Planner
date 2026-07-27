import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../../components/ui/GlassCard';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { toggleAddOn, setStep } from '../bookingSlice';

const availableAddOns = [
  { name: 'Helicopter Transfer to Sorrento', price: 290, description: 'Scenic 15-minute aerial transfer over the bay.' },
  { name: 'Private Sommelier Wine Tasting', price: 150, description: 'Exclusive 4-course wine pairing at historic Ravello cellar.' },
  { name: 'Luxury Spa & Thermal Baths Pass', price: 95, description: 'Full day pass to volcanic spa thermal waters.' },
  { name: 'Professional Photographer Session', price: 180, description: '2-hour photo shoot at iconic cliffside viewpoints.' },
];

export const ActivityStep = () => {
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking);
  const selectedAddOns = booking.addOns || [];

  const isSelected = (name) => selectedAddOns.some((item) => item.name === name);

  return (
    <GlassCard elevated className="space-y-6">
      <div>
        <span className="font-mono text-caption text-sunset-500 uppercase tracking-widest block mb-1">
          STEP 03 OF 05
        </span>
        <h2 className="font-display text-display-lg text-white">Customize Experience & Add-ons</h2>
        <p className="font-body text-sm text-mist-300">Elevate your expedition with curated private excursions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableAddOns.map((item, idx) => {
          const active = isSelected(item.name);
          return (
            <div
              key={idx}
              onClick={() => dispatch(toggleAddOn(item))}
              className={`glass p-5 rounded-2xl cursor-pointer flex flex-col justify-between space-y-3 transition-all ${
                active ? 'border-2 border-sunset-500 bg-sunset-500/10' : 'hover:border-white/30'
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-display text-display-md text-white">{item.name}</h4>
                <Badge variant={active ? 'sunset' : 'gold'}>+${item.price}</Badge>
              </div>
              <p className="font-body text-xs text-mist-300">{item.description}</p>
              <div className="font-mono text-xs font-semibold text-sunset-500 pt-2">
                {active ? '✓ Selected' : '+ Add to Booking'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 flex justify-between">
        <Button variant="secondary" onClick={() => dispatch(setStep(2))}>
          ← Back
        </Button>
        <Button variant="primary" onClick={() => dispatch(setStep(4))}>
          Next: Review Summary →
        </Button>
      </div>
    </GlassCard>
  );
};

export default ActivityStep;
