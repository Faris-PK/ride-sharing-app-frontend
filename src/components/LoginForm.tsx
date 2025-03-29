import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import Form from "./Form";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const res = await axios.post("/auth/login", data);
      const { user } = res.data;
      dispatch(setUser({ id: user._id,name: user.name, email: data.email, role: user.role }));
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid credentials");
    }
  };

  return <Form type="login" onSubmit={handleLogin} />;
};

export default LoginForm;