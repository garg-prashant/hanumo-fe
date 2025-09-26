'use client';

import { Property } from '@/lib/types';
import { formatPrice, formatAddress } from '@/lib/utils';
import { animations } from '@/lib/animations';
import { MapPin, Bed, Bath, Square, Zap, Shield, Coins } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PropertyCardProps {
  property: Property;
  onRent: (property: Property) => void;
  index?: number;
}

export default function PropertyCard({ property, onRent, index = 0 }: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/properties/${property.id}`);
  };

  return (
    <motion.div 
      className="glass-dark rounded-2xl overflow-hidden group cursor-pointer relative h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        ...animations.easing.smooth,
        delay: index * 0.1 
      }}
      whileHover={animations.hover.liftStrong}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
      style={{
        boxShadow: isHovered 
          ? "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)" 
          : "0 8px 32px rgba(0, 0, 0, 0.37)"
      }}
    >
      {/* Property Image */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <motion.div
            className="relative w-full h-full"
            whileHover={animations.hover.scale}
            transition={animations.spring.gentle}
          >
            <Image
              src={property.images[0]}
              alt={property.title}
              width={500}
              height={300}
              className="w-full h-full object-cover"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={animations.easing.smooth}
            />
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Square className="h-16 w-16" />
          </div>
        )}
        
        {/* Status Badge */}
        <motion.div 
          className="absolute top-4 right-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
            property.isAvailable 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {property.isAvailable ? 'Available' : 'Rented'}
          </span>
        </motion.div>

        {/* Crypto Payment Badge */}
        <motion.div 
          className="absolute top-4 left-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-1 px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full backdrop-blur-sm">
            <Coins className="h-3 w-3" />
            <span className="text-xs font-medium">Crypto</span>
          </div>
        </motion.div>
      </div>

      {/* Property Details */}
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <motion.h3 
            className="text-xl font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {property.title}
          </motion.h3>
          <motion.span 
            className="text-sm text-gray-400 capitalize bg-gray-800/50 px-2 py-1 rounded-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {property.propertyType}
          </motion.span>
        </div>

        <motion.div 
          className="flex items-center text-gray-400 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <MapPin className="h-4 w-4 mr-2 text-blue-400" />
          <span className="text-sm">{property.location}</span>
        </motion.div>

        <motion.p 
          className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {property.description}
        </motion.p>

        {/* Property Stats */}
        <motion.div 
          className="flex items-center space-x-6 mb-4 text-sm text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1 text-blue-400" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1 text-purple-400" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1 text-green-400" />
            <span>{property.area} sq ft</span>
          </div>
        </motion.div>

        {/* Amenities */}
        <motion.div 
          className="mb-4 flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-wrap gap-2">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <motion.span
                key={amenity}
                className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                {amenity}
              </motion.span>
            ))}
            {property.amenities.length > 3 && (
              <motion.span 
                className="px-3 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-full border border-gray-600/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                +{property.amenities.length - 3} more
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Price and Owner */}
        <motion.div 
          className="flex justify-between items-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {formatPrice(property.pricePerDay)}/day
            </div>
            <div className="text-sm text-gray-400">
              Total: {formatPrice(property.price)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Owner</div>
            <div className="text-sm font-mono text-gray-300 bg-gray-800/50 px-2 py-1 rounded">
              {formatAddress(property.owner)}
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <div className="mt-auto">
          <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onRent(property);
          }}
          disabled={!property.isAvailable}
          className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 relative overflow-hidden ${
            property.isAvailable
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={property.isAvailable ? animations.hover.bounce : {}}
          whileTap={property.isAvailable ? animations.tap : {}}
          style={{
            boxShadow: property.isAvailable && isHovered
              ? "0 10px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(168, 85, 247, 0.3)"
              : property.isAvailable
              ? "0 4px 15px rgba(59, 130, 246, 0.2)"
              : "none"
          }}
        >
          {/* Button shine effect */}
          {property.isAvailable && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              animate={isHovered ? { x: "100%" } : { x: "-100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          )}
          {property.isAvailable ? (
            <>
              <Zap className="h-4 w-4" />
              <span>Rent Now</span>
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              <span>Not Available</span>
            </>
          )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
