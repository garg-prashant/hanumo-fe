'use client';

import { useState } from 'react';
import { Property, RentalAgreement } from '@/lib/types';
import { formatPrice, formatAddress } from '@/lib/utils';
import { MapPin, XCircle } from 'lucide-react';

interface RentalModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRental: (agreement: Partial<RentalAgreement>) => void;
}

export default function RentalModal({ 
  property, 
  isOpen, 
  onClose, 
  onConfirmRental 
}: RentalModalProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');

  if (!isOpen || !property) return null;

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days * parseFloat(property.pricePerDay);
  };

  const handleConfirm = () => {
    const agreement: Partial<RentalAgreement> = {
      propertyId: property.id,
      startDate,
      endDate,
      totalPrice: calculateTotalPrice().toString(),
      securityDeposit: securityDeposit || '0',
      status: 'pending',
    };
    onConfirmRental(agreement);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="glass-dark rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Rent Property</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Property Info */}
        <div className="glass p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">{property.title}</h3>
          <div className="flex items-center text-gray-300 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.location}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">
              Owner: {formatAddress(property.owner)}
            </span>
            <span className="text-lg font-bold text-blue-400">
              {formatPrice(property.pricePerDay)}/day
            </span>
          </div>
        </div>

        {/* Rental Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security Deposit (Optional)
            </label>
            <input
              type="number"
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Price Summary */}
          {startDate && endDate && (
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Rental Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Daily Rate:</span>
                  <span>{formatPrice(property.pricePerDay)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days</span>
                </div>
                {securityDeposit && (
                  <div className="flex justify-between">
                    <span>Security Deposit:</span>
                    <span>{formatPrice(securityDeposit)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span>Total:</span>
                  <span>{formatPrice(calculateTotalPrice() + parseFloat(securityDeposit || '0'))}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 glass text-gray-300 rounded-md hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!startDate || !endDate}
            className="flex-1 px-4 py-2 cyber-button disabled:bg-gray-500/50 disabled:cursor-not-allowed"
          >
            Confirm Rental
          </button>
        </div>
      </div>
    </div>
  );
}
