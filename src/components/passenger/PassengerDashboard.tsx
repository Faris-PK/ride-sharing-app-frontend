import { Bus, Car, Navigation, User } from 'lucide-react'


const PassengerDashboard = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-6">
      <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-4">
        <Bus className="text-blue-600" size={40} />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Active Rides</h3>
          <p className="text-gray-600">Manage current trips</p>
        </div>
      </div>
      <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-4">
        <Navigation className="text-green-600" size={40} />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Route Insights</h3>
          <p className="text-gray-600">View route performance</p>
        </div>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg flex items-center space-x-4">
        <Car className="text-purple-600" size={40} />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Vehicle Management</h3>
          <p className="text-gray-600">Update vehicle details</p>
        </div>
      </div>
      <div className="bg-indigo-50 p-4 rounded-lg flex items-center space-x-4">
        <User className="text-indigo-600" size={40} />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
          <p className="text-gray-600">Manage your profile</p>
        </div>
      </div>
    </div>
  )
}

export default PassengerDashboard