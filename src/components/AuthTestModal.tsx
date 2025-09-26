// Authentication Test Modal - Shows JWT token and user data after login
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import { AuthService } from '@/lib/auth';
import { X, Copy, Check, Database, Shield, User, Wallet, Mail } from 'lucide-react';

interface AuthTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthTestModal({ isOpen, onClose }: AuthTestModalProps) {
  const privyHook = usePrivy();
  const { user } = privyHook;
  const [authData, setAuthData] = useState<any>(null);
  const [privyToken, setPrivyToken] = useState<string>('');
  const [backendToken, setBackendToken] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadAuthData();
    }
  }, [isOpen, user]);

  const loadAuthData = async () => {
    setIsLoading(true);
    try {
      // Check if getAccessToken is available
      const getAccessToken = privyHook.getAccessToken;
      if (!getAccessToken || typeof getAccessToken !== 'function') {
        console.warn('⚠️ getAccessToken method not available in test modal');
        setPrivyToken('');
        setBackendToken('');
        setIsLoading(false);
        return;
      }

      // Get Privy ID token
      const privyIdToken = await getAccessToken();
      if (privyIdToken) {
        setPrivyToken(privyIdToken);
        
        // Decode Privy token for display
        const tokenPayload = AuthService.decodeJWT(privyIdToken);
        console.log('🔍 Test Modal - Privy Token Payload:', tokenPayload);
      } else {
        console.warn('No Privy token available');
        setPrivyToken('');
      }

      // Get stored backend auth data
      const stored = AuthService.getStoredAuth();
      setAuthData(stored);
      if (stored && stored.accessToken) {
        setBackendToken(stored.accessToken);
      } else {
        setBackendToken('');
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
      setPrivyToken('');
      setBackendToken('');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatToken = (token: string) => {
    if (!token) return 'No token available';
    return `${token.slice(0, 50)}...${token.slice(-20)}`;
  };

  const getTokenPayload = (token: string) => {
    if (!token || token === 'No token available') {
      return null;
    }
    try {
      return AuthService.decodeJWT(token);
    } catch (error) {
      console.warn('Error getting token payload:', error);
      return null;
    }
  };

  const privyPayload = getTokenPayload(privyToken);
  const backendPayload = getTokenPayload(backendToken);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden glass-dark rounded-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Authentication Test</h2>
                  <p className="text-sm text-gray-400">JWT Token & User Data</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="h-5 w-5 text-gray-400" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <span className="ml-3 text-gray-400">Loading authentication data...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* User Info */}
                  <div className="glass rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <User className="h-5 w-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">User Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Privy ID</label>
                        <p className="text-white font-mono text-sm">{user?.id || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Display Name</label>
                        <p className="text-white">{AuthService.getUserDisplayName(user!) || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Email</label>
                        <p className="text-white">{user?.email?.address || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Wallet Address</label>
                        <p className="text-white font-mono text-sm">
                          {user?.wallet?.address ? AuthService.formatAddress(user.wallet.address) : 'N/A'}
                        </p>
                        {user?.wallet?.address && (
                          <p className="text-xs text-blue-400 mt-1">
                            {user.wallet.walletClientType === 'privy' ? '🔐 Privy Delegate Wallet' : '🔗 External Wallet'}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Wallet Type</label>
                        <p className="text-white text-sm">
                          {user?.wallet?.walletClientType || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Information */}
                  <div className="glass rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Wallet className="h-5 w-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">Wallet Information</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <div>
                          <p className="text-white font-medium">Delegate Wallet Active</p>
                          <p className="text-sm text-gray-400">
                            {user?.wallet?.walletClientType === 'privy' 
                              ? 'Privy automatically created an embedded wallet for this user'
                              : 'User connected with their existing wallet'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <p className="text-sm text-blue-300">
                          <strong>💡 Crypto Payments Ready:</strong> This user can now make crypto payments (ETH, USDC) and interact with smart contracts, regardless of how they logged in!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Privy JWT Token */}
                  <div className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Database className="h-5 w-5 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">Privy ID Token</h3>
                      </div>
                      <motion.button
                        onClick={() => copyToClipboard(privyToken, 'privy')}
                        className="flex items-center space-x-2 px-3 py-1 glass rounded-lg hover:bg-white/10 transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        {copiedField === 'privy' ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-400">Copy</span>
                      </motion.button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-400">Token (Preview)</label>
                        <p className="text-white font-mono text-sm bg-black/50 p-2 rounded">
                          {formatToken(privyToken)}
                        </p>
                      </div>
                      
                      {privyPayload && (
                        <div>
                          <label className="text-sm text-gray-400">Token Payload</label>
                          <pre className="text-xs text-gray-300 bg-black/50 p-3 rounded overflow-auto max-h-40">
                            {JSON.stringify(privyPayload, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Backend JWT Token */}
                  <div className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">Backend JWT Token</h3>
                      </div>
                      <motion.button
                        onClick={() => copyToClipboard(backendToken, 'backend')}
                        className="flex items-center space-x-2 px-3 py-1 glass rounded-lg hover:bg-white/10 transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        {copiedField === 'backend' ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-400">Copy</span>
                      </motion.button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-400">Token (Preview)</label>
                        <p className="text-white font-mono text-sm bg-black/50 p-2 rounded">
                          {formatToken(backendToken)}
                        </p>
                      </div>
                      
                      {backendPayload && (
                        <div>
                          <label className="text-sm text-gray-400">Token Payload</label>
                          <pre className="text-xs text-gray-300 bg-black/50 p-3 rounded overflow-auto max-h-40">
                            {JSON.stringify(backendPayload, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Authentication Status */}
                  <div className="glass rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Authentication Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${privyToken ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className="text-sm text-gray-300">Privy Token</span>
                        <span className="text-xs text-gray-500">
                          {privyToken ? '✅ Available' : '❌ Missing'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${backendToken ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                        <span className="text-sm text-gray-300">Backend Token</span>
                        <span className="text-xs text-gray-500">
                          {backendToken ? '✅ Available' : '⚠️ Pending'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${authData ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                        <span className="text-sm text-gray-300">Backend Auth</span>
                        <span className="text-xs text-gray-500">
                          {authData ? '✅ Connected' : '⚠️ Not Connected'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${user?.email?.verified ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                        <span className="text-sm text-gray-300">Email Verified</span>
                        <span className="text-xs text-gray-500">
                          {user?.email?.verified ? '✅ Verified' : '⚠️ Not Verified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Raw User Data */}
                  <div className="glass rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Raw Privy User Data</h3>
                    <pre className="text-xs text-gray-300 bg-black/50 p-3 rounded overflow-auto max-h-60">
                      {JSON.stringify(user, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-white/10">
              <div className="text-sm text-gray-400">
                Use this data to test your backend integration
              </div>
              <div className="flex space-x-3">
                <motion.button
                  onClick={loadAuthData}
                  className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Refresh
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
