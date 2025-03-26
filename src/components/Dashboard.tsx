import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { clearUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import PassengerDashboard from "./passenger/PassengerDashboard";
import DriverDashboard from "./driver/DriverDashboard";

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-gray-200">
      <div className="bg-white p-6 shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.name}
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
        <p className="text-gray-600 mt-2">
          Role: <span className="capitalize font-medium">{user?.role}</span>
        </p>
      </div>
      
      {user?.role === 'passenger' ? <PassengerDashboard /> : <DriverDashboard />}
    </div>
  );
};

export default Dashboard;