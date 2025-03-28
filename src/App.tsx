import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { JSX } from "react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import DashboardPage from "./pages/DashboardPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </Router>
  );
}

export default App;