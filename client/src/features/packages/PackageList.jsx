import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { useGetPackagesQuery } from '../../app/api/packagesApi';
import { useGetDestinationsQuery } from '../../app/api/destinationsApi';

const fallbackPackages = [
  {
    _id: 'p1',
    title: 'Amalfi Coastal Discovery',
    slug: 'amalfi-coastal-discovery',
    destination: { name: 'Amalfi Coast', country: 'Italy' },
    basePrice: 1499,
    durationDays: 7,
    maxGroupSize: 10,
    description: 'Spend 7 magical days walking the Path of the Gods, exploring Ravello, and sailing around Capri.',
    images: ['https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'],
    includedServices: ['Guided Hikes', 'Boat Transfers', 'Daily Breakfast', 'Hotel Accommodations'],
  },
  {
    _id: 'p2',
    title: 'Kyoto Zen & Temple Pilgrimage',
    slug: 'kyoto-zen-pilgrimage',
    destination: { name: 'Kyoto Sanctuary', country: 'Japan' },
    basePrice: 1899,
    durationDays: 8,
    maxGroupSize: 8,
    description: 'Immerse yourself in Kyoto’s sacred temples, bamboo groves, tea ceremonies, and authentic ryokan stays.',
    images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'],
    includedServices: ['Private Guide', 'Ryokan Stay', 'Tea Ceremony', 'Bullet Train Passes'],
  },
  {
    _id: 'p3',
    title: 'Santorini Sunset & Wine Tasting',
    slug: 'santorini-sunset-wine',
    destination: { name: 'Santorini Island', country: 'Greece' },
    basePrice: 1299,
    durationDays: 5,
    maxGroupSize: 12,
    description: 'Experience breathtaking volcanic caldera views, exclusive wine tastings, and sunset catamaran cruises.',
    images: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80'],
    includedServices: ['Catamaran Cruise', 'Winery Tours', 'Boutique Hotel', 'Caldera Transfers'],
  },
];

export const PackageList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDest, setSelectedDest] = useState('');
  const [maxPrice, setMaxPrice] = useState(3000);

  const { data: packRes, isLoading: loadingPack } = useGetPackagesQuery();
  const { data: destRes } = useGetDestinationsQuery();

  const destinations = destRes?.data || [];
  const rawPackages = packRes?.data && packRes.data.length > 0 ? packRes.data : fallbackPackages;

  const packages = rawPackages.filter((pkg) => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDest = !selectedDest || pkg.destination?._id === selectedDest || pkg.destination?.name === selectedDest;
    const matchesPrice = pkg.basePrice <= maxPrice;
    return matchesSearch && matchesDest && matchesPrice;
  });

  return (
    <PageShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center py-6">
          <Badge variant="sunset" className="mb-3">CURATED EXPEDITIONS</Badge>
          <h1 className="font-display text-display-xl font-bold text-white mb-4">
            Discover Your Next Adventure
          </h1>
          <p className="font-body text-body-lg text-mist-300 max-w-2xl mx-auto">
            Choose from all-inclusive multi-day packages designed by experienced travel curators.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <GlassCard className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block font-mono text-caption text-mist-300 uppercase mb-2">Search Packages</label>
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-mist-300 text-sm focus:outline-none focus:ring-2 focus:ring-sunset-500"
              />
            </div>

            <div>
              <label className="block font-mono text-caption text-mist-300 uppercase mb-2">Filter by Destination</label>
              <select
                value={selectedDest}
                onChange={(e) => setSelectedDest(e.target.value)}
                className="w-full bg-dusk-950 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sunset-500"
              >
                <option value="">All Destinations</option>
                {destinations.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.country})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-mono text-caption text-mist-300 uppercase">Max Base Price</label>
                <span className="font-mono text-sm text-gold-400 font-bold">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-sunset-500 cursor-pointer"
              />
            </div>
          </div>
        </GlassCard>

        {/* Package Grid */}
        {loadingPack ? (
          <LoadingSkeleton count={3} />
        ) : packages.length === 0 ? (
          <EmptyState
            caption="NO MATCHES"
            title="No tour packages match your filters"
            actionText="Reset Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedDest('');
              setMaxPrice(5000);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <GlassCard key={pkg._id} elevated className="flex flex-col justify-between h-[440px] relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="relative h-44 rounded-xl overflow-hidden -mx-6 -mt-6 mb-4">
                    <img
                      src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="horizon">{pkg.destination?.name || 'Global'}</Badge>
                    </div>
                  </div>

                  <h2 className="font-display text-display-md text-white group-hover:text-sunset-500 transition-colors line-clamp-1">
                    {pkg.title}
                  </h2>

                  <div className="flex space-x-4 font-mono text-xs text-mist-300">
                    <span>⏱ {pkg.durationDays} Days</span>
                    <span>👥 Max {pkg.maxGroupSize} Guests</span>
                  </div>

                  <p className="font-body text-xs text-mist-300 line-clamp-2">
                    {pkg.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-caption text-mist-300 block">Starting From</span>
                    <span className="font-mono text-lg text-gold-400 font-bold">${pkg.basePrice}</span>
                  </div>
                  <Link to={`/packages/${pkg.slug || pkg._id}`}>
                    <Button variant="primary" size="sm">
                      Details →
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default PackageList;
