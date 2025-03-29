import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import RideRouteModal from '../passenger/RideRouteModal';
import { MapPin, CheckCircle, Map, Clock, Check, RefreshCw, X } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface Ride {
  _id: string;
  passengerId: { name: string; email: string };
  pickup: string;
  dropoff: string;
  status: 'Pending' | 'Accepted' | 'In Progress' | 'Completed' | 'Cancelled';
  driverLocation?: { lat: number; lng: number; timestamp: string }; // Added
}

const STATUS_CONFIGS = {
  Pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="w-4 h-4 text-yellow-600" /> },
  Accepted: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Check className="w-4 h-4 text-blue-600" /> },
  'In Progress': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <RefreshCw className="w-4 h-4 text-purple-600" /> },
  Completed: { color: 'bg-green-100 text-green-800 border-green-200', icon: <MapPin className="w-4 h-4 text-green-600" /> },
  Cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: <X className="w-4 h-4 text-red-600" /> },
};

const API_URL = import.meta.env.VITE_BACKEND_URL;

const DriverDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [pendingRides, setPendingRides] = useState<Ride[]>([]);
  const [driverRides, setDriverRides] = useState<Ride[]>([]);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const fetchPendingRides = async () => {
    try {
      const response = await axios.get('/rides/pending');
      setPendingRides(response.data);
    } catch (err) {
      console.error('Error fetching pending rides:', err);
    }
  };

  const fetchDriverRides = async () => {
    try {
      const response = await axios.get('/rides/driver-rides');
      setDriverRides(response.data);
    } catch (err) {
      console.error('Error fetching driver rides:', err);
    }
  };

  useEffect(() => {
    if (user?.role === 'driver') {
      fetchPendingRides();
      fetchDriverRides();

      const newSocket = io(API_URL, { withCredentials: true });
      setSocket(newSocket);

      newSocket.on('ride:created', (ride: Ride) => {
        setPendingRides((prev) => [...prev, ride]);
      });

      newSocket.on('ride:accepted', (ride: Ride) => {
        setPendingRides((prev) => prev.filter(r => r._id !== ride._id));
        setDriverRides((prev) => {
          const exists = prev.some(r => r._id === ride._id);
          return exists ? prev.map(r => r._id === ride._id ? ride : r) : [ride, ...prev];
        });
      });

      newSocket.on('ride:status-updated', (ride: Ride) => {
        setDriverRides((prev) => prev.map(r => r._id === ride._id ? ride : r));
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  // Added: Send location updates when a ride is in progress
  useEffect(() => {
    if (user?.role === 'driver' && driverRides.some(ride => ride.status === 'In Progress')) {
      const interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const inProgressRide = driverRides.find(ride => ride.status === 'In Progress');
            if (inProgressRide) {
              try {
                await axios.put(`/rides/location/${inProgressRide._id}`, {
                  lat: latitude,
                  lng: longitude,
                });
              } catch (err) {
                console.error('Error updating location:', err);
              }
            }
          },
          (err) => console.error('Geolocation error:', err),
          { enableHighAccuracy: true }
        );
      }, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [driverRides, user]);

  const handleAcceptRide = async (rideId: string) => {
    try {
      await axios.post(`/rides/accept/${rideId}`);
    } catch (err) {
      console.error('Error accepting ride:', err);
    }
  };

  const handleUpdateStatus = async (rideId: string, status: string) => {
    try {
      await axios.put(`/rides/status/${rideId}`, { status });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleShowRoute = (ride: Ride) => {
    setSelectedRide(ride);
    setIsRouteModalOpen(true);
  };

  if (user?.role !== 'driver') return null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Driver Dashboard</h1>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Rides</h2>
      {driverRides.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg mb-6">
          <p className="text-gray-600 text-xl">No rides assigned yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {driverRides.map((ride) => {
            const statusConfig = STATUS_CONFIGS[ride.status];
            return (
              <div
                key={ride._id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">Ride Details</h3>
                      <p className="text-gray-500 text-sm">{ride.passengerId.name}</p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase flex items-center space-x-1 ${statusConfig.color}`}
                    >
                      {statusConfig.icon}
                      <span>{ride.status}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700 font-medium">{ride.pickup}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <span className="text-gray-700 font-medium">{ride.dropoff}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    {ride.status !== 'Completed' && ride.status !== 'Cancelled' && (
                      <select
                        value={ride.status}
                        onChange={(e) => handleUpdateStatus(ride._id, e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 text-sm flex-1"
                      >
                        <option value="Accepted">Accepted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    )}
                    <button
                      onClick={() => handleShowRoute(ride)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 flex-1"
                    >
                      <Map className="w-5 h-5" />
                      <span>Route</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending Rides</h2>
      {pendingRides.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-xl">No pending rides available.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingRides.map((ride) => (
            <div
              key={ride._id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Ride Details</h3>
                    <p className="text-gray-500 text-sm">{ride.passengerId.name}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase flex items-center space-x-1 ${STATUS_CONFIGS.Pending.color}`}
                  >
                    {STATUS_CONFIGS.Pending.icon}
                    <span>Pending</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 font-medium">{ride.pickup}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700 font-medium">{ride.dropoff}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleAcceptRide(ride._id)}
                  className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Accept</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRide && (
        <RideRouteModal
          isOpen={isRouteModalOpen}
          onClose={() => setIsRouteModalOpen(false)}
          pickup={selectedRide.pickup}
          dropoff={selectedRide.dropoff}
        />
      )}
    </div>
  );
};

export default DriverDashboard;