import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { LogIn, User, Mail, Lock, Smartphone, Car } from 'lucide-react';
import { IoCarSportSharp } from "react-icons/io5";

type FormInputs = {
  email: string;
  password: string;
} & Partial<{
  name: string;
  phone: string;
  role: "passenger" | "driver";
}>;

type FormProps = {
  type: "login" | "signup";
  onSubmit: SubmitHandler<FormInputs>;
};

const Form = ({ type, onSubmit }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  return (
<div className="min-h-screen bg-gradient-to-br from-green-400 to-green-800 flex items-center justify-center p-4 relative overflow-hidden">

      <div className="relative w-full max-w-md z-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-black-800 overflow-hidden">
  
          <div className="p-6 space-y-4">
          <div className="text-center mb-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-lg">
              <IoCarSportSharp className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-500 tracking-tight italic">Nav!go</h1>
            <p className="text-gray-600 mt-1 text-base">
              {type === "login" ? "Welcome Back!" : "Create Your Account"}
            </p>
          </div>

            {/* Authentication Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {type === "signup" && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-400 w-4 h-4 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <input 
                    {...register("name", { required: "Name is required" })}
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400 w-4 h-4 green-focus-within:text-green-500 transition-colors" />
                </div>
                <input 
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" }
                  })}
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400 w-4 h-4 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input 
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                  type="password" 
                  placeholder="Password" 
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {type === "signup" && (
                <>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Smartphone className="text-gray-400 w-4 h-4 group-focus-within:text-green-500 transition-colors" />
                    </div>
                    <input 
                      {...register("phone", { required: "Phone is required" })}
                      type="tel" 
                      placeholder="Phone Number" 
                      className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div className="relative group">
                    <select 
                      {...register("role", { required: "Role is required" })}
                      className="w-full pl-3 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select Role</option>
                      <option value="passenger">Passenger</option>
                      <option value="driver">Driver</option>
                    </select>
                    {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
                  </div>
                </>
              )}


              <button 
                type="submit" 
                className="w-full bg-gradient-to-br cursor-pointer from-green-500 to-green-600 text-white py-2.5 rounded-lg flex items-center justify-center shadow-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:from-green-600 hover:to-green-700 active:scale-95 active:shadow-md active:from-green-700 active:to-green-800"
              >
                <LogIn className="mr-2 w-4 h-4 " />
                {type === "login" ? 'Log In' : 'Sign Up'}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-xs text-gray-600">
                {type === "login" ? "Don't have an account? " : "Already have an account? "}
                <Link 
                  to={type === "login" ? "/signup" : "/login"}
                  className="text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  {type === "login" ? 'Sign Up' : 'Log In'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;