'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import StarBackground from '@/components/StarBackground';
import { Property, RentalAgreement } from '@/lib/types';
import { animations } from '@/lib/animations';
import { 
  ArrowLeft, MapPin, Bed, Bath, Square, Zap, Shield, Coins,
  Wifi, Car, Coffee, Dumbbell, Waves, Mountain, TreePine,
  Star, Clock, CheckCircle, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import Image from 'next/image';
import RentalModal from '@/components/RentalModal';

// Import the same property data from the main properties page
import { realProperties } from '../page';

export default function PropertyDetailPage() {
  const { ready, authenticated, user } = usePrivy();
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      // Find property by ID
      const foundProperty = realProperties.find(p => p.id === params.id);
      if (foundProperty) {
        setProperty(foundProperty);
      }
      setIsLoading(false);
    }
  }, [params.id]);

  const handleRentProperty = () => {
    if (!authenticated) {
      alert('Please connect your wallet to rent this property');
      return;
    }
    setIsRentalModalOpen(true);
  };

  const handleConfirmRental = (agreement: Partial<RentalAgreement>) => {
    console.log('Rental agreement:', agreement);
    alert('Rental request submitted! Check your wallet for transaction.');
    setIsRentalModalOpen(false);
  };

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
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
          <h2 className="text-xl font-bold text-white mb-2">Loading Property</h2>
          <p className="text-gray-400">Fetching property details...</p>
        </motion.div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div 
            className="glass-dark rounded-2xl p-8 max-w-md mx-4 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={animations.spring.gentle}
          >
            <X className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Property Not Found</h2>
            <p className="text-gray-400 mb-6">The property you're looking for doesn't exist.</p>
            <motion.button
              onClick={() => router.push('/properties')}
              className="cyber-button"
              whileHover={animations.hover.lift}
              whileTap={animations.tap}
            >
              Back to Properties
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden">
      <StarBackground intensity="high" />
      <Header />
      
      <main className="w-full relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
          {/* Back Button */}
          <motion.button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
            whileHover={{ x: -5 }}
            transition={animations.spring.gentle}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Properties</span>
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={animations.easing.smooth}
            >
              {/* Main Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-dark">
                <Image
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                
                {/* Image Navigation */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6 text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="h-6 w-6 text-white" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                    property.isAvailable 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {property.isAvailable ? 'Available' : 'Rented'}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {property.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {property.images.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`relative aspect-square w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                        index === currentImageIndex ? 'ring-2 ring-blue-400' : ''
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Property Details */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, ...animations.easing.smooth }}
            >
              {/* Title and Type */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm capitalize">
                    {property.propertyType}
                  </span>
                  <div className="flex items-center text-gray-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{property.location}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-lg leading-relaxed">
                {property.description}
              </p>

              {/* Property Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="glass rounded-xl p-4 text-center">
                  <Bed className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{property.bedrooms}</div>
                  <div className="text-sm text-gray-400">Bedrooms</div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <Bath className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{property.bathrooms}</div>
                  <div className="text-sm text-gray-400">Bathrooms</div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <Square className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{property.area}</div>
                  <div className="text-sm text-gray-400">Sq Ft</div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <motion.div
                      key={amenity}
                      className="flex items-center space-x-3 p-3 glass rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">{amenity}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Price and Owner */}
              <div className="glass rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {property.pricePerDay} ETH/day
                    </div>
                    <div className="text-gray-400">
                      Total: {property.price} ETH
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Owner</div>
                    <div className="text-sm font-mono text-gray-300 bg-gray-800/50 px-3 py-1 rounded">
                      {property.owner.slice(0, 6)}...{property.owner.slice(-4)}
                    </div>
                  </div>
                </div>

                {/* Rent Button */}
                <motion.button
                  onClick={handleRentProperty}
                  disabled={!property.isAvailable}
                  className={`w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 relative overflow-hidden ${
                    property.isAvailable
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={property.isAvailable ? animations.hover.bounce : {}}
                  whileTap={property.isAvailable ? animations.tap : {}}
                >
                  {property.isAvailable ? (
                    <>
                      <Zap className="h-5 w-5" />
                      <span>Rent This Property</span>
                    </>
                  ) : (
                    <>
                      <X className="h-5 w-5" />
                      <span>Not Available</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Rental Modal */}
      <AnimatePresence>
        {isRentalModalOpen && (
          <RentalModal
            property={property}
            isOpen={isRentalModalOpen}
            onClose={() => setIsRentalModalOpen(false)}
            onConfirmRental={handleConfirmRental}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
