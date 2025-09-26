'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import Header from '@/components/Header';
import SearchFilters, { SearchFilters as SearchFiltersType } from '@/components/SearchFilters';
import PropertyCard from '@/components/PropertyCard';
import RentalModal from '@/components/RentalModal';
import { Property, RentalAgreement } from '@/lib/types';
import { animations } from '@/lib/animations';
import { 
  Zap, 
  Globe, 
  Shield, 
  Coins, 
  Users, 
  TrendingUp,
  ArrowRight,
  Layers,
  Cpu,
  Wallet,
  X,
  AlertCircle
} from 'lucide-react';

// Mock data for demonstration
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Crypto Nomad Loft - Downtown NYC',
    description: 'Perfect for digital nomads! High-speed WiFi, standing desk, crypto-friendly neighborhood. Accepts ETH & USDC.',
    price: '0.15',
    pricePerDay: '0.005',
    location: 'SoHo, New York',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500'],
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    isAvailable: true,
    propertyType: 'apartment',
    amenities: ['WiFi', 'Crypto Payments', 'Standing Desk', 'Coworking Space'],
    bedrooms: 1,
    bathrooms: 1,
    area: 800,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'DAO House - Malibu Beachfront',
    description: 'Community-owned beach house! Perfect for Web3 retreats, DAO meetups, and crypto conferences.',
    price: '0.25',
    pricePerDay: '0.008',
    location: 'Malibu, California',
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500'],
    owner: '0x8ba1f109551bD432803012645Hac136c66C4e',
    isAvailable: true,
    propertyType: 'house',
    amenities: ['WiFi', 'Crypto Payments', 'Conference Room', 'Ocean View', 'DAO Governance'],
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'NFT Gallery Penthouse',
    description: 'Exclusive penthouse with NFT art collection, crypto mining setup, and panoramic city views.',
    price: '0.5',
    pricePerDay: '0.02',
    location: 'Manhattan, New York',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500'],
    owner: '0x1234567890abcdef1234567890abcdef12345678',
    isAvailable: false,
    propertyType: 'condo',
    amenities: ['WiFi', 'Crypto Payments', 'NFT Gallery', 'Mining Setup', 'Balcony', 'Security'],
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    createdAt: '2024-01-05',
  },
  {
    id: '4',
    title: 'Eco-Friendly Crypto Cabin',
    description: 'Sustainable living meets Web3! Solar-powered, accepts crypto, perfect for DeFi developers.',
    price: '0.08',
    pricePerDay: '0.003',
    location: 'Costa Rica',
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500'],
    owner: '0xabcdef1234567890abcdef1234567890abcdef12',
    isAvailable: true,
    propertyType: 'villa',
    amenities: ['Solar Power', 'Crypto Payments', 'Garden', 'Ocean View', 'Eco-Friendly'],
    bedrooms: 2,
    bathrooms: 1,
    area: 1200,
    createdAt: '2024-01-20',
  },
];

