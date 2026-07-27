import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PageShell from './components/layout/PageShell';
import GlassCard from './components/ui/GlassCard';
import StackedDeck from './components/ui/StackedDeck';
import Button from './components/ui/Button';
import Badge from './components/ui/Badge';
import ProtectedRoute from './features/auth/ProtectedRoute';
import RoleGate from './features/auth/RoleGate';
import AuthLanding from './features/auth/AuthLanding';
import { useSafeAuth } from './features/auth/useSafeAuth';
import AdminDashboard from './features/admin/AdminDashboard';
import DestinationList from './features/destinations/DestinationList';
import DestinationDetail from './features/destinations/DestinationDetail';
import PackageList from './features/packages/PackageList';
import PackageDetail from './features/packages/PackageDetail';
import BookingWizard from './features/booking/BookingWizard';
import UserDashboard from './features/dashboard/UserDashboard';
import { useGetDestinationsQuery } from './app/api/destinationsApi';

function Home() {
  const { data: destRes } = useGetDestinationsQuery();
  const destinations = destRes?.data?.length
    ? destRes.data.map((d) => ({
        id: d._id,
        slug: d.slug,
        name: d.name,
        country: d.country,
        image: d.images?.[0] || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
        price: 1499,
      }))
    : [
        { id: '1', slug: 'amalfi-coast', name: 'Amalfi Coast', country: 'Italy', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80', price: 1499 },
        { id: '2', slug: 'kyoto-sanctuary', name: 'Kyoto Sanctuary', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', price: 1899 },
        { id: '3', slug: 'santorini-island', name: 'Santorini Sunset', country: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80', price: 1299 },
      ];

  return (
    <PageShell>
      {/* Hero Section */}
      <div className="relative py-16 sm:py-24 text-center flex flex-col items-center">
        <Badge variant="gold" className="mb-4">
          EXPLORE THE UNCHARTED
        </Badge>
        <h1 className="font-display text-display-xl font-bold max-w-4xl tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-mist-300 to-sunset-500">
          Journeys Crafted for the Curious Mind
        </h1>
        <p className="font-body text-body-lg text-mist-300 max-w-2xl mb-8">
          Discover handpicked destinations, custom-tailor day-by-day itineraries, and secure your next escape on a dusk-inspired floating glass canvas.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/packages">
            <Button variant="primary" size="lg">
              Explore Packages
            </Button>
          </Link>
          <Link to="/destinations">
            <Button variant="secondary" size="lg">
              Browse Destinations
            </Button>
          </Link>
        </div>
      </div>

      {/* Signature Motif: Fanned Deck */}
      <div className="my-16">
        <div className="text-center mb-8">
          <span className="font-mono text-caption text-sunset-500 uppercase tracking-widest">
            SIGNATURE EXPERIENCE
          </span>
          <h2 className="font-display text-display-lg text-white mt-1">
            Featured Destinations
          </h2>
        </div>

        <StackedDeck
          items={destinations}
          renderItem={(item) => (
            <Link to={`/destinations/${item.slug || item.id}`}>
              <GlassCard elevated className="h-80 flex flex-col justify-between overflow-hidden relative group">
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dusk-950 via-dusk-950/40 to-transparent" />
                <div className="relative z-10 flex justify-between items-start">
                  <Badge variant="horizon">{item.country}</Badge>
                  <span className="font-mono text-sm text-gold-400 font-semibold">${item.price}</span>
                </div>
                <div className="relative z-10">
                  <h3 className="font-display text-display-md text-white mb-1">{item.name}</h3>
                  <span className="font-mono text-caption text-mist-300">View Packages →</span>
                </div>
              </GlassCard>
            </Link>
          )}
        />
      </div>
    </PageShell>
  );
}

function App() {
  const { isLoaded, isSignedIn } = useSafeAuth();
  const [demoLoggedIn, setDemoLoggedIn] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-dusk-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sunset-500"></div>
      </div>
    );
  }

  // Gate unauthenticated visitors: show AuthLanding page until logged in
  if (!isSignedIn && !demoLoggedIn) {
    return <AuthLanding onDemoLogin={() => setDemoLoggedIn(true)} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<DestinationList />} />
        <Route path="/destinations/:slug" element={<DestinationDetail />} />
        <Route path="/packages" element={<PackageList />} />
        <Route path="/packages/:slug" element={<PackageDetail />} />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <BookingWizard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleGate allowedRoles={['admin', 'vendor']}>
                <PageShell>
                  <AdminDashboard />
                </PageShell>
              </RoleGate>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
