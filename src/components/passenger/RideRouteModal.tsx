import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import axios from '../../api/axiosInstance';
import { MapPin, XCircle } from 'lucide-react';

interface RideRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  pickup: string;
  dropoff: string;
}

const RideRouteModal: React.FC<RideRouteModalProps> = ({ isOpen, onClose, pickup, dropoff }) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [error, setError] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['geometry'],
  });

  useEffect(() => {
    if (isOpen && isLoaded) {
      const fetchRoute = async () => {
        try {
          const directionsService = new google.maps.DirectionsService();
          directionsService.route(
            {
              origin: pickup,
              destination: dropoff,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK && result) {
                setDirections(result);
                const leg = result.routes[0].legs[0];
                setDistance(leg.distance?.text || '');
                setDuration(leg.duration?.text || '');
              } else {
                setError('Failed to calculate route');
              }
            }
          );
        } catch (err) {
          setError('Failed to load route');
        }
      };
      fetchRoute();
    }
  }, [isOpen, isLoaded, pickup, dropoff]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="bg-green-500 p-6 text-white relative">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <MapPin className="w-6 h-6" />
            <span>Ride Route</span>
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-green-100 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {error ? (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span>{error}</span>
            </div>
          ) : isLoaded ? (
            directions ? (
              <>
                <div className="mb-4">
                  <p className="text-gray-700">Distance: {distance}</p>
                  <p className="text-gray-700">Duration: {duration}</p>
                </div>
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '400px' }}
                  center={directions.routes[0].legs[0].start_location}
                  zoom={10}
                  onLoad={(map) => {
                    const bounds = new google.maps.LatLngBounds();
                    directions.routes[0].legs.forEach((leg) => {
                      bounds.extend(leg.start_location);
                      bounds.extend(leg.end_location);
                    });
                    map.fitBounds(bounds);
                  }}
                >
                  <DirectionsRenderer
                    directions={directions}
                    options={{
                      polylineOptions: {
                        strokeColor: '#1976D2', // Google Maps blue
                        strokeOpacity: 0.8,
                        strokeWeight: 5,
                      },
                      markerOptions: {
                        visible: true, // Show default markers
                      },
                    }}
                  />
                </GoogleMap>
              </>
            ) : (
              <p>Loading route...</p>
            )
          ) : (
            <p>Loading map...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideRouteModal;