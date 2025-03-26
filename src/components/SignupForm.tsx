import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import Form from "./Form";
import { SubmitHandler } from "react-hook-form";

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup: SubmitHandler<{
    name?: string;
    email: string;
    password: string;
    phone?: string;
    role?: "passenger" | "driver";
  }> = async (data) => {
    const signupData = {
      name: data.name!,
      email: data.email,
      password: data.password,
      phone: data.phone!,
      role: data.role!,
    };

    try {
      const res = await axios.post("/auth/signup", signupData);
      const { user } = res.data;
      dispatch(setUser({ name: signupData.name, email: signupData.email, role: user.role }));
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error("Signup failed");
    }
  };

  return <Form type="signup" onSubmit={handleSignup} />;
};

export default SignupForm;