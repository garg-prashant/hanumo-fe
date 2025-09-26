'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice, formatAddress, formatDate } from '@/lib/utils';
import { 
  Calendar, MapPin, User, DollarSign, Clock, CheckCircle, XCircle, 
  Wallet, Shield, Zap, Settings, CreditCard, TrendingUp, AlertCircle,
  Lock, Unlock, RefreshCw, Eye, EyeOff, Bot, Smartphone, Monitor
} from 'lucide-react';
import { AuthService } from '@/lib/auth';

interface DashboardStats {
  totalProperties: number;
  activeRentals: number;
  totalEarnings: string;
  pendingRequests: number;
}

interface RentalHistory {
  id: string;
  propertyTitle: string;
  tenant: string;
  startDate: string;
  endDate: string;
  totalPrice: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  autoPaymentEnabled: boolean;
}

interface DelegateWalletInfo {
  address: string;
  type: 'privy' | 'external';
  autoPaymentEnabled: boolean;
  transactionPermissions: {
    rentPayments: boolean;
    securityDeposits: boolean;
    utilityPayments: boolean;
    maintenanceFees: boolean;
  };
  balance: {
    eth: string;
    usdc: string;
  };
  lastTransaction?: {
    type: string;
    amount: string;
    timestamp: string;
  };
}

