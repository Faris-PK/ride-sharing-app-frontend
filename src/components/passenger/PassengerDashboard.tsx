import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import RideRequestModal from './RideRequestModal';
import RideRouteModal from './RideRouteModal';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Clock, Check, MapPin, X, RefreshCw, Map } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface Ride {
  _id: string;
  pickup: string;
  dropoff: string;
  status: 'Pending' | 'Accepted' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
  passengerId: string;
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

const PassengerDashboard = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['geometry', 'places'],
  });

  const fetchRides = async () => {
    try {
      const response = await axios.get('/rides/my-rides');
      setRides(response.data);
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  };

  useEffect(() => {
    fetchRides()
  }, [])

  useEffect(() => {
   // fetchRides();

    const newSocket = io(API_URL, { withCredentials: true });
    setSocket(newSocket);

    newSocket.on('ride:created', (ride: Ride) => {
      setRides((prevRides) => {
        if (ride.passengerId === prevRides[0]?.passengerId) {
          return [ride, ...prevRides];
        }
        return prevRides;
      });
      fetchRides();
    });

    newSocket.on('ride:accepted', (ride: Ride) => {
      setRides((prevRides) => prevRides.map(r => r._id === ride._id ? ride : r));
    });

    newSocket.on('ride:status-updated', (ride: Ride) => {
      setRides((prevRides) => prevRides.map(r => r._id === ride._id ? ride : r));
    });

    // Added: Listen for location updates
    newSocket.on('ride:location-updated', ({ rideId, driverLocation }) => {
      setRides((prevRides) =>
        prevRides.map((r) =>
          r._id === rideId ? { ...r, driverLocation } : r
        )
      );
      const ride = rides.find((r) => r._id === rideId);
      if (ride && ride.status === 'In Progress') {
        setDriverLocation(driverLocation);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleShowRoute = (ride: Ride) => {
    setSelectedRide(ride);
    setIsRouteModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Rides</h1>
        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
        >
          <MapPin className="w-5 h-5" />
          <span>Request a Ride</span>
        </button>
      </div>

      <RideRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onRideRequested={() => {}}
      />

      <RideRouteModal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        pickup={selectedRide?.pickup || ''}
        dropoff={selectedRide?.dropoff || ''}
      />

      {rides.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-xl">No rides requested yet.</p>
          <p className="text-gray-500 mt-2">Click "Request a Ride" to get started</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rides.map((ride) => {
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
                        <p className="text-gray-500 text-sm">
                          {new Date(ride.createdAt).toLocaleString()}
                        </p>
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
                        <span className="text-gray-700 font-medium">From: {ride.pickup}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <span className="text-gray-700 font-medium">To: {ride.dropoff}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleShowRoute(ride)}
                      className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Map className="w-5 h-5" />
                      <span>Show Route</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Added: Display driver location map */}
          {isLoaded && driverLocation && rides.some(ride => ride.status === 'In Progress') && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Driver Location</h2>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '400px' }}
                center={driverLocation}
                zoom={15}
              >
                <Marker position={driverLocation} label="Driver" />
              </GoogleMap>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PassengerDashboard;