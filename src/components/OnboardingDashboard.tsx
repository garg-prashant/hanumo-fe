'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Wallet, 
  MapPin, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Upload,
  Camera,
  Globe,
  CreditCard,
  Settings,
  Zap,
  Bot,
  Database
} from 'lucide-react';
import { AuthService } from '@/lib/auth';

interface UserProfile {
  displayName: string;
  bio: string;
  location: string;
  phoneNumber: string;
  profileImage: string | null;
  preferences: {
    notifications: boolean;
    marketingEmails: boolean;
    smsUpdates: boolean;
  };
  walletSettings: {
    autoPayments: boolean;
    preferredCurrency: 'ETH' | 'USDC';
    gasOptimization: boolean;
  };
  verificationStatus: {
    emailVerified: boolean;
    phoneVerified: boolean;
    identityVerified: boolean;
  };
}

export default function OnboardingDashboard() {
  const { user, authenticated } = usePrivy();
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    bio: '',
    location: '',
    phoneNumber: '',
    profileImage: null,
    preferences: {
      notifications: true,
      marketingEmails: false,
      smsUpdates: false,
    },
    walletSettings: {
      autoPayments: true,
      preferredCurrency: 'USDC',
      gasOptimization: true,
    },
    verificationStatus: {
      emailVerified: false,
      phoneVerified: false,
      identityVerified: false,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const totalSteps = 4;

  // Initialize profile with user data
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        displayName: AuthService.getUserDisplayName(user),
        verificationStatus: {
          ...prev.verificationStatus,
          emailVerified: user.email?.verified || false,
        },
      }));
    }
  }, [user]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Save profile to backend/localStorage
      localStorage.setItem('hanumo_user_profile', JSON.stringify(profile));
      localStorage.setItem('hanumo_onboarding_complete', 'true');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsComplete(true);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedProfile = (parent: keyof UserProfile, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="glass-dark rounded-2xl p-8 max-w-md mx-4 text-center">
          <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400">Please connect your wallet to continue</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-dark rounded-2xl p-8 max-w-md mx-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-4">Welcome to Hanumo!</h2>
          <p className="text-gray-400 mb-6">
            Your profile has been set up successfully. You're ready to start renting and listing properties!
          </p>
          <motion.button
            onClick={() => window.location.href = '/dashboard'}
            className="cyber-button group flex items-center justify-center space-x-2 w-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-300">
            Let's set up your Web3 rental profile to get started
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-400">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Profile */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg w-fit mx-auto mb-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
                  <p className="text-gray-400">Tell us about yourself</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={profile.displayName}
                      onChange={(e) => updateProfile('displayName', e.target.value)}
                      className="w-full px-4 py-3 glass rounded-lg border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => updateProfile('bio', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 glass rounded-lg border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => updateProfile('location', e.target.value)}
                      className="w-full px-4 py-3 glass rounded-lg border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profile.phoneNumber}
                      onChange={(e) => updateProfile('phoneNumber', e.target.value)}
                      className="w-full px-4 py-3 glass rounded-lg border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Wallet Setup */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg w-fit mx-auto mb-4">
                    <Wallet className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Wallet Configuration</h2>
                  <p className="text-gray-400">Set up your crypto payment preferences</p>
                </div>

                <div className="space-y-6">
                  {/* Wallet Type Display */}
                  <div className="glass rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3 mb-3">
                      {user?.wallet?.walletClientType === 'privy' ? (
                        <Bot className="h-6 w-6 text-blue-400" />
                      ) : (
                        <Wallet className="h-6 w-6 text-purple-400" />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {user?.wallet?.walletClientType === 'privy' ? 'Privy Delegate Wallet' : 'External Wallet'}
                        </h3>
                        <p className="text-sm text-gray-400 font-mono">
                          {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 'No wallet'}
                        </p>
                      </div>
                    </div>
                    {user?.wallet?.walletClientType === 'privy' && (
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-sm text-green-300">
                          <strong>🤖 Auto-Payment Enabled:</strong> Your delegate wallet can automatically handle rent payments and deposits.
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Payment Preferences</label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Preferred Currency</span>
                        <select
                          value={profile.walletSettings.preferredCurrency}
                          onChange={(e) => updateNestedProfile('walletSettings', 'preferredCurrency', e.target.value)}
                          className="px-3 py-2 glass rounded-lg border border-white/10 text-white bg-transparent focus:border-blue-500 focus:outline-none"
                        >
                          <option value="USDC">USDC</option>
                          <option value="ETH">ETH</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Auto-Payments</span>
                        <button
                          onClick={() => updateNestedProfile('walletSettings', 'autoPayments', !profile.walletSettings.autoPayments)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            profile.walletSettings.autoPayments ? 'bg-blue-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            profile.walletSettings.autoPayments ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Gas Optimization</span>
                        <button
                          onClick={() => updateNestedProfile('walletSettings', 'gasOptimization', !profile.walletSettings.gasOptimization)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            profile.walletSettings.gasOptimization ? 'bg-blue-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            profile.walletSettings.gasOptimization ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Preferences */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg w-fit mx-auto mb-4">
                    <Settings className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Preferences</h2>
                  <p className="text-gray-400">Customize your experience</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Notification Settings</label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Push Notifications</span>
                        <button
                          onClick={() => updateNestedProfile('preferences', 'notifications', !profile.preferences.notifications)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            profile.preferences.notifications ? 'bg-blue-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            profile.preferences.notifications ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Marketing Emails</span>
                        <button
                          onClick={() => updateNestedProfile('preferences', 'marketingEmails', !profile.preferences.marketingEmails)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            profile.preferences.marketingEmails ? 'bg-blue-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            profile.preferences.marketingEmails ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">SMS Updates</span>
                        <button
                          onClick={() => updateNestedProfile('preferences', 'smsUpdates', !profile.preferences.smsUpdates)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            profile.preferences.smsUpdates ? 'bg-blue-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            profile.preferences.smsUpdates ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Verification */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg w-fit mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Verification</h2>
                  <p className="text-gray-400">Complete your profile verification</p>
                </div>

                <div className="space-y-4">
                  <div className="glass rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${profile.verificationStatus.emailVerified ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                          {profile.verificationStatus.emailVerified ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <User className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Email Verification</h3>
                          <p className="text-sm text-gray-400">
                            {profile.verificationStatus.emailVerified ? 'Verified' : 'Pending verification'}
                          </p>
                        </div>
                      </div>
                      {profile.verificationStatus.emailVerified ? (
                        <span className="text-green-400 text-sm font-medium">✓ Verified</span>
                      ) : (
                        <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                          Verify
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${profile.verificationStatus.phoneVerified ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                          {profile.verificationStatus.phoneVerified ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <CreditCard className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Phone Verification</h3>
                          <p className="text-sm text-gray-400">
                            {profile.verificationStatus.phoneVerified ? 'Verified' : 'Add phone number to verify'}
                          </p>
                        </div>
                      </div>
                      {profile.verificationStatus.phoneVerified ? (
                        <span className="text-green-400 text-sm font-medium">✓ Verified</span>
                      ) : (
                        <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                          Verify
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${profile.verificationStatus.identityVerified ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                          {profile.verificationStatus.identityVerified ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <Shield className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Identity Verification</h3>
                          <p className="text-sm text-gray-400">
                            {profile.verificationStatus.identityVerified ? 'Verified' : 'Optional - for enhanced security'}
                          </p>
                        </div>
                      </div>
                      {profile.verificationStatus.identityVerified ? (
                        <span className="text-green-400 text-sm font-medium">✓ Verified</span>
                      ) : (
                        <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                          Verify
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between items-center mt-8"
        >
          <motion.button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg transition-colors ${
              currentStep === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'glass text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            whileHover={currentStep > 1 ? { scale: 1.05 } : {}}
            whileTap={currentStep > 1 ? { scale: 0.95 } : {}}
          >
            Back
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={isLoading}
            className="cyber-button group flex items-center space-x-2 px-6 py-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{currentStep === totalSteps ? 'Complete Setup' : 'Next'}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
