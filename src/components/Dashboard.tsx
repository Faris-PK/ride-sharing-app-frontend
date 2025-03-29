import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { clearUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import PassengerDashboard from "./passenger/PassengerDashboard";
import DriverDashboard from "./driver/DriverDashboard";
import { Car, LogOut, User, ChevronDown } from 'lucide-react';
import { useState } from "react";
import { IoCarSportSharp } from "react-icons/io5";


const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-gradient-to-br from-green-600 to-green-500 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-white/40 p-1 rounded-lg">
              <IoCarSportSharp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-200 tracking-tight italic">Nav!go</h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
            >
              <span>{user?.name}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-10">
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{user?.name}</p>
                      <p className="text-gray-500 text-sm">{user?.email}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">
                    Role: <span className="capitalize font-medium text-green-600">{user?.role}</span>
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span className="text-red-600 font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {user?.role === 'passenger' ? <PassengerDashboard /> : <DriverDashboard />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;