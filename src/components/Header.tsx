'use client';

import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, Zap, Globe, Shield, LogOut, User, Database } from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { animations } from '@/lib/animations';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authData, setAuthData] = useState<any>(null);
  
  // Debug: Log auth data changes
  useEffect(() => {
    console.log('📊 Auth Data State:', authData);
  }, [authData]);
  const privyHook = usePrivy();
  const { ready, authenticated, user, login, logout } = privyHook;
  
  // Debug: Log available methods
  useEffect(() => {
    if (ready) {
      console.log('🔍 Available Privy methods:', Object.keys(privyHook));
    }
  }, [ready, privyHook]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Handle authentication with backend when user logs in
  useEffect(() => {
    console.log('🔄 Auth state changed:', { authenticated, user: !!user, ready });
    
    if (authenticated && user) {
      console.log('🚀 Starting backend authentication...');
      handleBackendAuthentication();
    } else if (!authenticated) {
      console.log('🔓 User not authenticated, clearing auth data');
      setAuthData(null);
      AuthService.clearStoredAuth();
    }
  }, [authenticated, user]);

  const handleBackendAuthentication = async () => {
    if (!user) return;
    
    try {
      console.log('🔐 Authenticating with backend using Privy JWT...');
      console.log('📊 User data from Privy:', {
        id: user.id,
        wallet: user.wallet,
        email: user.email,
        google: user.google,
        twitter: user.twitter,
        discord: user.discord,
        createdAt: user.createdAt,
      });

      // Check if getAccessToken is available
      const getAccessToken = privyHook.getAccessToken;
      if (!getAccessToken || typeof getAccessToken !== 'function') {
        console.warn('⚠️ getAccessToken method not available, showing test modal with user data only');
        console.log('ℹ️ Available Privy methods:', Object.keys(privyHook));
        return;
      }

             // Get Privy's JWT token and authenticate with backend
             const authPayload = await AuthService.authenticateWithBackend(user, async () => {
               const token = await getAccessToken();
               return token || 'mock_token_for_testing';
             });
      setAuthData(authPayload);
      
      console.log('✅ Backend authentication successful:', authPayload);
      
      // 🚀 TOKEN LOGGING FOR TESTING - Display in UI
      console.log('🎯 ===== FRONTEND AUTHENTICATION COMPLETE =====');
      console.log('🔐 Privy ID Token:', authPayload.accessToken ? 'Available' : 'Not Available');
      console.log('🔑 Backend JWT Token:', authPayload.accessToken);
      console.log('👤 User ID:', authPayload.user.privyId);
      console.log('📧 Email:', authPayload.user.email);
      console.log('💼 Wallet:', authPayload.user.walletAddress);
      console.log('🎯 ===========================================');
      
      // Check if user needs onboarding
      checkOnboardingStatus(user);
    } catch (error) {
      console.error('❌ Backend authentication failed:', error);
    }
  };

  const checkOnboardingStatus = (user: any) => {
    // Check if onboarding is complete
    const onboardingComplete = localStorage.getItem('hanumo_onboarding_complete');
    const userProfile = localStorage.getItem('hanumo_user_profile');
    
    // If no onboarding data exists, redirect to onboarding
    if (!onboardingComplete || !userProfile) {
      console.log('🔄 New user detected, redirecting to onboarding...');
      setTimeout(() => {
        window.location.href = '/onboarding';
      }, 1000); // Small delay to let the UI update
    }
  };

  return (
    <>
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo with animation - Clickable */}
          <Link href="/">
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer group"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="relative">
                <motion.div
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(6, 182, 212, 0.4)"
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </motion.div>
                </motion.div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg opacity-30"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <motion.h1 
                  className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent neon-text"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundImage: "linear-gradient(to right, #60a5fa, #22d3ee)"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  Hanumo
                </motion.h1>
                <motion.p 
                  className="text-xs text-gray-400 font-mono"
                  whileHover={{ 
                    color: "#d1d5db",
                    scale: 1.02
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  Web3 Rental
                </motion.p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {[
              { href: '/properties', label: 'Browse Properties', icon: Globe },
              { href: '/list', label: 'List Property', icon: Zap },
              { href: '/dashboard', label: 'Dashboard', icon: Shield },
              { href: '/rentals', label: 'My Rentals', icon: Globe },
            ].map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Link 
                  href={item.href}
                  className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 relative overflow-hidden px-3 py-2 rounded-lg"
                >
                  <motion.div
                    className="flex items-center space-x-2 relative z-10"
                    whileHover={animations.hover.lift}
                    transition={animations.spring.gentle}
                  >
                    <motion.div
                      whileHover={{ rotate: 12, scale: 1.1 }}
                      transition={animations.spring.snappy}
                    >
                      <item.icon className="h-4 w-4 group-hover:text-blue-400 transition-colors duration-300" />
                    </motion.div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.div>
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 w-0 group-hover:w-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={animations.easing.smooth}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 rounded-lg"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={animations.easing.smoothFast}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Wallet Connection */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="hidden sm:block">
              {!ready ? (
                <div className="px-4 py-2 bg-gray-800 rounded-lg text-gray-400 text-sm">
                  Loading...
                </div>
              ) : authenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                    <User className="h-4 w-4 text-blue-400" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {AuthService.getUserDisplayName(user!)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {user?.wallet?.address ? formatAddress(user.wallet.address) : 'No wallet'}
                        {user?.wallet?.walletClientType === 'privy' && ' 🔐'}
                      </span>
                    </div>
                  </div>
                  {authData && (
                    <motion.div
                      className="p-2 rounded-lg glass hover:bg-green-500/20 transition-colors"
                      title={`Backend Connected - Token: ${authData.accessToken ? 'Available' : 'Missing'}`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Database className="h-4 w-4 text-green-400" />
                    </motion.div>
                  )}
                  <motion.button
                    onClick={() => {
                      console.log('🧪 TEST: Manual auth trigger');
                      handleBackendAuthentication();
                    }}
                    className="p-2 rounded-lg glass hover:bg-blue-500/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Test Authentication"
                  >
                    <Database className="h-4 w-4 text-blue-400" />
                  </motion.button>
                  <motion.button
                    onClick={logout}
                    className="p-2 rounded-lg glass hover:bg-red-500/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="h-4 w-4 text-red-400" />
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  onClick={login}
                  className="cyber-button group flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="h-4 w-4" />
                  <span className="text-sm">Connect Wallet</span>
                </motion.button>
              )}
            </div>
            
            {/* Mobile menu button */}
            <motion.button
              className="md:hidden p-2 rounded-lg glass hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMenuOpen ? 1 : 0, 
            height: isMenuOpen ? "auto" : 0 
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2 border-t border-white/10">
            {[
              { href: '/properties', label: 'Browse Properties', icon: Globe },
              { href: '/list', label: 'List Property', icon: Zap },
              { href: '/dashboard', label: 'Dashboard', icon: Shield },
              { href: '/rentals', label: 'My Rentals', icon: Globe },
            ].map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  href={item.href}
                  className="group flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 relative overflow-hidden"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <motion.div
                    className="flex items-center space-x-3 relative z-10"
                    whileHover={animations.hover.lift}
                    transition={animations.spring.gentle}
                  >
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.15 }}
                      transition={animations.spring.snappy}
                    >
                      <item.icon className="h-5 w-5 group-hover:text-blue-400 transition-colors duration-300" />
                    </motion.div>
                    <motion.span 
                      className="font-medium"
                      whileHover={{ x: 3 }}
                      transition={animations.spring.snappy}
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={animations.easing.smoothFast}
                  />
                </Link>
              </motion.div>
            ))}
            <div className="px-4 pt-4 border-t border-white/10">
              {!ready ? (
                <div className="px-4 py-3 bg-gray-800 rounded-lg text-gray-400 text-sm text-center">
                  Loading...
                </div>
              ) : authenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                    <User className="h-4 w-4 text-blue-400" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {AuthService.getUserDisplayName(user!)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {user?.wallet?.address ? formatAddress(user.wallet.address) : 'No wallet'}
                        {user?.wallet?.walletClientType === 'privy' && ' 🔐'}
                      </span>
                    </div>
                  </div>
                  {authData && (
                    <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                      <Database className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400">Backend Connected</span>
                    </div>
                  )}
                  <motion.button
                    onClick={logout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Disconnect</span>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  onClick={login}
                  className="w-full cyber-button group flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Zap className="h-4 w-4" />
                  <span className="text-sm">Connect Wallet</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
    </>
  );
}