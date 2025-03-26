import { 

    MapPin,
    Ticket,
    CreditCard,
    ShieldCheck
  } from "lucide-react";

const DriverDashboard = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-6">
    <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-4">
      <MapPin className="text-blue-600" size={40} />
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Book a Ride</h3>
        <p className="text-gray-600">Find your next destination</p>
      </div>
    </div>
    <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-4">
      <Ticket className="text-green-600" size={40} />
      <div>
        <h3 className="text-lg font-semibold text-gray-800">My Trips</h3>
        <p className="text-gray-600">View past and upcoming trips</p>
      </div>
    </div>
    <div className="bg-purple-50 p-4 rounded-lg flex items-center space-x-4">
      <CreditCard className="text-purple-600" size={40} />
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Payments</h3>
        <p className="text-gray-600">Manage payment methods</p>
      </div>
    </div>
    <div className="bg-indigo-50 p-4 rounded-lg flex items-center space-x-4">
      <ShieldCheck className="text-indigo-600" size={40} />
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Safety</h3>
        <p className="text-gray-600">Safety features and support</p>
      </div>
    </div>
  </div>
  )
}

export default DriverDashboard