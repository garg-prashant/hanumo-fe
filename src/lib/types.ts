export interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  pricePerDay: string;
  location: string;
  images: string[];
  owner: string;
  isAvailable: boolean;
  propertyType: 'apartment' | 'house' | 'condo' | 'studio' | 'villa';
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  createdAt: string;
}

export interface RentalAgreement {
  id: string;
  propertyId: string;
  tenant: string;
  landlord: string;
  startDate: string;
  endDate: string;
  totalPrice: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  securityDeposit: string;
}

export const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
  { value: 'studio', label: 'Studio' },
  { value: 'villa', label: 'Villa' },
];

export const amenities = [
  'WiFi',
  'Parking',
  'Pool',
  'Gym',
  'Balcony',
  'Garden',
  'Pet Friendly',
  'Air Conditioning',
  'Heating',
  'Dishwasher',
  'Washing Machine',
  'TV',
  'Kitchen',
  'Security',
];
