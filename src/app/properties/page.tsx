'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import Header from '@/components/Header';
import StarBackground from '@/components/StarBackground';
import PropertyCard from '@/components/PropertyCard';
import SearchFilters from '@/components/SearchFilters';
import RentalModal from '@/components/RentalModal';
import { Property, RentalAgreement } from '@/lib/types';
import { animations } from '@/lib/animations';
import { 
  Search, Filter, MapPin, Calendar, DollarSign, 
  Star, Shield, Wifi, Car, Coffee, Dumbbell, 
  Waves, Mountain, TreePine, Zap, Square, 
  Bed, Bath, Users, Clock, CheckCircle
} from 'lucide-react';

// Real property data with actual images - Expanded Collection
export const realProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Loft - SoHo NYC',
    description: 'Stunning loft in the heart of SoHo with exposed brick walls, high ceilings, and premium amenities. Perfect for digital nomads and crypto enthusiasts.',
    price: '0.25',
    pricePerDay: '0.008',
    location: 'SoHo, New York, NY',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    isAvailable: true,
    propertyType: 'apartment',
    amenities: ['WiFi', 'Crypto Payments', 'Standing Desk', 'Coworking Space', 'Gym', 'Rooftop'],
    bedrooms: 1,
    bathrooms: 1,
    area: 850,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Beachfront Villa - Malibu',
    description: 'Luxurious beachfront villa with panoramic ocean views, private beach access, and state-of-the-art smart home features. Accepts ETH, USDC, and other major cryptocurrencies.',
    price: '0.8',
    pricePerDay: '0.025',
    location: 'Malibu, California',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7c42182e7a6b?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0x8f2e4a7b9c1d3e5f6a8b9c0d1e2f3a4b5c6d7e8',
    isAvailable: true,
    propertyType: 'villa',
    amenities: ['Ocean View', 'Private Beach', 'Pool', 'Gym', 'Smart Home', 'Crypto Payments', 'WiFi'],
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'Mountain Cabin - Aspen',
    description: 'Cozy mountain cabin with breathtaking mountain views, fireplace, and outdoor hot tub. Perfect for winter getaways and crypto retreats.',
    price: '0.15',
    pricePerDay: '0.005',
    location: 'Aspen, Colorado',
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0x3a5b7c9d1e2f4a6b8c0d1e2f3a4b5c6d7e8f9a0',
    isAvailable: false,
    propertyType: 'cabin',
    amenities: ['Mountain View', 'Fireplace', 'Hot Tub', 'WiFi', 'Crypto Payments', 'Parking'],
    bedrooms: 2,
    bathrooms: 1,
    area: 1200,
    createdAt: '2024-01-05',
  },
  {
    id: '4',
    title: 'Urban Studio - Tokyo',
    description: 'Minimalist studio apartment in the heart of Tokyo with modern Japanese design, smart home features, and easy access to public transportation.',
    price: '0.12',
    pricePerDay: '0.004',
    location: 'Shibuya, Tokyo, Japan',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0x9f1e3a5b7c9d2e4f6a8b0c1d2e3f4a5b6c7d8e9',
    isAvailable: true,
    propertyType: 'studio',
    amenities: ['Smart Home', 'WiFi', 'Crypto Payments', 'Public Transport', 'Convenience Store'],
    bedrooms: 0,
    bathrooms: 1,
    area: 400,
    createdAt: '2024-01-20',
  },
  {
    id: '5',
    title: 'Historic Brownstone - Brooklyn',
    description: 'Beautifully restored historic brownstone with original details, modern amenities, and a private garden. Located in trendy Williamsburg.',
    price: '0.3',
    pricePerDay: '0.01',
    location: 'Williamsburg, Brooklyn, NY',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0x2b4d6f8a0c2e4f6a8b0c2d4e6f8a0b2c4d6e8f0',
    isAvailable: true,
    propertyType: 'house',
    amenities: ['Historic', 'Garden', 'WiFi', 'Crypto Payments', 'Parking', 'Laundry'],
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    createdAt: '2024-01-12',
  },
  {
    id: '6',
    title: 'Luxury Penthouse - Miami',
    description: 'Stunning penthouse with panoramic city and ocean views, private elevator, and rooftop pool. Perfect for high-end crypto events and meetings.',
    price: '1.2',
    pricePerDay: '0.04',
    location: 'South Beach, Miami, FL',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7c42182e7a6b?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0x5c7e9a1b3d5f7a9b0c2d4e6f8a0b2c4d6e8f0a2',
    isAvailable: true,
    propertyType: 'penthouse',
    amenities: ['Ocean View', 'Rooftop Pool', 'Private Elevator', 'Gym', 'Concierge', 'Crypto Payments', 'WiFi'],
    bedrooms: 4,
    bathrooms: 4,
    area: 3500,
    createdAt: '2024-01-08',
  },
  {
    id: '7',
    title: 'Cozy Cottage - Lake Tahoe',
    description: 'Charming lakeside cottage with stunning lake views, private dock, and outdoor fire pit. Ideal for peaceful crypto coding retreats.',
    price: '0.18',
    pricePerDay: '0.006',
    location: 'Lake Tahoe, California',
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0x8a0c2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6',
    isAvailable: true,
    propertyType: 'cottage',
    amenities: ['Lake View', 'Private Dock', 'Fire Pit', 'WiFi', 'Crypto Payments', 'Fishing'],
    bedrooms: 2,
    bathrooms: 1,
    area: 900,
    createdAt: '2024-01-18',
  },
  {
    id: '8',
    title: 'Modern Apartment - London',
    description: 'Contemporary apartment in the heart of London with smart home technology, premium finishes, and easy access to tech hubs.',
    price: '0.22',
    pricePerDay: '0.007',
    location: 'Shoreditch, London, UK',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0x1b3d5f7a9b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8',
    isAvailable: false,
    propertyType: 'apartment',
    amenities: ['Smart Home', 'WiFi', 'Crypto Payments', 'Public Transport', 'Gym', 'Concierge'],
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    createdAt: '2024-01-14',
  },
  // NEW ADDITIONS - 12 MORE PROPERTIES
  {
    id: '9',
    title: 'Boutique Hotel Suite - Paris',
    description: 'Elegant suite in a historic Parisian boutique hotel with Eiffel Tower views, marble bathrooms, and 24/7 concierge service. Perfect for crypto conferences.',
    price: '0.35',
    pricePerDay: '0.012',
    location: 'Champs-Élysées, Paris, France',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0x7f3e9a2b4c6d8e0f1a3b5c7d9e1f2a4b6c8d0e2',
    isAvailable: true,
    propertyType: 'hotel',
    amenities: ['City View', 'Concierge', 'Room Service', 'WiFi', 'Crypto Payments', 'Spa', 'Restaurant'],
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    createdAt: '2024-01-22',
  },
  {
    id: '10',
    title: 'Tech Hub Loft - San Francisco',
    description: 'Modern loft in the heart of SOMA district with high-speed internet, standing desks, and proximity to major tech companies. Ideal for crypto developers.',
    price: '0.45',
    pricePerDay: '0.015',
    location: 'SOMA, San Francisco, CA',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0x9a1c3e5f7b9d2e4f6a8b0c2d4e6f8a0b2c4d6e8',
    isAvailable: true,
    propertyType: 'loft',
    amenities: ['High-Speed WiFi', 'Standing Desk', 'Crypto Payments', 'Coworking Space', 'Gym', 'Rooftop'],
    bedrooms: 1,
    bathrooms: 1,
    area: 950,
    createdAt: '2024-01-25',
  },
  {
    id: '11',
    title: 'Desert Oasis - Palm Springs',
    description: 'Mid-century modern home with private pool, mountain views, and outdoor living spaces. Perfect for crypto retreats and relaxation.',
    price: '0.28',
    pricePerDay: '0.009',
    location: 'Palm Springs, California',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613490493576-7c42182e7a6b?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0x2b4d6f8a0c2e4f6a8b0c2d4e6f8a0b2c4d6e8f0',
    isAvailable: true,
    propertyType: 'house',
    amenities: ['Pool', 'Mountain View', 'Outdoor Living', 'WiFi', 'Crypto Payments', 'Parking', 'BBQ'],
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    createdAt: '2024-01-28',
  },
  {
    id: '12',
    title: 'Alpine Chalet - Swiss Alps',
    description: 'Traditional Swiss chalet with panoramic mountain views, fireplace, and ski-in/ski-out access. Perfect for winter crypto conferences.',
    price: '0.65',
    pricePerDay: '0.022',
    location: 'Zermatt, Switzerland',
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0x4c6e8a0b2d4f6a8b0c2d4e6f8a0b2c4d6e8f0a2',
    isAvailable: false,
    propertyType: 'chalet',
    amenities: ['Mountain View', 'Ski Access', 'Fireplace', 'WiFi', 'Crypto Payments', 'Spa', 'Restaurant'],
    bedrooms: 4,
    bathrooms: 3,
    area: 2000,
    createdAt: '2024-01-30',
  },
  {
    id: '13',
    title: 'Beach House - Tulum',
    description: 'Eco-friendly beach house with direct beach access, rooftop terrace, and sustainable design. Perfect for crypto nomads seeking tranquility.',
    price: '0.32',
    pricePerDay: '0.011',
    location: 'Tulum, Mexico',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613490493576-7c42182e7a6b?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0x6e8a0b2d4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4',
    isAvailable: true,
    propertyType: 'beachhouse',
    amenities: ['Beach Access', 'Rooftop Terrace', 'Eco-Friendly', 'WiFi', 'Crypto Payments', 'Yoga Space'],
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    createdAt: '2024-02-02',
  },
  {
    id: '14',
    title: 'Urban Penthouse - Singapore',
    description: 'Luxury penthouse with city skyline views, infinity pool, and smart home technology. Located in the heart of Singapore\'s financial district.',
    price: '0.85',
    pricePerDay: '0.028',
    location: 'Marina Bay, Singapore',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0x8a0b2d4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6',
    isAvailable: true,
    propertyType: 'penthouse',
    amenities: ['City View', 'Infinity Pool', 'Smart Home', 'Concierge', 'Crypto Payments', 'WiFi', 'Gym'],
    bedrooms: 3,
    bathrooms: 3,
    area: 2800,
    createdAt: '2024-02-05',
  },
  {
    id: '15',
    title: 'Rustic Farmhouse - Tuscany',
    description: 'Charming Tuscan farmhouse with vineyard views, stone walls, and traditional Italian architecture. Perfect for crypto retreats in wine country.',
    price: '0.38',
    pricePerDay: '0.013',
    location: 'Chianti, Tuscany, Italy',
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0xa0b2d4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8',
    isAvailable: true,
    propertyType: 'farmhouse',
    amenities: ['Vineyard View', 'Traditional', 'WiFi', 'Crypto Payments', 'Wine Tasting', 'Garden'],
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    createdAt: '2024-02-08',
  },
  {
    id: '16',
    title: 'Modern Condo - Vancouver',
    description: 'Contemporary condo with floor-to-ceiling windows, mountain and ocean views, and smart home features. Located in downtown Vancouver.',
    price: '0.42',
    pricePerDay: '0.014',
    location: 'Downtown Vancouver, BC, Canada',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0xb2d4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0',
    isAvailable: true,
    propertyType: 'condo',
    amenities: ['Mountain View', 'Ocean View', 'Smart Home', 'WiFi', 'Crypto Payments', 'Gym', 'Concierge'],
    bedrooms: 2,
    bathrooms: 2,
    area: 1300,
    createdAt: '2024-02-11',
  },
  {
    id: '17',
    title: 'Island Villa - Santorini',
    description: 'Stunning cliffside villa with caldera views, infinity pool, and traditional Cycladic architecture. Perfect for crypto conferences and retreats.',
    price: '0.75',
    pricePerDay: '0.025',
    location: 'Oia, Santorini, Greece',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613490493576-7c42182e7a6b?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0xc2d4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0',
    isAvailable: false,
    propertyType: 'villa',
    amenities: ['Caldera View', 'Infinity Pool', 'Traditional', 'WiFi', 'Crypto Payments', 'Spa', 'Restaurant'],
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    createdAt: '2024-02-14',
  },
  {
    id: '18',
    title: 'Luxury Apartment - Dubai',
    description: 'High-end apartment in the world\'s tallest building with panoramic city views, private elevator, and 24/7 concierge service.',
    price: '1.1',
    pricePerDay: '0.037',
    location: 'Burj Khalifa, Dubai, UAE',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0xd2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0',
    isAvailable: true,
    propertyType: 'apartment',
    amenities: ['City View', 'Private Elevator', 'Concierge', 'WiFi', 'Crypto Payments', 'Gym', 'Spa'],
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    createdAt: '2024-02-17',
  },
  {
    id: '19',
    title: 'Treehouse Retreat - Costa Rica',
    description: 'Eco-friendly treehouse with jungle views, outdoor shower, and sustainable design. Perfect for crypto developers seeking inspiration.',
    price: '0.25',
    pricePerDay: '0.008',
    location: 'Manuel Antonio, Costa Rica',
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0xe2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0',
    isAvailable: true,
    propertyType: 'treehouse',
    amenities: ['Jungle View', 'Eco-Friendly', 'Outdoor Shower', 'WiFi', 'Crypto Payments', 'Wildlife'],
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    createdAt: '2024-02-20',
  },
  {
    id: '20',
    title: 'Historic Castle - Scotland',
    description: 'Medieval castle with modern amenities, private grounds, and stunning highland views. Perfect for exclusive crypto events and retreats.',
    price: '2.5',
    pricePerDay: '0.083',
    location: 'Highlands, Scotland, UK',
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop&q=80'
    ],
    owner: '0xf2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0',
    isAvailable: true,
    propertyType: 'castle',
    amenities: ['Historic', 'Highland View', 'Private Grounds', 'WiFi', 'Crypto Payments', 'Staff', 'Library'],
    bedrooms: 8,
    bathrooms: 6,
    area: 5000,
    createdAt: '2024-02-23',
  }
];

