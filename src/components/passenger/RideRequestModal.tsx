import React, { useState } from 'react';
import axios from '../../api/axiosInstance';
import { MapPin, XCircle } from 'lucide-react';

interface RideRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRideRequested: () => void;
}

const RideRequestModal: React.FC<RideRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  onRideRequested 
}) => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/rides/request', { pickup, dropoff });
      setPickup('');
      setDropoff('');
      setError('');
      onRideRequested();
      onClose();
    } catch (err) {
      setError('Failed to request ride');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-green-500 p-6 text-white relative">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <MapPin className="w-6 h-6" />
            <span>Request a Ride</span>
          </h2>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white hover:text-green-100 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span>{error}</span>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter pickup location"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Drop-off Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
              <input
                type="text"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter drop-off location"
                required
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <MapPin className="w-5 h-5" />
              <span>Request Ride</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RideRequestModal;