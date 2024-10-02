import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { userState } from "../store/atoms/user";
import { userEmailState } from "../store/selectors/userEmailState";
import { CircleUserRound,  PhoneCall,  ShoppingBasket, Store } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Appbar() {
  const userEmail = useRecoilValue(userEmailState);
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const avatarRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("email");
    setUser({
      email: "",
      password: "",
      username: "",
      isLoggedIn: false,
    });
    setShowDropdown(false);
    navigate("/");
  };

  const handleAvatarClick = () => {
    setShowDropdown((prev) => !prev);
  };

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="top-0 left-0 w-full flex items-center justify-between p-4 bg-sky-800 shadow-lg z-50">
      <div
        className="flex items-center cursor-pointer ml-4"
        onClick={() => navigate("/")}
      >
        <h1 className="text-white font-bold text-2xl md:text-3xl">Gridkart</h1>
      </div>

      <div className="flex  items-center gap-2 mr-4">
        {userEmail || user?.Email ? (
          <>
            <button
              className="bg-green-600 text-white  h-10 sm:w-auto sm:h-auto px-2 sm:px-4 py-2 rounded flex items-center justify-center hover:bg-green-700 transition duration-300"
              onClick={() => navigate("/contact/sellers")}
            >
              <PhoneCall className="mr-2 w-5 h-5" />
             Sellers
            </button>

            <button
              className="bg-pink-600 text-white h-10 sm:w-auto sm:h-auto px-2 sm:px-4 py-2 rounded flex items-center justify-center hover:bg-pink-700 transition duration-300"
              onClick={() => navigate("/products/purchased")}
            >
              <ShoppingBasket />
              <span className=" hidden sm:inline">Purchased</span>
            </button>

            <div className="relative" ref={avatarRef}>
              <div
                className="w-10 h-10 bg-gradient-to-tr from-orange-300 to-red-500 rounded-full flex items-center justify-center text-white text-lg font-semibold cursor-pointer"
                onClick={handleAvatarClick}
              >
                {localStorage.getItem("email")[0].toUpperCase()}
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 text-gray-800 font-medium">
                    {localStorage.getItem("email")}
                  </div>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              className="bg-yellow-600 text-white  h-10  px-2 sm:px-4 py-2 rounded flex items-center justify-center hover:bg-blue-700 transition duration-300"
              onClick={() => navigate("/login")}
            >
              <CircleUserRound className="mr-2 w-5 h-5" />
              Login
            </button>

            <button
              className="bg-orange-600 text-white  h-10  px-2 sm:px-4 py-2 rounded flex items-center justify-center hover:bg-orange-700 transition duration-300"
              onClick={() => navigate("/login")}
            >
              <Store className="mr-2 w-5 h-5" />
              Seller
            </button>
          </> 
        )}
      </div>
    </div>
  );
}
