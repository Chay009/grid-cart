import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function ProductCard(props) {
  const navigate = useNavigate();
  const [isMouseOver, setIsMouseOver] = useState(false);

  return (
    <div
      className={` bg-white border w-80  border-gray-200 rounded-lg overflow-hidden shadow-md m-4 p-6 transform transition-transform duration-300 ease-out ${
        isMouseOver ? "shadow-2xl scale-105" : "shadow-md scale-100"
      } cursor-pointer hover:border-purple-500`}
      onMouseOver={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      onClick={() => localStorage.getItem('email')&&navigate(`/products/${props.product.productId}`)}
    >
      {/* Product Image */}
      <div className="relative mb-5 h-64 flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300 rounded-lg overflow-hidden">
        <img
          src={props.product.imageLink}
          alt={props.product.title}
          className="w-full h-full object-contain transition-transform duration-500 ease-in-out transform hover:scale-110"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col space-y-4">
        {/* Product Title */}
        <h2 className="text-xl font-bold text-gray-900 leading-tight hover:text-purple-600 transition-colors duration-300 ease-in-out">
          {props.product.title.length > 50
            ? `${props.product.title.slice(0, 47)}...`
            : props.product.title}
        </h2>

        {/* Product Price */}
        <div className="flex flex-col">
          <span className="text-2xl font-extrabold text-gray-900">
            ${props.product.price.toFixed(2)}
          </span>
          {props.product.discount && (
            <span className="text-lg font-medium text-red-600">
              Save {props.product.discount}% 
            </span>
          )}
        </div>

        {/* Product Description */}
        <p className="text-gray-700 text-md leading-relaxed">
          {props.product.description.length > 140
            ? `${props.product.description.slice(0, 137)}...`
            : props.product.description}
        </p>

        {/* View Details Button */}
      { localStorage.getItem('email')? (<button
         className="bg-purple-500  hover:bg-purple-600 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out"
        > View Details
        </button>)

        :(
          <Link to="/login">
        <button
          className="bg-gray-500  hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out"
          >
       Login for More Info
        </button>
          </Link>
        )
        }
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    imageLink: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number,
  }).isRequired,
};

export default ProductCard;
