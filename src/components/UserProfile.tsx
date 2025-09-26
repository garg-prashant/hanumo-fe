// Example component showing how to use Privy authentication data
'use client';

import { usePrivy } from '@privy-io/react-auth';
import { AuthService } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Wallet, Mail, Shield, Database } from 'lucide-react';

export default function UserProfile() {
  const { authenticated, user, ready } = usePrivy();
  const [authData, setAuthData] = useState<any>(null);

  useEffect(() => {
    if (authenticated && user) {
      // Get stored authentication data
      const stored = AuthService.getStoredAuth();
      setAuthData(stored);
    }
  }, [authenticated, user]);

  if (!ready) {
    return (
      <div className="glass-dark rounded-xl p-6 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Loading authentication...</p>
      </div>
    );
  }

  if (!authenticated || !user) {
    return (
      <div className="glass-dark rounded-xl p-6 text-center">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Please connect your wallet to view profile</p>
      </div>
    );
  }

  return (
    <motion.div
      className="glass-dark rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          {AuthService.getUserAvatar(user) ? (
            <img
              src={AuthService.getUserAvatar(user)!}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-white" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            {AuthService.getUserDisplayName(user)}
          </h2>
          <p className="text-gray-400 text-sm">
            {AuthService.getPrimaryIdentifier(user)}
          </p>
        </div>
      </div>

      {/* Authentication Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Wallet className="h-5 w-5 text-blue-400" />
            <span className="font-medium text-white">Wallet</span>
          </div>
          {user.wallet ? (
            <div>
              <p className="text-sm text-gray-300">
                {AuthService.formatAddress(user.wallet.address)}
              </p>
              <p className="text-xs text-gray-500">
                {user.wallet.walletClient} • Chain {user.wallet.chainId}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No wallet connected</p>
          )}
        </div>

        <div className="glass rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Mail className="h-5 w-5 text-green-400" />
            <span className="font-medium text-white">Email</span>
          </div>
          {user.email ? (
            <div>
              <p className="text-sm text-gray-300">{user.email.address}</p>
              <p className="text-xs text-gray-500">
                {user.email.verified ? '✅ Verified' : '❌ Not verified'}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No email connected</p>
          )}
        </div>
      </div>

      {/* Social Logins */}
      {(user.google || user.twitter || user.discord) && (
        <div className="glass rounded-lg p-4 mb-6">
          <h3 className="font-medium text-white mb-3">Connected Accounts</h3>
          <div className="space-y-2">
            {user.google && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <div>
                  <p className="text-sm text-white">{user.google.name}</p>
                  <p className="text-xs text-gray-500">{user.google.email}</p>
                </div>
              </div>
            )}
            {user.twitter && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <div>
                  <p className="text-sm text-white">{user.twitter.name}</p>
                  <p className="text-xs text-gray-500">@{user.twitter.username}</p>
                </div>
              </div>
            )}
            {user.discord && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">D</span>
                </div>
                <div>
                  <p className="text-sm text-white">{user.discord.username}</p>
                  <p className="text-xs text-gray-500">#{user.discord.discriminator}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backend Connection Status */}
      <div className="glass rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-2">
          <Database className="h-5 w-5 text-purple-400" />
          <span className="font-medium text-white">Backend Status</span>
        </div>
        {authData ? (
          <div>
            <p className="text-sm text-green-400">✅ Connected to backend</p>
            <p className="text-xs text-gray-500">
              User ID: {authData.user.id} • Session expires: {new Date(authData.session.expiresAt).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p className="text-sm text-yellow-400">⚠️ Backend connection pending</p>
        )}
      </div>

      {/* Raw Data (for debugging) */}
      <details className="mt-6">
        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white">
          View Raw User Data
        </summary>
        <pre className="mt-2 p-4 bg-black/50 rounded-lg text-xs text-gray-300 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </details>
    </motion.div>
  );
}
