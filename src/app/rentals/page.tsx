'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { formatPrice, formatDate } from '@/lib/utils';
import { Calendar, User, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import Header from '@/components/Header';
import StarBackground from '@/components/StarBackground';

interface RentalHistory {
  id: string;
  propertyTitle: string;
  tenant: string;
  startDate: string;
  endDate: string;
  totalPrice: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'upcoming';
}

export default function MyRentals() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'history'>('upcoming');

  // Mock data for demonstration
  const rentalHistory: RentalHistory[] = [
    {
      id: '1',
      propertyTitle: 'Crypto Nomad Loft - Downtown NYC',
      tenant: address || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      totalPrice: '0.025',
      status: 'upcoming',
    },
    {
      id: '2',
      propertyTitle: 'DAO House - Malibu Beachfront',
      tenant: address || '0x8ba1f109551bD432803012645Hac136c66C4e',
      startDate: '2024-01-20',
      endDate: '2024-01-30',
      totalPrice: '0.08',
      status: 'completed',
    },
    {
      id: '3',
      propertyTitle: 'Eco-Friendly Crypto Cabin',
      tenant: address || '0x1234567890abcdef1234567890abcdef12345678',
      startDate: '2024-02-01',
      endDate: '2024-02-10',
      totalPrice: '0.027',
      status: 'active',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'upcoming':
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
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen text-white relative overflow-x-hidden">
        <StarBackground intensity="low" />
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="glass-dark rounded-lg p-8 max-w-md mx-4">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Connect Your Wallet</h2>
            <p className="text-gray-300 text-center mb-6">
              Please connect your wallet to view your rental history
            </p>
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md">
                <User className="h-4 w-4 mr-2" />
                Connect Wallet
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden">
      <StarBackground intensity="low" />
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Rentals</h1>
          <p className="text-gray-300">
            Manage your rental bookings and track your travel history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-dark rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Upcoming Rentals</p>
                <p className="text-2xl font-bold text-white">
                  {rentalHistory.filter(r => r.status === 'upcoming').length}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-dark rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Active Rentals</p>
                <p className="text-2xl font-bold text-white">
                  {rentalHistory.filter(r => r.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-dark rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Total Spent</p>
                <p className="text-2xl font-bold text-white">
                  {formatPrice(rentalHistory.reduce((sum, r) => sum + parseFloat(r.totalPrice), 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-dark rounded-lg">
          <div className="border-b border-white/10">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'active', label: 'Active' },
                { id: 'history', label: 'History' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'upcoming' | 'active' | 'history')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Rental List */}
            <div className="space-y-4">
              {rentalHistory
                .filter(rental => {
                  if (activeTab === 'upcoming') return rental.status === 'upcoming';
                  if (activeTab === 'active') return rental.status === 'active';
                  if (activeTab === 'history') return rental.status === 'completed';
                  return false;
                })
                .map((rental) => (
                  <div key={rental.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      {getStatusIcon(rental.status)}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{rental.propertyTitle}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatPrice(rental.totalPrice)}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(rental.status)}`}>
                        {rental.status}
                      </span>
                    </div>
                  </div>
                ))}
              
              {rentalHistory.filter(rental => {
                if (activeTab === 'upcoming') return rental.status === 'upcoming';
                if (activeTab === 'active') return rental.status === 'active';
                if (activeTab === 'history') return rental.status === 'completed';
                return false;
              }).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No rentals found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
