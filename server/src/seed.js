import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Destination } from './models/Destination.js';
import { TourPackage } from './models/TourPackage.js';
import { Hotel } from './models/Hotel.js';
import { Itinerary } from './models/Itinerary.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wayfarer';

const sampleDestinations = [
  {
    name: 'Amalfi Coast',
    slug: 'amalfi-coast',
    country: 'Italy',
    description: 'Dramatic coastline with pastel villages clinging to steep cliffs along the Tyrrhenian Sea.',
    images: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    ],
    highlights: ['Positano Cliffside Walk', 'Ravello Gardens', 'Capri Boat Excursion'],
  },
  {
    name: 'Kyoto Sanctuary',
    slug: 'kyoto-sanctuary',
    country: 'Japan',
    description: 'Ancient temples, sublime bamboo groves, traditional tea houses, and tranquil zen gardens.',
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    ],
    highlights: ['Arashiyama Bamboo Grove', 'Fushimi Inari Shrine', 'Traditional Tea Ceremony'],
  },
  {
    name: 'Santorini Island',
    slug: 'santorini-island',
    country: 'Greece',
    description: 'Iconic whitewashed buildings with blue domes perched high above a volcanic caldera at sunset.',
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    ],
    highlights: ['Oia Sunset Overlook', 'Red Beach Exploration', 'Caldera Catamaran Cruise'],
  },
  {
    name: 'Swiss Alps',
    slug: 'swiss-alps',
    country: 'Switzerland',
    description: 'Majestic snow-capped peaks, pristine alpine lakes, scenic cogwheel trains, and cozy mountain chalets.',
    images: [
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    ],
    highlights: ['Jungfraujoch Peak', 'Matterhorn Vista', 'Glacier Express Scenic Rail'],
  },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    // Clear existing collections
    await Destination.deleteMany({});
    await TourPackage.deleteMany({});
    await Hotel.deleteMany({});
    await Itinerary.deleteMany({});

    console.log('Cleared existing catalog data.');

    // 1. Insert Destinations
    const createdDestinations = await Destination.insertMany(sampleDestinations);
    console.log(`Inserted ${createdDestinations.length} destinations.`);

    const amalfi = createdDestinations.find((d) => d.slug === 'amalfi-coast');
    const kyoto = createdDestinations.find((d) => d.slug === 'kyoto-sanctuary');

    // 2. Insert Hotels
    const createdHotels = await Hotel.insertMany([
      {
        name: 'Villa Positano Resort & Spa',
        destination: amalfi._id,
        address: 'Via Cristoforo Colombo 2, Positano, Italy',
        starRating: 5,
        amenities: ['Infinity Pool', 'Sea View Terrace', 'Michelin Star Dining', 'Spa'],
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        ],
        roomTypes: [
          { name: 'Standard Ocean View', pricePerNight: 0, capacity: 2, totalRooms: 10 },
          { name: 'Deluxe Suite with Cliff Terrace', pricePerNight: 120, capacity: 2, totalRooms: 5 },
          { name: 'Penthouse Villa Tier', pricePerNight: 250, capacity: 4, totalRooms: 2 },
        ],
      },
      {
        name: 'Kyoto Grand Ryokan',
        destination: kyoto._id,
        address: 'Higashiyama Ward, Kyoto, Japan',
        starRating: 5,
        amenities: ['Private Onsen Bath', 'Kaiseki Dinner', 'Zen Garden', 'Tea House'],
        images: [
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        ],
        roomTypes: [
          { name: 'Traditional Tatami Suite', pricePerNight: 0, capacity: 2, totalRooms: 8 },
          { name: 'Private Garden Onsen Villa', pricePerNight: 150, capacity: 3, totalRooms: 4 },
        ],
      },
    ]);
    console.log(`Inserted ${createdHotels.length} hotels.`);

    // 3. Insert Tour Packages
    const package1 = await TourPackage.create({
      title: 'Amalfi Coastal Discovery',
      slug: 'amalfi-coastal-discovery',
      destination: amalfi._id,
      description:
        'Spend 7 magical days walking the Path of the Gods, exploring Ravello, and sailing around Capri with an expert local host.',
      basePrice: 1499,
      durationDays: 7,
      maxGroupSize: 10,
      includedServices: [
        'Guided Mountain Hikes',
        'Boat Transfers to Capri',
        'Daily Organic Breakfast',
        'Boutique Hotel Accommodation',
        'Luggage Transfers',
      ],
      images: [
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
      ],
      startDates: ['2026-09-01', '2026-09-15', '2026-10-01'],
    });

    const package2 = await TourPackage.create({
      title: 'Kyoto Zen & Temple Pilgrimage',
      slug: 'kyoto-zen-pilgrimage',
      destination: kyoto._id,
      description:
        'Immerse yourself in Kyoto’s sacred temples, bamboo groves, tea ceremonies, and authentic ryokan stays.',
      basePrice: 1899,
      durationDays: 8,
      maxGroupSize: 8,
      includedServices: [
        'Private Cultural Guide',
        'Luxury Ryokan Stay',
        'Tea Ceremony Experience',
        'Bullet Train Pass',
      ],
      images: [
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      ],
      startDates: ['2026-10-05', '2026-10-20'],
    });

    console.log('Inserted tour packages.');

    // 4. Insert Itineraries
    await Itinerary.create({
      package: package1._id,
      days: [
        {
          dayNumber: 1,
          title: 'Arrival in Positano',
          description:
            'Check-in to your boutique sea-view resort. Welcome aperitivo overlooking the Tyrrhenian Sea.',
          activities: ['Hotel Check-in', 'Sunset Aperitivo'],
          meals: ['Welcome Dinner'],
        },
        {
          dayNumber: 2,
          title: 'Path of the Gods Hike',
          description:
            'Scenic guided trek high above the coastline from Bomerano to Nocelle.',
          activities: ['Guided Trek', 'Cliffside Lunch'],
          meals: ['Breakfast', 'Lunch'],
        },
        {
          dayNumber: 3,
          title: 'Capri Island Boat Excursion',
          description:
            'Private boat tour around Capri, visit the Blue Grotto and Faraglioni Rocks.',
          activities: ['Boat Excursion', 'Swimming & Snorkeling'],
          meals: ['Breakfast'],
        },
        {
          dayNumber: 4,
          title: 'Ravello & Gardens',
          description:
            'Visit historic Villa Rufolo and Villa Cimbrone with panoramic gardens.',
          activities: ['Villa Rufolo Tour', 'Classical Music Concert'],
          meals: ['Breakfast'],
        },
        {
          dayNumber: 5,
          title: 'Lemon Grove & Culinary Masterclass',
          description:
            'Learn lemon harvest traditions in Amalfi and make fresh pasta and limoncello.',
          activities: ['Cooking Class', 'Limoncello Tasting'],
          meals: ['Breakfast', 'Lunch'],
        },
        {
          dayNumber: 6,
          title: 'Fiordo di Furore & Leisure',
          description:
            'Explore the iconic fjord bridge and enjoy free time for shopping or beach relaxation.',
          activities: ['Fjord Walk', 'Leisure Time'],
          meals: ['Breakfast'],
        },
        {
          dayNumber: 7,
          title: 'Farewell & Departure',
          description:
            'Final breakfast overlooking the bay before private airport transfer.',
          activities: ['Checkout', 'Airport Transfer'],
          meals: ['Breakfast'],
        },
      ],
    });

    await Itinerary.create({
      package: package2._id,
      days: [
        {
          dayNumber: 1,
          title: 'Arrival in Kyoto',
          description: 'Transfer to ryokan, traditional tea welcome, relaxation.',
          activities: ['Ryokan Check-in', 'Matcha Tea Ceremony'],
          meals: ['Kaiseki Dinner'],
        },
        {
          dayNumber: 2,
          title: 'Arashiyama & Bamboo Forest',
          description: 'Early morning walk through the bamboo grove and Tenryu-ji Temple.',
          activities: ['Bamboo Grove Walk', 'Zen Meditation'],
          meals: ['Breakfast', 'Lunch'],
        },
        {
          dayNumber: 3,
          title: 'Fushimi Inari Shrine',
          description: 'Hike through the thousands of vermilion Torii gates.',
          activities: ['Torii Trail Hike', 'Street Food Tasting'],
          meals: ['Breakfast'],
        },
      ],
    });

    console.log('Inserted itineraries.');
    console.log('Database seeding complete successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
