import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const HAS_CLERK = Boolean(
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY &&
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_')
);

export const AuthLanding = ({ onDemoLogin }) => {
  const [authMode, setAuthMode] = useState('signIn'); // 'signIn' | 'signUp'

  return (
    <div className="min-h-screen bg-dusk-950 text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sunset-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-horizon-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center z-10 py-4">
        <div className="flex items-center space-x-3">
          <span className="font-display text-3xl font-bold tracking-tight text-white">
            Wayfarer
          </span>
          <Badge variant="sunset">PRIVATE TRAVEL PLATFORM</Badge>
        </div>
      </header>

      {/* Main Hero & Auth Container */}
      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto z-10 py-8">
        {/* Left Column: Branding & Tagline */}
        <div className="lg:col-span-6 space-y-6">
          <Badge variant="gold">EXCLUSIVE ACCESS</Badge>
          <h1 className="font-display text-display-xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-mist-300 to-sunset-500">
            Journeys Crafted for the Curious Mind
          </h1>
          <p className="font-body text-body-lg text-mist-300 max-w-lg">
            Welcome to Wayfarer. Please sign in or register to explore handpicked global destinations, host luxury stays, or book multi-day expeditions.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs font-mono text-mist-300">
            <div className="space-y-1">
              <span className="text-sunset-500 font-bold block">✈️ FOR TRAVELERS</span>
              <span>Discover & book multi-day tour packages with custom itineraries.</span>
            </div>
            <div className="space-y-1">
              <span className="text-horizon-600 font-bold block">🏨 FOR OWNERS</span>
              <span>List hotel room tiers, host expeditions, & manage bookings.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In / Sign Up Card */}
        <div className="lg:col-span-6 flex justify-center">
          <GlassCard elevated className="w-full max-w-md p-6 sm:p-8 space-y-6 border border-white/20 backdrop-blur-2xl">
            {HAS_CLERK ? (
              <div className="space-y-4">
                <div className="flex border-b border-white/10 pb-3 justify-center space-x-6 font-display text-lg font-bold">
                  <button
                    onClick={() => setAuthMode('signIn')}
                    className={`transition-colors ${
                      authMode === 'signIn' ? 'text-sunset-500 border-b-2 border-sunset-500 pb-1' : 'text-mist-300 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setAuthMode('signUp')}
                    className={`transition-colors ${
                      authMode === 'signUp' ? 'text-sunset-500 border-b-2 border-sunset-500 pb-1' : 'text-mist-300 hover:text-white'
                    }`}
                  >
                    Register Account
                  </button>
                </div>

                <div className="flex justify-center">
                  {authMode === 'signIn' ? (
                    <SignIn routing="hash" />
                  ) : (
                    <SignUp routing="hash" />
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 py-4">
                <Badge variant="sunset" className="mx-auto">DEMO MODE ACTIVE</Badge>
                <h3 className="font-display text-display-md text-white">Sign In to Continue</h3>
                <p className="font-body text-xs text-mist-300">
                  Authentication is active. Click below to sign in and choose your role (User or Hotel Owner).
                </p>
                <Button variant="primary" size="lg" className="w-full" onClick={onDemoLogin}>
                  Sign In / Access Platform →
                </Button>
              </div>
            )}
          </GlassCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center font-mono text-xs text-mist-300 z-10 py-4">
        Wayfarer Platform &copy; 2026. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLanding;
