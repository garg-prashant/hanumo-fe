'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { formatPrice } from '@/lib/utils';
import { MapPin, Bed, Square, Plus, Edit, Eye } from 'lucide-react';

export default function PropertyManagement() {
  const { isConnected } = useAccount();
  const [showListForm, setShowListForm] = useState(false);
  const [userProperties] = useState<unknown[]>([]);

  // Form state for listing new property
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerDay: '',
    location: '',
    propertyType: 'apartment',
    bedrooms: '',
    bathrooms: '',
    area: '',
  });

  const handleListProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;

    try {
      // Mock implementation - in real app, this would call smart contract
      console.log('Listing property:', formData);
      alert('Property listed successfully! (Mock implementation)');
      setShowListForm(false);
    } catch (error) {
      console.error('Error listing property:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Property Management</h1>
          <p className="text-gray-300">Manage your rental properties and track performance</p>
        </div>

        {!isConnected ? (
          <div className="text-center py-12">
            <div className="glass-dark border border-yellow-500/30 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Wallet Not Connected</h3>
              <p className="text-yellow-300">Please connect your wallet to manage properties</p>
            </div>
          </div>
        ) : (
          <>
            {/* Action Buttons */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowListForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  List New Property
                </button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  View Analytics
                </button>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProperties.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="glass-dark rounded-lg border border-white/10 p-8">
                    <h3 className="text-lg font-semibold text-white mb-2">No Properties Listed</h3>
                    <p className="text-gray-300 mb-4">Start by listing your first property</p>
                    <button
                      onClick={() => setShowListForm(true)}
                      className="cyber-button"
                    >
                      List Property
                    </button>
                  </div>
                </div>
              ) : (
                userProperties.map((property: unknown) => {
                  const prop = property as { id: string; title: string; isAvailable: boolean; location: string; bedrooms: number; bathrooms: number; area: number; pricePerDay: string };
                  return (
                    <div key={prop.id} className="glass-dark rounded-lg border border-white/10 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-white">{prop.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          prop.isAvailable 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {prop.isAvailable ? 'Available' : 'Rented'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{prop.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Bed className="h-4 w-4 mr-2" />
                          <span className="text-sm">{prop.bedrooms} bed • {prop.bathrooms} bath</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Square className="h-4 w-4 mr-2" />
                          <span className="text-sm">{prop.area} sq ft</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="text-lg font-bold text-blue-600">
                            {formatPrice(prop.pricePerDay)}/day
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                          <Edit className="h-4 w-4 inline mr-1" />
                          Edit
                        </button>
                        <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* List Property Modal */}
        {showListForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="glass-dark rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">List New Property</h2>
                <button
                  onClick={() => setShowListForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleListProperty} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Property Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 glass rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 glass rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Price per Day (ETH)
                    </label>
                    <input
                      type="number"
                      name="pricePerDay"
                      value={formData.pricePerDay}
                      onChange={handleInputChange}
                      required
                      step="0.001"
                      className="w-full px-3 py-2 glass rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 glass rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      required
                      min="1"
                      step="0.5"
                      className="w-full px-3 py-2 glass rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Property Type
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 glass rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="condo">Condo</option>
                      <option value="studio">Studio</option>
                      <option value="villa">Villa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Area (sq ft)
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 glass rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowListForm(false)}
                    className="flex-1 px-4 py-2 glass text-gray-300 rounded-md hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 cyber-button"
                  >
                    List Property
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}