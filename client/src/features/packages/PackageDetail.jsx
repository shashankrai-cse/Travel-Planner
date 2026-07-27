import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PageShell from '../../components/layout/PageShell';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { useGetPackageBySlugQuery } from '../../app/api/packagesApi';
import { useGetItineraryByPackageQuery } from '../../app/api/itinerariesApi';
import { useGetHotelsQuery } from '../../app/api/hotelsApi';
import { setBookingPackage, setHotelSelection, setStep } from '../booking/bookingSlice';
import PackageReviews from '../reviews/PackageReviews';

const fallbackPackage = {
  _id: 'p1',
  title: 'Amalfi Coastal Discovery',
  slug: 'amalfi-coastal-discovery',
  destination: { name: 'Amalfi Coast', country: 'Italy' },
  basePrice: 1499,
  durationDays: 7,
  maxGroupSize: 10,
  description: 'Spend 7 magical days walking the Path of the Gods, exploring Ravello, and sailing around Capri with an expert local host.',
  images: ['https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'],
  includedServices: ['Guided Mountain Hikes', 'Boat Transfers to Capri', 'Daily Organic Breakfast', 'Boutique Hotel Accommodation', 'Luggage Transfers'],
};

const fallbackDays = [
  { dayNumber: 1, title: 'Arrival in Positano', description: 'Check-in to your boutique sea-view hotel. Welcome aperitivo overlooking the Tyrrhenian Sea.', activities: ['Hotel Check-in', 'Sunset Aperitivo'], meals: ['Welcome Dinner'] },
  { dayNumber: 2, title: 'Path of the Gods Hike', description: 'Scenic guided trek high above the coastline from Bomerano to Nocelle.', activities: ['Guided Trek', 'Cliffside Lunch'], meals: ['Breakfast', 'Lunch'] },
  { dayNumber: 3, title: 'Capri Island Boat Excursion', description: 'Private boat tour around Capri, visit the Blue Grotto and Faraglioni Rocks.', activities: ['Boat Excursion', 'Swimming & Snorkeling'], meals: ['Breakfast'] },
  { dayNumber: 4, title: 'Ravello & Gardens', description: 'Visit historic Villa Rufolo and Villa Cimbrone with panoramic gardens.', activities: ['Villa Rufolo Tour', 'Classical Music Concert'], meals: ['Breakfast'] },
  { dayNumber: 5, title: 'Lemon Grove & Culinary Masterclass', description: 'Learn lemon harvest traditions in Amalfi and make fresh pasta and limoncello.', activities: ['Cooking Class', 'Limoncello Tasting'], meals: ['Breakfast', 'Lunch'] },
  { dayNumber: 6, title: 'Fiordo di Furore & Leisure', description: 'Explore the iconic fjord bridge and enjoy free time for shopping or beach relaxation.', activities: ['Fjord Walk', 'Leisure Time'], meals: ['Breakfast'] },
  { dayNumber: 7, title: 'Farewell & Departure', description: 'Final breakfast overlooking the bay before private airport transfer.', activities: ['Checkout', 'Airport Transfer'], meals: ['Breakfast'] },
];

const fallbackHotels = [
  {
    _id: 'h1',
    name: 'Villa Positano Resort',
    starRating: 5,
    roomTypes: [
      { name: 'Standard Ocean View', pricePerNight: 0, capacity: 2 },
      { name: 'Deluxe Suite with Cliff Terrace', pricePerNight: 120, capacity: 2 },
    ],
  },
];

