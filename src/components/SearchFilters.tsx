'use client';

import { useState } from 'react';
import { Search, MapPin, Filter, Zap, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  query: string;
  location: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full">
      <motion.div 
        className="glass-dark rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
      <motion.div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <motion.div
            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </motion.div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Smart Search
          </h2>
        </div>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 px-3 sm:px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-xs sm:text-sm text-gray-300">Advanced</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Main Search Row */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Search Query */}
        <motion.div 
          className="relative"
          whileFocus={{ scale: 1.02 }}
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full pl-12 pr-4 py-4 glass rounded-xl border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-gray-400 transition-all duration-300"
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
          />
        </motion.div>

        {/* Location */}
        <motion.div 
          className="relative"
          whileFocus={{ scale: 1.02 }}
        >
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Location"
            className="w-full pl-12 pr-4 py-4 glass rounded-xl border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-400 transition-all duration-300"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
        </motion.div>

        {/* Property Type */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <select
            className="w-full px-4 py-4 glass rounded-xl border border-white/10 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 text-white bg-transparent transition-all duration-300 appearance-none"
            value={filters.propertyType}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
          >
            <option value="" className="bg-gray-900">All Types</option>
            <option value="apartment" className="bg-gray-900">Apartment</option>
            <option value="house" className="bg-gray-900">House</option>
            <option value="condo" className="bg-gray-900">Condo</option>
            <option value="studio" className="bg-gray-900">Studio</option>
            <option value="villa" className="bg-gray-900">Villa</option>
          </select>
        </motion.div>
      </motion.div>

      {/* Advanced Filters */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isExpanded ? 1 : 0, 
          height: isExpanded ? "auto" : 0 
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Price Range */}
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -20 }}
            transition={{ delay: 0.1 }}
          >
            <label className="flex text-sm text-gray-400 mb-2 items-center space-x-2">
              <Coins className="h-4 w-4 text-yellow-400" />
              <span>Price Range (ETH)</span>
            </label>
            <div className="flex space-x-3">
              <input
                type="number"
                placeholder="Min"
                className="w-full px-4 py-3 glass rounded-xl border border-white/10 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 text-white placeholder-gray-400 transition-all duration-300"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full px-4 py-3 glass rounded-xl border border-white/10 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 text-white placeholder-gray-400 transition-all duration-300"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </motion.div>

          {/* Bedrooms */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -20 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm text-gray-400 mb-2">Bedrooms</label>
            <select
              className="w-full px-4 py-3 glass rounded-xl border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-white bg-transparent transition-all duration-300"
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
            >
              <option value="" className="bg-gray-900">Any</option>
              <option value="1" className="bg-gray-900">1+</option>
              <option value="2" className="bg-gray-900">2+</option>
              <option value="3" className="bg-gray-900">3+</option>
              <option value="4" className="bg-gray-900">4+</option>
            </select>
          </motion.div>

          {/* Bathrooms */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -20 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm text-gray-400 mb-2">Bathrooms</label>
            <select
              className="w-full px-4 py-3 glass rounded-xl border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 text-white bg-transparent transition-all duration-300"
              value={filters.bathrooms}
              onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
            >
              <option value="" className="bg-gray-900">Any</option>
              <option value="1" className="bg-gray-900">1+</option>
              <option value="2" className="bg-gray-900">2+</option>
              <option value="3" className="bg-gray-900">3+</option>
            </select>
          </motion.div>
        </div>
      </motion.div>

      {/* Search Button */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={handleSearch}
          className="cyber-button group flex items-center space-x-3 px-8 py-4 text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          <span>Search Properties</span>
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.button>
      </motion.div>
      </motion.div>
    </div>
  );
}