export default function UserDashboard() {
  const { ready, authenticated, user } = usePrivy();
  const [activeTab, setActiveTab] = useState<'overview' | 'wallet' | 'rentals' | 'properties'>('overview');
  const [delegateWallet, setDelegateWallet] = useState<DelegateWalletInfo | null>(null);
  const [showBalance, setShowBalance] = useState(false);

  // Initialize delegate wallet info when user is authenticated
  useEffect(() => {
    if (authenticated && user?.wallet) {
      const walletInfo: DelegateWalletInfo = {
        address: user.wallet.address,
        type: user.wallet.walletClientType === 'privy' ? 'privy' : 'external',
        autoPaymentEnabled: user.wallet.walletClientType === 'privy', // Privy wallets can auto-pay
        transactionPermissions: {
          rentPayments: user.wallet.walletClientType === 'privy',
          securityDeposits: user.wallet.walletClientType === 'privy',
          utilityPayments: user.wallet.walletClientType === 'privy',
          maintenanceFees: user.wallet.walletClientType === 'privy',
        },
        balance: {
          eth: '0.25', // Mock data - would fetch from blockchain
          usdc: '1250.00',
        },
        lastTransaction: {
          type: 'Rent Payment',
          amount: '0.15 ETH',
          timestamp: '2024-01-15T10:30:00Z',
        },
      };
      setDelegateWallet(walletInfo);
    }
  }, [authenticated, user]);

  // Mock data for demonstration
  const stats: DashboardStats = {
    totalProperties: 3,
    activeRentals: 2,
    totalEarnings: '2500',
    pendingRequests: 1,
  };

  const rentalHistory: RentalHistory[] = [
    {
      id: '1',
      propertyTitle: 'Modern Downtown Apartment',
      tenant: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      totalPrice: '1125',
      status: 'active',
      autoPaymentEnabled: delegateWallet?.autoPaymentEnabled || false,
    },
    {
      id: '2',
      propertyTitle: 'Cozy Beach House',
      tenant: '0x8ba1f109551bD432803012645Hac136c66C4e',
      startDate: '2024-01-20',
      endDate: '2024-01-30',
      totalPrice: '1000',
      status: 'completed',
      autoPaymentEnabled: false,
    },
    {
      id: '3',
      propertyTitle: 'Luxury Penthouse Suite',
      tenant: '0x1234567890abcdef1234567890abcdef12345678',
      startDate: '2024-02-10',
      endDate: '2024-02-20',
      totalPrice: '2500',
      status: 'pending',
      autoPaymentEnabled: delegateWallet?.autoPaymentEnabled || false,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="glass-dark rounded-2xl p-8 max-w-md mx-4 text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Loading Dashboard</h2>
          <p className="text-gray-400">Initializing your Web3 dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="glass-dark rounded-2xl p-8 max-w-md mx-4 text-center">
          <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-6">
            Please connect your wallet to access your dashboard
          </p>
          <motion.button
            className="cyber-button group flex items-center justify-center space-x-2 px-6 py-3 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Wallet className="h-4 w-4" />
            <span>Connect Wallet</span>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Web3 Dashboard
          </h1>
          <p className="text-gray-300">
            Welcome back, {AuthService.getUserDisplayName(user!)} 
            {delegateWallet?.type === 'privy' && ' 🔐'}
          </p>
        </motion.div>

        {/* Delegate Wallet Status Card */}
        {delegateWallet && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-dark rounded-2xl p-6 mb-8 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  {delegateWallet.type === 'privy' ? (
                    <Bot className="h-6 w-6 text-white" />
                  ) : (
                    <Wallet className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {delegateWallet.type === 'privy' ? 'Privy Delegate Wallet' : 'External Wallet'}
                  </h3>
                  <p className="text-sm text-gray-400 font-mono">
                    {formatAddress(delegateWallet.address)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {delegateWallet.autoPaymentEnabled ? (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-lg border border-green-500/30">
                    <Unlock className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-green-400 font-medium">Auto-Pay Enabled</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <Lock className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-yellow-400 font-medium">Manual Payments</span>
                  </div>
                )}
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">ETH Balance</span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    {showBalance ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
                <p className="text-lg font-bold text-white">
                  {showBalance ? `${delegateWallet.balance.eth} ETH` : '•••• ETH'}
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">USDC Balance</span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    {showBalance ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
                <p className="text-lg font-bold text-white">
                  {showBalance ? `$${delegateWallet.balance.usdc}` : '•••• USDC'}
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Last Transaction</span>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-sm text-white">
                  {delegateWallet.lastTransaction?.type || 'No recent transactions'}
                </p>
                <p className="text-xs text-gray-400">
                  {delegateWallet.lastTransaction?.amount || ''}
                </p>
              </div>
            </div>

            {/* Transaction Permissions */}
            {delegateWallet.type === 'privy' && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Automatic Transaction Permissions</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(delegateWallet.transactionPermissions).map(([key, enabled]) => (
                    <div key={key} className="flex items-center space-x-2">
                      {enabled ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span className="text-sm text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-blue-300">
                    <strong>🤖 Auto-Payment Active:</strong> Your delegate wallet can automatically pay rent, deposits, and fees without manual approval.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-dark rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Properties</p>
                <p className="text-2xl font-bold text-white">{stats.totalProperties}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-dark rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Rentals</p>
                <p className="text-2xl font-bold text-white">{stats.activeRentals}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-dark rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-white">{formatPrice(stats.totalEarnings)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-dark rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Pending Requests</p>
                <p className="text-2xl font-bold text-white">{stats.pendingRequests}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-dark rounded-2xl border border-white/10"
        >
          <div className="border-b border-white/10">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Monitor },
                { id: 'wallet', label: 'Wallet', icon: Wallet },
                { id: 'rentals', label: 'Rental History', icon: Calendar },
                { id: 'properties', label: 'My Properties', icon: MapPin },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {rentalHistory.slice(0, 3).map((rental) => (
                        <div key={rental.id} className="glass rounded-xl p-4 border border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(rental.status)}
                              <div>
                                <p className="text-sm font-medium text-white">{rental.propertyTitle}</p>
                                <p className="text-sm text-gray-400">
                                  {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-white">{formatPrice(rental.totalPrice)}</p>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  rental.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                  rental.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                                  rental.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {rental.status}
                                </span>
                                {rental.autoPaymentEnabled && (
                                  <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 rounded-full">
                                    <Bot className="h-3 w-3 text-green-400" />
                                    <span className="text-xs text-green-400">Auto-Pay</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <motion.button 
                          className="w-full text-left glass rounded-xl p-4 hover:bg-white/5 transition-colors border border-white/10"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 text-blue-400 mr-3" />
                            <div>
                              <p className="font-medium text-white">List New Property</p>
                              <p className="text-sm text-gray-400">Add a new property to rent</p>
                            </div>
                          </div>
                        </motion.button>
                        <motion.button 
                          className="w-full text-left glass rounded-xl p-4 hover:bg-white/5 transition-colors border border-white/10"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-green-400 mr-3" />
                            <div>
                              <p className="font-medium text-white">View Rentals</p>
                              <p className="text-sm text-gray-400">Manage your rental agreements</p>
                            </div>
                          </div>
                        </motion.button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Occupancy Rate</span>
                            <span className="font-medium text-white">85%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Average Rating</span>
                            <span className="font-medium text-white">4.8/5</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Wallet Tab */}
              {activeTab === 'wallet' && delegateWallet && (
                <motion.div
                  key="wallet"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Wallet Management</h3>
                    
                    {/* Wallet Type Info */}
                    <div className="glass rounded-xl p-6 border border-white/10 mb-6">
                      <div className="flex items-center space-x-3 mb-4">
                        {delegateWallet.type === 'privy' ? (
                          <Bot className="h-6 w-6 text-blue-400" />
                        ) : (
                          <Wallet className="h-6 w-6 text-purple-400" />
                        )}
                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            {delegateWallet.type === 'privy' ? 'Privy Delegate Wallet' : 'External Wallet'}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {delegateWallet.type === 'privy' 
                              ? 'AI-powered wallet with automatic transaction capabilities'
                              : 'Traditional wallet requiring manual transaction approval'
                            }
                          </p>
                        </div>
                      </div>

                      {delegateWallet.type === 'privy' && (
                        <div className="space-y-4">
                          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="h-5 w-5 text-green-400" />
                              <span className="font-semibold text-green-400">Automatic Payments Enabled</span>
                            </div>
                            <p className="text-sm text-green-300">
                              Your delegate wallet can automatically pay rent, deposits, and fees without requiring manual approval for each transaction.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="glass rounded-lg p-4 border border-white/10">
                              <h5 className="font-semibold text-white mb-3">Transaction Permissions</h5>
                              <div className="space-y-2">
                                {Object.entries(delegateWallet.transactionPermissions).map(([key, enabled]) => (
                                  <div key={key} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-300 capitalize">
                                      {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                    {enabled ? (
                                      <CheckCircle className="h-4 w-4 text-green-400" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-red-400" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="glass rounded-lg p-4 border border-white/10">
                              <h5 className="font-semibold text-white mb-3">Security Features</h5>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Shield className="h-4 w-4 text-blue-400" />
                                  <span className="text-sm text-gray-300">Smart Contract Verification</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Lock className="h-4 w-4 text-green-400" />
                                  <span className="text-sm text-gray-300">Encrypted Private Keys</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Zap className="h-4 w-4 text-yellow-400" />
                                  <span className="text-sm text-gray-300">Gas Optimization</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Transaction History */}
                    <div className="glass rounded-xl p-6 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">Recent Transactions</h4>
                      <div className="space-y-3">
                        {delegateWallet.lastTransaction ? (
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-green-500/20 rounded-lg">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{delegateWallet.lastTransaction.type}</p>
                                <p className="text-xs text-gray-400">
                                  {new Date(delegateWallet.lastTransaction.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-white">{delegateWallet.lastTransaction.amount}</p>
                              {delegateWallet.type === 'privy' && (
                                <div className="flex items-center space-x-1">
                                  <Bot className="h-3 w-3 text-blue-400" />
                                  <span className="text-xs text-blue-400">Auto</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Clock className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                            <p className="text-gray-400">No recent transactions</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Rentals Tab */}
              {activeTab === 'rentals' && (
                <motion.div
                  key="rentals"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Rental History</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Property
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Tenant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Payment
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {rentalHistory.map((rental) => (
                          <tr key={rental.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">{rental.propertyTitle}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300 font-mono">{formatAddress(rental.tenant)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300">
                                {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">{formatPrice(rental.totalPrice)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                rental.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                rental.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                                rental.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {rental.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {rental.autoPaymentEnabled ? (
                                <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 rounded-full">
                                  <Bot className="h-3 w-3 text-green-400" />
                                  <span className="text-xs text-green-400">Auto-Pay</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 rounded-full">
                                  <CreditCard className="h-3 w-3 text-yellow-400" />
                                  <span className="text-xs text-yellow-400">Manual</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Properties Tab */}
              {activeTab === 'properties' && (
                <motion.div
                  key="properties"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">My Properties</h3>
                    <motion.button 
                      className="cyber-button group flex items-center space-x-2 px-4 py-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MapPin className="h-4 w-4" />
                      <span>Add Property</span>
                    </motion.button>
                  </div>
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Property management features coming soon...</p>
                    <p className="text-sm text-gray-500">
                      List properties, manage bookings, and track earnings with Web3 integration
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
