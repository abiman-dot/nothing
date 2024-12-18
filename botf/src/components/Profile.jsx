import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import UseAll from "../hooks/useall";
import axios from "axios";

const Profile = () => {
  const teleNumber = "999" 
  const role = "user"
  // const teleNumber = localStorage.getItem("teleNumber") || null;  
  // const role = localStorage.getItem("role");  
   const navigate = useNavigate();
  const { data, isLoading, error } = UseAll();
  const [filterStatus, setFilterStatus] = useState("published");
  const [email, setEmail] = useState("");
const userId = localStorage.getItem("userId")
  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  // Handle status filtering
  const handleStatusClick = (status) => {
    setFilterStatus(status);
  };

  // Handle email form submission
  const handleLoginSubmit =async (e) => {
    e.preventDefault();
    if (email) {
      try{
 
        await axios.put("https://add-bot-server.vercel.app/api/user/updateuser",{
           email,
           userId
           
        })

      }catch(err){
console.log(err)
      }
      localStorage.setItem("teleEmail", email);
      alert("Logged in successfully");
      window.location.reload();

    }
  };

  // Filtered properties logic
  const filteredProperties = data
    ? data.filter(
        (property) =>
          property.userTeleNumber === teleNumber &&
          property.status === filterStatus
      )
    : [];

  if (!teleNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <FaUserCircle className="text-blue-500 w-24 h-24 mx-auto" />
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <p className="text-xl font-bold text-gray-700">Login</p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleCardClick = (property) => {
    navigate(`/agentPub/${property.id}`, { state: { property } });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4">
      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center relative">
        <FaUserCircle className="text-blue-500 w-24 h-24 mx-auto" />
        <p className="mt-4 text-xl font-bold text-gray-700">{teleNumber}</p>
        <p className="text-sm text-gray-500">Welcome back! Here is your dashboard.</p>
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Filter Buttons for Agents */}
      {role === "agent" && (
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => handleStatusClick("published")}
            className={`px-4 py-2 rounded shadow ${
              filterStatus === "published"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-400 transition`}
          >
            Published
          </button>
          <button
            onClick={() => handleStatusClick("rented")}
            className={`px-4 py-2 rounded shadow ${
              filterStatus === "rented"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-green-400 transition`}
          >
            Rented
          </button>
          <button
            onClick={() => handleStatusClick("archieve")}
            className={`px-4 py-2 rounded shadow ${
              filterStatus === "archived"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-red-400 transition`}
          >
            Archived
          </button>
        </div>
      )}

      {/* Properties Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
          {role === "user" ? "Login Form" : `${filterStatus} Properties`}
        </h2>

        {role === "user" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>
        ) : isLoading ? (
          <p className="text-gray-600 text-center">Loading properties...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error fetching properties.</p>
        ) : filteredProperties.length > 0 ? (
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="flex flex-col sm:flex-row p-4 bg-gray-50 border rounded-lg shadow hover:shadow-lg cursor-pointer transition-shadow duration-200"
              onClick={() => handleCardClick(property)}
            >
              {/* Left Section */}
              <div className="w-full sm:w-1/2 flex-shrink-0">
                <img
                  src={property.image || "https://via.placeholder.com/150"}
                  alt={property.title || "Untitled"}
                  className="w-full h-32 object-cover rounded"
                />
                <div className="mt-2 sm:mt-4">
                  <p className="text-sm font-medium">Price: {property.price || "N/A"}</p>
                  <p className="text-sm">Type: {property.type || "N/A"}</p>
                  <p className="text-sm">Time: {property.time || "N/A"}</p>
                </div>
              </div>
        
              {/* Right Section */}
              <div className="w-full sm:w-1/2 flex flex-col justify-between px-4 mt-2 sm:mt-0">
                <h3 className="text-lg font-semibold mb-2">{property.title || "Untitled"}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {property.description || "No description available."}
                </p>
                <button
                  className="mt-auto self-start px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent onClick event
                    handleCardClick(property);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        

          
        ) : (
          <p className="text-gray-500 text-center">No properties found.</p>
        )}
      </div>
    </div>
  );
};

Profile.propTypes = {
  teleNumber: PropTypes.string,
};

export default Profile;
