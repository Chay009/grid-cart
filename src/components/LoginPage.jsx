import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilCallback } from "recoil";
import { userState } from "../../src/store/atoms/user";
import { toast } from "react-hot-toast";
import "../index.css";

function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const setUserRecoil = useSetRecoilState(userState);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Recoil callback for atomic state updates
  const handleLogin = useRecoilCallback(({ set }) => async () => {
    if (user.email.trim() === "" || user.password.trim() === "") {
      setMessage("Email/password field cannot be empty");
      return;
    }

    try {
      setIsLoading(true); // Set loading to true before making the request

      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/login`, {
        username: user.email,
        password: user.password,
      });

      // Update Recoil state atomically
      set(userState, (prev) => ({
        ...prev,
        email: user.email,
        username: user.email.split("@")[0].toUpperCase(),
        isLoggedIn: true,
      }));

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("email", user.email);
      localStorage.setItem("userId", res.data.userId);
      console.log(res.data.userId);

      setMessage("");
      toast.success(res.data.message);
      setIsLoading(false);
      navigate("/products");
    } catch (err) {
      console.log(err);
      setMessage(err.response.data.message);
      toast.error(err.response.data.message);
      setIsLoading(false);
    }
  });

  useEffect(() => {
    // Check localStorage for previous login
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userEmail = localStorage.getItem("email");

    if (isLoggedIn && userEmail) {
      setUserRecoil({
        email: userEmail,
        username: userEmail.split("@")[0].toUpperCase(),
        isLoggedIn: true,
      });
      navigate("/products");
    }
  }, [setUserRecoil, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">
            Welcome to CourseHub
          </h2>
          <p className="text-gray-600">Sign in Below</p>
        </div>
        <input
          type="email"
          className="text-black w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          onChange={(e) =>
            setUser((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <input
          type="password"
          className="text-black w-full  p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          onChange={(e) =>
            setUser((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        {isLoading ? (
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 border-4 border-t-4 border-gray-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <button
            className="w-full px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
            onClick={handleLogin}
            disabled={isLoading} // Disable button while loading
          >
            Sign in
          </button>
        )}
        {message && (
          <p className="mt-4 text-sm text-center text-red-600">{message}</p>
        )}
        <div className="mt-6 text-center">
          <h3 className="font-semibold text-gray-700">
            New here? Click below to register a new account.
          </h3>
          <button
            className="w-full mt-4 px-4 py-3 text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-300"
            onClick={() => navigate("/register")}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
