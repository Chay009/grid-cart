import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "../../src/store/atoms/user";
import toast from "react-hot-toast";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userState);

  const handleSignUp = async () => {
    try {
      setLoading(true); // Set loading to true during signup

      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/signup`, {
        username: email,
        password: password,
      });

      const data = res.data;

      // Update Recoil state with the user information
      setUser({
        Email: email,
        username: email.split("@")[0].toUpperCase(),
        isLoggedIn: true,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("userId", data.userId);
      console.log(data.userId);

      // Navigate to the products page
      navigate("/products");
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error(error?.response?.data?.message)
      // Handle errors as needed
    } finally {
      setLoading(false); // Reset loading state after signup, whether success or error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome to CourseHub
          </h2>
          <p className="text-gray-600">Sign up Below</p>
        </div>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-black placeholder-gray-500"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-black placeholder-gray-500"
        />
        {/* Conditionally render loading spinner or signup button */}
        {loading ? (
          <div className="flex justify-center mb-6">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        ) : (
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 mb-6 disabled:opacity-50"
          >
            Sign Up
          </button>
        )}
        <div className="text-center">
          <h3 className="font-semibold text-gray-700 mb-4">
            Already a user? Login here..
          </h3>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
