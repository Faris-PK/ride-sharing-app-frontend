import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";

// Define form inputs with optional fields for login and required for signup
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform transition-all hover:shadow-xl"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {type === "login" ? "Login" : "Sign Up"}
        </h2>

        {type === "signup" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
            })}
            className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
            className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {type === "signup" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                {...register("phone", { required: "Phone is required" })}
                className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                {...register("role", { required: "Role is required" })}
                className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="passenger">Passenger</option>
                <option value="driver">Driver</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {type === "login" ? "Login" : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          {type === "login" ? (
            <>
              Don’t have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
            </>
          ) : (
            <>
              Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Form;