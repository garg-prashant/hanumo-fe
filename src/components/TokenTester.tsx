'use client';

import { usePrivy } from '@privy-io/react-auth';
import { AuthService } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RefreshCw, Database, Key, User } from 'lucide-react';

export default function TokenTester() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [authData, setAuthData] = useState<any>(null);
  const [privyToken, setPrivyToken] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authenticated && user) {
      loadTokens();
    } else {
      setAuthData(null);
      setPrivyToken('');
    }
  }, [authenticated, user]);

  const loadTokens = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log('🧪 TOKEN TESTER: Loading tokens...');
      
      // Get Privy token
      const getAccessToken = usePrivy().getAccessToken;
      if (getAccessToken && typeof getAccessToken === 'function') {
        try {
          const token = await getAccessToken();
          setPrivyToken(token || '');
          console.log('🔐 Privy Token:', token);
        } catch (error) {
          console.warn('⚠️ Could not get Privy token:', error);
          setPrivyToken('');
        }
      } else {
        console.warn('⚠️ getAccessToken not available');
        setPrivyToken('');
      }

      // Get backend auth data
      const stored = AuthService.getStoredAuth();
      setAuthData(stored);
      console.log('🔑 Backend Auth Data:', stored);
      
    } catch (error) {
      console.error('❌ Error loading tokens:', error);
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

  const triggerAuth = async () => {
    if (!user) return;
    
    try {
      console.log('🚀 TOKEN TESTER: Triggering authentication...');
      const authPayload = await AuthService.authenticateWithBackend(user, async () => {
        const getAccessToken = usePrivy().getAccessToken;
        if (getAccessToken && typeof getAccessToken === 'function') {
          return await getAccessToken();
        }
        return 'mock_token_for_testing';
      });
      
      setAuthData(authPayload);
      console.log('✅ TOKEN TESTER: Authentication successful:', authPayload);
    } catch (error) {
      console.error('❌ TOKEN TESTER: Authentication failed:', error);
    }
  };

  if (!ready) {
    return (
      <div className="glass-dark rounded-xl p-6 text-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="glass-dark rounded-xl p-6 text-center">
        <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-4">Token Tester</h3>
        <p className="text-gray-400 mb-6">Please connect your wallet to test tokens</p>
        <motion.button
          onClick={login}
          className="cyber-button group flex items-center space-x-2 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <User className="h-4 w-4" />
          <span>Connect Wallet</span>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="glass-dark rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>Token Tester</span>
        </h3>
        <motion.button
          onClick={loadTokens}
          disabled={isLoading}
          className="p-2 rounded-lg glass hover:bg-blue-500/20 transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Privy Token */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Privy ID Token
        </label>
        <div className="relative">
          <textarea
            value={privyToken || 'No token available'}
            readOnly
            className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-sm font-mono text-gray-300 resize-none"
            rows={3}
          />
          {privyToken && (
            <button
              onClick={() => copyToClipboard(privyToken, 'privy')}
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-700 transition-colors"
            >
              {copiedField === 'privy' ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Backend Token */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Backend JWT Token
        </label>
        <div className="relative">
          <textarea
            value={authData?.accessToken || 'No token available'}
            readOnly
            className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-sm font-mono text-gray-300 resize-none"
            rows={3}
          />
          {authData?.accessToken && (
            <button
              onClick={() => copyToClipboard(authData.accessToken, 'backend')}
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-700 transition-colors"
            >
              {copiedField === 'backend' ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* User Data */}
      {authData && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            User Data
          </label>
          <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
            <pre className="text-sm text-gray-300 overflow-auto">
              {JSON.stringify(authData.user, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <motion.button
          onClick={triggerAuth}
          className="flex-1 cyber-button group flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Database className="h-4 w-4" />
          <span>Trigger Auth</span>
        </motion.button>
        
        <motion.button
          onClick={logout}
          className="px-4 py-2 rounded-lg glass hover:bg-red-500/20 transition-colors text-red-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>
      </div>
    </div>
  );
}
