import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { useGetDestinationsQuery } from '../../app/api/destinationsApi';

const fallbackDestinations = [
  {
    _id: '1',
    name: 'Amalfi Coast',
    slug: 'amalfi-coast',
    country: 'Italy',
    description: 'Dramatic coastline with pastel villages clinging to steep cliffs along the Tyrrhenian Sea.',
    images: ['https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Positano Cliffside Walk', 'Ravello Gardens', 'Capri Boat Excursion'],
  },
  {
    _id: '2',
    name: 'Kyoto Sanctuary',
    slug: 'kyoto-sanctuary',
    country: 'Japan',
    description: 'Ancient temples, sublime bamboo groves, traditional tea houses, and tranquil zen gardens.',
    images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Arashiyama Bamboo Grove', 'Fushimi Inari Shrine', 'Traditional Tea Ceremony'],
  },
  {
    _id: '3',
    name: 'Santorini Island',
    slug: 'santorini-island',
    country: 'Greece',
    description: 'Iconic whitewashed buildings with blue domes perched high above a volcanic caldera at sunset.',
    images: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Oia Sunset Overlook', 'Red Beach Exploration', 'Caldera Catamaran Cruise'],
  },
  {
    _id: '4',
    name: 'Swiss Alps Sanctuary',
    slug: 'swiss-alps',
    country: 'Switzerland',
    description: 'Majestic snow-capped peaks, pristine alpine lakes, scenic cogwheel trains, and cozy mountain chalets.',
    images: ['https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80'],
    highlights: ['Jungfraujoch Peak', 'Matterhorn Vista', 'Glacier Express Scenic Rail'],
  },
];

export const DestinationList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useGetDestinationsQuery();

  const rawList = data?.data && data.data.length > 0 ? data.data : fallbackDestinations;

  const destinations = rawList.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageShell>
      <div className="space-y-8">
        {/* Hero Banner */}
        <div className="text-center py-8">
          <Badge variant="gold" className="mb-3">CURATED DESTINATIONS</Badge>
          <h1 className="font-display text-display-xl font-bold text-white mb-4">
            Where Will Your Story Begin?
          </h1>
          <p className="font-body text-body-lg text-mist-300 max-w-2xl mx-auto">
            Browse our global directory of hand-selected regions, coastal paradises, and mountain sanctuaries.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search by destination or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass rounded-full px-6 py-3.5 pl-12 text-white placeholder-mist-300 focus:outline-none focus:ring-2 focus:ring-sunset-500 font-body text-sm"
            />
            <span className="absolute left-4 top-3.5 text-mist-300 text-lg">🔍</span>
          </div>
        </div>

        {/* Destination Grid */}
        {isLoading ? (
          <LoadingSkeleton count={4} />
        ) : destinations.length === 0 ? (
          <EmptyState
            caption="NO DESTINATIONS"
            title="No matching destinations found"
            actionText="Clear Search"
            onAction={() => setSearchTerm('')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {destinations.map((item) => (
              <Link key={item._id} to={`/destinations/${item.slug || item._id}`}>
                <GlassCard elevated className="h-96 flex flex-col justify-between relative overflow-hidden group">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dusk-950 via-dusk-950/50 to-transparent" />
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <Badge variant="horizon">{item.country}</Badge>
                  </div>

                  <div className="relative z-10 space-y-3">
                    <h2 className="font-display text-display-lg text-white group-hover:text-sunset-500 transition-colors">
                      {item.name}
                    </h2>
                    <p className="font-body text-sm text-mist-300 line-clamp-2">
                      {item.description}
                    </p>

                    {item.highlights && item.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {item.highlights.slice(0, 3).map((hl, idx) => (
                          <span key={idx} className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-full text-mist-300">
                            ✦ {hl}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default DestinationList;