export const PackageDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: packRes, isLoading: loadingPack } = useGetPackageBySlugQuery(slug);
  const pkg = packRes?.data || fallbackPackage;

  const { data: itinRes } = useGetItineraryByPackageQuery(pkg._id, { skip: !pkg._id });
  const { data: hotelRes } = useGetHotelsQuery(
    { destination: pkg.destination?._id },
    { skip: !pkg.destination?._id }
  );

  const days = itinRes?.data?.days && itinRes.data.days.length > 0 ? itinRes.data.days : fallbackDays;
  const hotels = hotelRes?.data && hotelRes.data.length > 0 ? hotelRes.data : fallbackHotels;

  const [selectedHotel, setSelectedHotelState] = useState(hotels[0]);
  const [selectedRoom, setSelectedRoomState] = useState(hotels[0]?.roomTypes?.[0] || null);

  const calculateTotalPrice = () => {
    const base = pkg.basePrice || 1499;
    const roomUpgrade = (selectedRoom?.pricePerNight || 0) * (pkg.durationDays || 5);
    return base + roomUpgrade;
  };

  const handleStartBooking = () => {
    dispatch(setBookingPackage(pkg));
    if (selectedHotel && selectedRoom) {
      dispatch(
        setHotelSelection({
          hotel: selectedHotel._id,
          roomType: selectedRoom.name,
          pricePerNight: selectedRoom.pricePerNight,
          nights: pkg.durationDays,
        })
      );
    }
    dispatch(setStep(1));
    navigate('/booking');
  };

  if (loadingPack) {
    return (
      <PageShell>
        <LoadingSkeleton count={2} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="space-y-12">
        {/* Full-bleed Image Banner with Glass Panel overlapping bottom-left */}
        <div className="relative rounded-3xl overflow-hidden min-h-[460px] flex items-end p-6 sm:p-10">
          <img
            src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'}
            alt={pkg.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dusk-950 via-dusk-950/40 to-transparent" />

          {/* Translucent overlapping glass info card */}
          <GlassCard elevated className="relative z-10 max-w-2xl space-y-3 p-6 sm:p-8 backdrop-blur-xl border border-white/20">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="horizon">{pkg.destination?.name || 'Global'}</Badge>
              <Badge variant="gold">⏱ {pkg.durationDays} Days / {pkg.durationDays - 1} Nights</Badge>
            </div>
            <h1 className="font-display text-display-lg sm:text-display-xl font-bold text-white">
              {pkg.title}
            </h1>
            <p className="font-body text-sm sm:text-body text-mist-300">
              {pkg.description}
            </p>
          </GlassCard>
        </div>

        {/* Two-column layout per design spec */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Itinerary (~60% / 7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <span className="font-mono text-caption text-sunset-500 uppercase tracking-widest">
                DAY-BY-DAY ITINERARY
              </span>
              <h2 className="font-display text-display-lg text-white">
                Your Journey Schedule
              </h2>
            </div>

            <div className="space-y-4">
              {days.map((day) => (
                <GlassCard key={day.dayNumber} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gold-400 font-bold tracking-wider uppercase">
                      DAY 0{day.dayNumber}
                    </span>
                    {day.meals && day.meals.length > 0 && (
                      <span className="font-mono text-caption text-mist-300">
                        🍽 {day.meals.join(', ')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-display-md text-white">{day.title}</h3>
                  <p className="font-body text-sm text-mist-300">{day.description}</p>

                  {day.activities && day.activities.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {day.activities.map((act, idx) => (
                        <span key={idx} className="text-xs font-mono bg-white/10 px-3 py-1 rounded-full text-mist-300">
                          ✓ {act}
                        </span>
                      ))}
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>

            {/* Included Services */}
            {pkg.includedServices && pkg.includedServices.length > 0 && (
              <GlassCard>
                <h3 className="font-display text-display-md text-white mb-4">Included In Package</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.includedServices.map((srv, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm font-body text-mist-300">
                      <span className="text-sunset-500 font-bold">✓</span>
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Reviews System */}
            <PackageReviews packageId={pkg._id} />
          </div>

          {/* Right Column: Sticky Booking Summary Card (~40% / 5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <GlassCard elevated className="space-y-6 border border-sunset-500/30">
              <div className="border-b border-white/10 pb-4 flex justify-between items-end">
                <div>
                  <span className="font-mono text-caption text-mist-300 uppercase block">Total Package Price</span>
                  <span className="font-display text-display-lg text-gold-400 font-bold">
                    ${calculateTotalPrice()}
                  </span>
                </div>
                <span className="font-mono text-xs text-mist-300">per person</span>
              </div>

              {/* Room Tier Selector */}
              {hotels && hotels.length > 0 && (
                <div className="space-y-3">
                  <label className="font-mono text-caption text-mist-300 uppercase block">
                    Choose Hotel & Room Tier
                  </label>
                  {hotels.map((htl) => (
                    <div key={htl._id} className="space-y-2">
                      <span className="font-body text-xs font-semibold text-white block">
                        {htl.name} ({'★'.repeat(htl.starRating)})
                      </span>
                      {htl.roomTypes?.map((rt, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedHotelState(htl);
                            setSelectedRoomState(rt);
                          }}
                          className={`p-3 rounded-xl cursor-pointer font-body text-xs flex justify-between items-center transition-all ${
                            selectedRoom?.name === rt.name
                              ? 'bg-sunset-500/20 border border-sunset-500 text-white'
                              : 'bg-white/5 border border-white/10 text-mist-300 hover:bg-white/10'
                          }`}
                        >
                          <div>
                            <span className="font-semibold block text-white">{rt.name}</span>
                            <span className="font-mono text-[10px] text-mist-300">Cap: {rt.capacity} guests</span>
                          </div>
                          <span className="font-mono text-gold-400">
                            {rt.pricePerNight > 0 ? `+$${rt.pricePerNight * pkg.durationDays}` : 'Included'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2 font-mono text-xs text-mist-300 border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span>Base Package:</span>
                  <span>${pkg.basePrice}</span>
                </div>
                {selectedRoom && selectedRoom.pricePerNight > 0 && (
                  <div className="flex justify-between text-sunset-500">
                    <span>Room Upgrade:</span>
                    <span>+${selectedRoom.pricePerNight * pkg.durationDays}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-white pt-2 border-t border-white/10">
                  <span>Calculated Total:</span>
                  <span className="text-gold-400">${calculateTotalPrice()}</span>
                </div>
              </div>

              <Button variant="primary" size="lg" className="w-full shadow-xl" onClick={handleStartBooking}>
                Book This Trip Now →
              </Button>
            </GlassCard>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default PackageDetail;
