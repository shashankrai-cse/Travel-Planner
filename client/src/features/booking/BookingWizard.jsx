import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PageShell from '../../components/layout/PageShell';
import StepTransition from '../../components/ui/StepTransition';
import TravelerStep from './steps/TravelerStep';
import HotelStep from './steps/HotelStep';
import ActivityStep from './steps/ActivityStep';
import ReviewStep from './steps/ReviewStep';
import PaymentStep from './steps/PaymentStep';
import { setStep } from './bookingSlice';

const steps = [
  { number: 1, label: 'Dates & Guests' },
  { number: 2, label: 'Hotel Tier' },
  { number: 3, label: 'Add-ons' },
  { number: 4, label: 'Review' },
  { number: 5, label: 'Payment' },
];

export const BookingWizard = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.booking.step);

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Step Progress Header */}
        <div className="glass rounded-full p-3 px-6 flex items-center justify-between">
          {steps.map((s) => {
            const isActive = currentStep === s.number;
            const isCompleted = currentStep > s.number;
            return (
              <div
                key={s.number}
                onClick={() => isCompleted && dispatch(setStep(s.number))}
                className={`flex items-center space-x-2 text-xs font-mono cursor-pointer transition-all ${
                  isActive
                    ? 'text-sunset-500 font-bold'
                    : isCompleted
                    ? 'text-white'
                    : 'text-mist-300 opacity-60'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                    isActive
                      ? 'bg-sunset-500 text-white'
                      : isCompleted
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-mist-300'
                  }`}
                >
                  {isCompleted ? '✓' : s.number}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <StepTransition currentStep={currentStep}>
          {currentStep === 1 && <TravelerStep />}
          {currentStep === 2 && <HotelStep />}
          {currentStep === 3 && <ActivityStep />}
          {currentStep === 4 && <ReviewStep />}
          {currentStep === 5 && <PaymentStep />}
        </StepTransition>
      </div>
    </PageShell>
  );
};

export default BookingWizard;
