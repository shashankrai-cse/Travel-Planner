import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useSafeUser } from '../../features/auth/useSafeAuth';
import RoleSelectionModal from '../../features/auth/RoleSelectionModal';

const HAS_CLERK = Boolean(
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY &&
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_')
);

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const { user } = useSafeUser();
  const role = user?.publicMetadata?.role || 'traveler';

  const roleLabels = {
    traveler: { label: 'Traveler', variant: 'sunset' },
    vendor: { label: 'Hotel & Tour Owner', variant: 'horizon' },
    admin: { label: 'Admin', variant: 'gold' },
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-4">
        <nav className="max-w-7xl mx-auto glass rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-display text-2xl font-bold text-white tracking-tight">
              Wayfarer
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-mist-300">
            <Link to="/destinations" className="hover:text-white transition-colors">
              Destinations
            </Link>
            <Link to="/packages" className="hover:text-white transition-colors">
              Tour Packages
            </Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">
              My Bookings
            </Link>

            {role === 'vendor' && (
              <Link to="/admin" className="hover:text-horizon-600 font-semibold transition-colors">
                🏨 Owner Portal
              </Link>
            )}

            {role === 'admin' && (
              <Link to="/admin" className="hover:text-sunset-500 font-semibold transition-colors">
                ⚡ Admin Console
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Account Role Badge & Role Switcher */}
            <div
              onClick={() => setIsRoleModalOpen(true)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              title="Click to change account role"
            >
              <Badge variant={roleLabels[role]?.variant || 'sunset'}>
                {roleLabels[role]?.label || 'Traveler'} ⚙️
              </Badge>
            </div>

            {HAS_CLERK ? (
              <>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="primary" size="sm">
                      Sign In / Register
                    </Button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: 'w-9 h-9 ring-2 ring-sunset-500/50',
                      },
                    }}
                  />
                </SignedIn>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-full text-mist-300">
                  👤 {user?.fullName || 'Demo User'}
                </span>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-mist-300 hover:text-white p-2"
            >
              ☰
            </button>
          </div>
        </nav>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass rounded-2xl mt-2 p-6 flex flex-col space-y-4 text-mist-300">
            <Link
              to="/destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white"
            >
              Destinations
            </Link>
            <Link
              to="/packages"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white"
            >
              Tour Packages
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white"
            >
              My Bookings
            </Link>
            {role === 'vendor' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-horizon-600 font-semibold"
              >
                🏨 Owner Portal
              </Link>
            )}
            {role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sunset-500 font-semibold"
              >
                ⚡ Admin Console
              </Link>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsRoleModalOpen(true);
              }}
              className="text-left text-xs font-mono text-gold-400 py-2"
            >
              ⚙️ Switch Account Role ({role.toUpperCase()})
            </button>
          </div>
        )}
      </header>

      {/* Role Selector Modal */}
      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
