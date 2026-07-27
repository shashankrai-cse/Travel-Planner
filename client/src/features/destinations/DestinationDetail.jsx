import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { useGetDestinationBySlugQuery } from '../../app/api/destinationsApi';
import { useGetPackagesQuery } from '../../app/api/packagesApi';

const fallbackDestinations = {
  'amalfi-coast': {
    _id: '1',
    name: 'Amalfi Coast',
    country: 'Italy',
    description: 'Dramatic coastline with pastel villages clinging to steep cliffs along the Tyrrhenian Sea.',
    images: ['https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Positano Cliffside Walk', 'Ravello Gardens', 'Capri Boat Excursion'],
  },
  'kyoto-sanctuary': {
    _id: '2',
    name: 'Kyoto Sanctuary',
    country: 'Japan',
    description: 'Ancient temples, sublime bamboo groves, traditional tea houses, and tranquil zen gardens.',
    images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Arashiyama Bamboo Grove', 'Fushimi Inari Shrine', 'Traditional Tea Ceremony'],
  },
};

export const DestinationDetail = () => {
  const { slug } = useParams();
  const { data: destRes, isLoading: loadingDest } = useGetDestinationBySlugQuery(slug);
  const { data: packRes, isLoading: loadingPack } = useGetPackagesQuery();

  const destination = destRes?.data || fallbackDestinations[slug] || fallbackDestinations['amalfi-coast'];
  
  const allPackages = packRes?.data || [
    {
      _id: 'p1',
      title: 'Amalfi Coastal Discovery',
      slug: 'amalfi-coastal-discovery',
      basePrice: 1499,
      durationDays: 7,
      maxGroupSize: 10,
      description: 'Spend 7 magical days walking the Path of the Gods, exploring Ravello, and sailing around Capri.',
      images: ['https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'],
    },
  ];

  const packages = allPackages.filter(
    (p) => p.destination?._id === destination._id || p.destination?.slug === slug || !p.destination
  );

  if (loadingDest) {
    return (
      <PageShell>
        <LoadingSkeleton count={2} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="space-y-12">
        {/* Banner Section */}
        <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-end p-8 sm:p-12">
          <img
            src={destination.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'}
            alt={destination.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dusk-950 via-dusk-950/60 to-transparent" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <Badge variant="gold">{destination.country}</Badge>
            <h1 className="font-display text-display-xl font-bold text-white">
              {destination.name}
            </h1>
            <p className="font-body text-body-lg text-mist-300">
              {destination.description}
            </p>
          </div>
        </div>

        {/* Highlights */}
        {destination.highlights && destination.highlights.length > 0 && (
          <GlassCard>
            <h3 className="font-display text-display-md text-white mb-4">Destination Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {destination.highlights.map((hl, idx) => (
                <div key={idx} className="glass p-4 rounded-xl flex items-center space-x-3">
                  <span className="text-sunset-500 font-mono text-lg">✦</span>
                  <span className="font-body text-sm font-medium text-white">{hl}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Tour Packages Available */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="font-mono text-caption text-sunset-500 uppercase tracking-wider">
                CURATED TOURS
              </span>
              <h2 className="font-display text-display-lg text-white mt-1">
                Packages in {destination.name}
              </h2>
            </div>
          </div>

          {loadingPack ? (
            <LoadingSkeleton count={2} />
          ) : packages.length === 0 ? (
            <EmptyState
              caption="NO PACKAGES"
              title={`No tour packages currently listed for ${destination.name}`}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {packages.map((pkg) => (
                <GlassCard key={pkg._id} elevated className="flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-display text-display-md text-white">{pkg.title}</h3>
                      <span className="font-mono text-lg text-gold-400 font-bold">${pkg.basePrice}</span>
                    </div>
                    <div className="flex space-x-4 font-mono text-xs text-mist-300">
                      <span>⏱ {pkg.durationDays} Days</span>
                      <span>👥 Max {pkg.maxGroupSize} People</span>
                    </div>
                    <p className="font-body text-sm text-mist-300">{pkg.description}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 flex justify-end">
                    <Link to={`/packages/${pkg.slug || pkg._id}`}>
                      <Button variant="primary">View Package & Itinerary →</Button>
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
};

export default DestinationDetail;