export default function Home() {
  const { ready, authenticated, user, login } = usePrivy();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginAction, setLoginAction] = useState<'list' | 'rent' | null>(null);

  // Check onboarding status on mount
  useEffect(() => {
    if (authenticated && user) {
      const onboardingComplete = localStorage.getItem('hanumo_onboarding_complete');
      const userProfile = localStorage.getItem('hanumo_user_profile');
      
      // If no onboarding data exists, redirect to onboarding
      if (!onboardingComplete || !userProfile) {
        console.log('🔄 New user detected, redirecting to onboarding...');
        window.location.href = '/onboarding';
      }
    }
  }, [authenticated, user]);

  const handleSearch = (filters: SearchFiltersType) => {
    let filtered = mockProperties;

    if (filters.query) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        property.description.toLowerCase().includes(filters.query.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.propertyType) {
      filtered = filtered.filter(property =>
        property.propertyType === filters.propertyType
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(property =>
        parseFloat(property.pricePerDay) >= parseFloat(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(property =>
        parseFloat(property.pricePerDay) <= parseFloat(filters.maxPrice)
      );
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(property =>
        property.bedrooms >= parseInt(filters.bedrooms)
      );
    }

    if (filters.bathrooms) {
      filtered = filtered.filter(property =>
        property.bathrooms >= parseInt(filters.bathrooms)
      );
    }

    setFilteredProperties(filtered);
  };

  const handleRent = (property: Property) => {
    if (!authenticated) {
      setLoginAction('rent');
      setShowLoginModal(true);
      return;
    }
    setSelectedProperty(property);
    setIsRentalModalOpen(true);
  };

  const handleListProperty = () => {
    if (!authenticated) {
      setLoginAction('list');
      setShowLoginModal(true);
      return;
    }
    // Navigate to list property page or open modal
    window.location.href = '/list';
  };

  const handleLogin = async () => {
    try {
      await login();
      setShowLoginModal(false);
      setLoginAction(null);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleConfirmRental = (agreement: Partial<RentalAgreement>) => {
    console.log('Rental agreement:', agreement);
    // Here you would typically interact with your smart contract
    alert('Rental request submitted! Check your wallet for transaction.');
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <Header />
      
      <main className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="mb-4 sm:mb-6">
            <span className="text-blue-400 font-mono text-xs sm:text-sm uppercase tracking-wider">Web3 Rental Platform</span>
          </div>
          
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-blue-400">
              Decentralized
            </span>
            <br />
            <span className="text-white">Property Rentals</span>
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Welcome to the <span className="text-blue-400 font-semibold">future of renting</span>. 
            List or rent properties globally using <span className="text-cyan-400 font-semibold">crypto + Web3 identity</span>. 
            No intermediaries. No hidden fees. <span className="text-purple-400 font-semibold">100% decentralized</span>.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button 
              className="cyber-button group flex items-center justify-center space-x-2 w-full sm:w-auto"
              whileHover={animations.hover.bounce}
              whileTap={animations.tap}
              onClick={handleListProperty}
            >
              <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">List Your Property</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button 
              className="cyber-button group flex items-center justify-center space-x-2 w-full sm:w-auto"
              whileHover={animations.hover.bounce}
              whileTap={animations.tap}
              onClick={() => window.location.href = '/properties'}
            >
              <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Find Rentals</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Why Decentralized Section */}
        <motion.div 
          className="glass-dark rounded-2xl p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16 lg:mb-20 grid-pattern"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <Layers className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-400">
                Why Decentralized Rentals?
              </h2>
              <Layers className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
            </div>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              Experience the next generation of rental platforms powered by blockchain technology
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { 
                icon: Zap, 
                title: 'Wallet-based Auth', 
                description: 'Seamless login with wallet, email, or Google.',
                color: 'from-blue-500 to-cyan-500',
                glow: ''
              },
              { 
                icon: Globe, 
                title: 'Borderless Marketplace', 
                description: 'Rent or host properties across the globe.',
                color: 'from-cyan-500 to-blue-500',
                glow: ''
              },
              { 
                icon: Coins, 
                title: 'Crypto Payments', 
                description: 'Stablecoins (USDC) & ETH, direct wallet-to-wallet.',
                color: 'from-blue-500 to-purple-500',
                glow: ''
              },
              { 
                icon: Shield, 
                title: 'Trustless Agreements', 
                description: 'Powered by smart contracts + on-chain verification.',
                color: 'from-purple-500 to-blue-500',
                glow: ''
              },
              { 
                icon: Users, 
                title: 'ENS + Reputation', 
                description: 'Verified hosts & renters using Web3 identity.',
                color: 'from-blue-500 to-cyan-500',
                glow: ''
              },
              { 
                icon: TrendingUp, 
                title: 'DAO Governance', 
                description: 'Community-owned alternative to Web2 giants.',
                color: 'from-cyan-500 to-purple-500',
                glow: ''
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className={`glass hover-lift ${feature.glow} rounded-xl p-4 sm:p-6 group`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className={`w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search Filters */}
        <div className="mb-8">
          <SearchFilters onSearch={handleSearch} />
        </div>

        {/* Properties Grid */}
        <motion.div 
          className="mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <Cpu className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-400">
                Explore Properties
              </h2>
              <Cpu className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
            </div>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto mb-6 sm:mb-8">
              Discover unique rentals across the globe. Filter by location, price, dates, and crypto token of choice.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { label: 'Urban Apartments', color: 'from-blue-500 to-cyan-500' },
                { label: 'Vacation Homes', color: 'from-green-500 to-emerald-500' },
                { label: 'Unique Stays', color: 'from-purple-500 to-pink-500' }
              ].map((tag, index) => (
                <motion.span
                  key={tag.label}
                  className={`bg-blue-500 text-white px-6 py-3 rounded-full text-sm font-medium glass`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  {tag.label}
                </motion.span>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-white">
              Available Properties <span className="text-blue-400">({filteredProperties.length})</span>
            </h3>
            <motion.button 
              className="cyber-button group flex items-center space-x-2 w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleListProperty}
            >
              <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">List Your Property</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {filteredProperties.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="glass-dark rounded-2xl p-12 max-w-md mx-auto">
                <Cpu className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">No properties found matching your criteria.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PropertyCard
                    property={property}
                    onRent={handleRent}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
        </div>
      </main>

      {/* Rental Modal */}
      <RentalModal
        property={selectedProperty}
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
        onConfirmRental={handleConfirmRental}
      />

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="glass-dark rounded-2xl p-6 sm:p-8 w-full max-w-md border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {loginAction === 'list' ? 'List Your Property' : 'Rent Property'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {loginAction === 'list' ? 'Authentication Required' : 'Login Required'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {loginAction === 'list' 
                        ? 'You need to connect your wallet to list properties'
                        : 'You need to connect your wallet to rent properties'
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-300">
                    {loginAction === 'list' 
                      ? 'Connect your wallet to start listing properties and earning crypto!'
                      : 'Connect your wallet to rent properties with crypto payments!'
                    }
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={handleLogin}
                      className="cyber-button group flex items-center justify-center space-x-2 flex-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Wallet className="h-4 w-4" />
                      <span>Connect Wallet</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setShowLoginModal(false)}
                      className="px-4 py-2 glass rounded-lg text-gray-300 hover:text-white transition-colors flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500">
                    Login with wallet, email, Google, Twitter, or Discord
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer 
        className="glass-dark border-t border-white/10 py-12 sm:py-16 w-full"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <motion.div
                  className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="h-5 w-5 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-blue-400">
                  Hanumo
                </h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                The future of real estate is on-chain. Community-owned alternative to Web2 rental giants.
              </p>
            </motion.div>
            
            {[
              { title: 'Platform', links: ['Browse Properties', 'List Property', 'Dashboard', 'DAO Governance'] },
              { title: 'Web3 Features', links: ['Crypto Payments', 'ENS Integration', 'Smart Contracts', 'NFT Listings'] },
              { title: 'Community', links: ['Discord', 'Twitter', 'GitHub', 'DAO'] }
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold mb-4 text-white">{section.title}</h4>
                <ul className="space-y-3 text-sm">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 + linkIndex * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <a 
                        href="#" 
                        className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                      >
                        {link}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="border-t border-white/10 mt-12 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-sm">
              © 2025 Hanumo. Built on Ethereum. Powered by the community.
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              {['Ethereum', 'Polygon', 'Arbitrum'].map((chain, index) => (
                <motion.span
                  key={chain}
                  className="text-xs text-gray-500 px-3 py-1 glass rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {chain}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}