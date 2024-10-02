import axios from "axios";
import { PhoneCall } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";



const SellersList = () => {
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Dummy data for initial placeholders
  const dummyUsers = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com" },
    { id: 4, name: "Lisa Martin", email: "lisa@example.com" },
  ];

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/getsellers`)
      .then((res) => {
        console.log(res.data.sellers);
        setSellers(res.data.sellers);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-8 ">
    <h1 className="text-4xl font-bold text-center mb-12 text-white">
      Available Sellers
    </h1>
    <div className="grid  md:grid-cols-2 lg:grid-cols-3   gap-6 ">
      {sellers?.map((seller) => (
        <div
          key={seller.sellerId}
          className="group  bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col justify-between"
        >
          <div className="flex items-center space-x-4 ">
            <div className=" w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
              {seller.sellername[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                {seller.sellername}
              </h2>
              <p className="text-sm text-gray-500">{seller.email}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
            <Link to={`/contact/seller/${seller.sellername}/${seller.sellerId}`}>
          <button className="flex items-center justify-center mt-6 w-full py-2 px-4 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-200">
          <PhoneCall className="mr-2" />
            Call
          </button>
            </Link>
        </div>
      ))}
    </div>
  </div>
  
  
  );
};

export default SellersList;