export default function PropertiesPage() {
  const { ready, authenticated, user } = usePrivy();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadedCount, setLoadedCount] = useState(6);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    amenities: [] as string[]
  });

  // Load properties with delay to improve initial page load
  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true);
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Load only first 6 properties initially for better performance
      const initialProperties = realProperties.slice(0, loadedCount);
      setProperties(initialProperties);
      setFilteredProperties(initialProperties);
      setIsLoading(false);
    };

    if (ready) {
      loadProperties();
    }
  }, [ready, loadedCount]);

  // Function to load more properties
  const loadMoreProperties = async () => {
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCount = Math.min(loadedCount + 6, realProperties.length);
    const newProperties = realProperties.slice(0, newCount);
    setProperties(newProperties);
    setLoadedCount(newCount);
    setIsLoadingMore(false);
  };

  // Filter properties based on search criteria
  useEffect(() => {
    let filtered = properties;

    if (searchFilters.location) {
      filtered = filtered.filter(prop => 
        prop.location.toLowerCase().includes(searchFilters.location.toLowerCase())
      );
    }

    if (searchFilters.propertyType) {
      filtered = filtered.filter(prop => prop.propertyType === searchFilters.propertyType);
    }

    if (searchFilters.minPrice) {
      filtered = filtered.filter(prop => 
        parseFloat(prop.pricePerDay) >= parseFloat(searchFilters.minPrice)
      );
    }

    if (searchFilters.maxPrice) {
      filtered = filtered.filter(prop => 
        parseFloat(prop.pricePerDay) <= parseFloat(searchFilters.maxPrice)
      );
    }

    if (searchFilters.bedrooms) {
      filtered = filtered.filter(prop => 
        prop.bedrooms >= parseInt(searchFilters.bedrooms)
      );
    }

    if (searchFilters.amenities.length > 0) {
      filtered = filtered.filter(prop => 
        searchFilters.amenities.every(amenity => 
          prop.amenities.includes(amenity)
        )
      );
    }

    setFilteredProperties(filtered);
  }, [searchFilters, properties]);

  const handleRentProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsRentalModalOpen(true);
  };

  const handleConfirmRental = (agreement: Partial<RentalAgreement>) => {
    console.log('Rental agreement:', agreement);
    alert('Rental request submitted! Check your wallet for transaction.');
    setIsRentalModalOpen(false);
    setSelectedProperty(null);
  };

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
  };

  if (!ready || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-x-hidden flex items-center justify-center">
        <motion.div 
          className="glass-dark rounded-2xl p-8 max-w-md mx-4 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={animations.spring.gentle}
        >
          <motion.div
            className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-xl font-bold text-white mb-2">Loading Properties</h2>
          <p className="text-gray-400">Finding the perfect place for you...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden">
      <StarBackground intensity="medium" />
      <Header />
      
      <main className="w-full relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={animations.easing.smooth}
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ...animations.easing.smooth }}
            >
              <span className="text-blue-400">
                Discover Properties
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ...animations.easing.smooth }}
            >
              Find your perfect rental property powered by Web3 technology
            </motion.p>
          </motion.div>

          {/* Search Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ...animations.easing.smooth }}
            className="mb-8"
          >
            <SearchFilters onSearch={handleSearch} />
          </motion.div>

          {/* Results Summary */}
          <motion.div 
            className="flex justify-between items-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ...animations.easing.smooth }}
          >
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white">
                {filteredProperties.length} Properties Found
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <CheckCircle className="h-4 w-4" />
                <span>Web3 Verified</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Updated just now</span>
            </div>
          </motion.div>

          {/* Properties Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 items-stretch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {filteredProperties.map((property, index) => (
                <PropertyCard 
                  key={property.id}
                  property={property} 
                  onRent={handleRentProperty}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Load More Button */}
          {loadedCount < realProperties.length && (
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={animations.spring.gentle}
            >
              <motion.button
                className="cyber-button px-8 py-3"
                whileHover={animations.hover.lift}
                whileTap={animations.tap}
                onClick={loadMoreProperties}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  `Load More Properties (${realProperties.length - loadedCount} remaining)`
                )}
              </motion.button>
            </motion.div>
          )}

          {/* No Results */}
          {filteredProperties.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={animations.spring.gentle}
            >
              <div className="glass-dark rounded-2xl p-8 max-w-md mx-auto">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Properties Found</h3>
                <p className="text-gray-400 mb-4">
                  Try adjusting your search filters to find more properties.
                </p>
                <motion.button
                  className="cyber-button"
                  whileHover={animations.hover.lift}
                  whileTap={animations.tap}
                  onClick={() => setSearchFilters({
                    location: '',
                    propertyType: '',
                    minPrice: '',
                    maxPrice: '',
                    bedrooms: '',
                    amenities: []
                  })}
                >
                  Clear Filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Rental Modal */}
      <AnimatePresence>
        {isRentalModalOpen && selectedProperty && (
          <RentalModal
            property={selectedProperty}
            isOpen={isRentalModalOpen}
            onClose={() => {
              setIsRentalModalOpen(false);
              setSelectedProperty(null);
            }}
            onConfirmRental={handleConfirmRental}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
