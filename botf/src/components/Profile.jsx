import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import UseAll from "../hooks/useall";
import axios from "axios";
import getAllUsers from "../api/getAllUsers"; // Assuming this is the hook to fetch all users

const Profile = () => {
  // const teleNumber = "1219674630";
  // const role = "agent";  
   const teleNumber = localStorage.getItem("teleNumber")
  const role = localStorage.getItem("role")
    const navigate = useNavigate();
  const { data, isLoading, error } = UseAll();
  const [filterStatus, setFilterStatus] = useState("published");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const userId = localStorage.getItem("userId");
  const [showUpdateForm, setShowUpdateForm] = useState(false); // Toggle form visibility
  const API_BASE_URL = "https://nothing-server.vercel.app/api";

  const toggleUpdateForm = () => {
    setShowUpdateForm((prev) => !prev);
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const users = await getAllUsers(); // Fetch all users
        const matchedUser = users.find((user) => user.teleNumber === teleNumber);
        if (matchedUser) {
          setFirstName(matchedUser.username || "");
          setLastName(matchedUser.surname || "");
          setEmail(matchedUser.email || "");
            localStorage.setItem("firstName",matchedUser.username)
          localStorage.setItem("lastName",matchedUser.surname)
          localStorage.setItem("email",matchedUser.email)
        }
       
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (teleNumber) {
      fetchUserDetails();
    }
  }, [teleNumber]);

  // Handle profile updates
  const handleProfileUpdate = async () => {
    try {
      // Build payload dynamically based on the role
      const payload = {
        teleNumber, // Include teleNumber for identification
        username: firstName, // Map firstName to username
        surname: lastName,   // Map lastName to surname
      };
  
      // Include email only if the role is "agent"
      if (role === "agent") {
        payload.email = email;
      }
  
      const endpoint = role === "agent" ? `${API_BASE_URL}/user/updateAgent` : `${API_BASE_URL}/user/updateUser`;
  
      const response = await axios.put(endpoint, payload);
  
      console.log(`${role.charAt(0).toUpperCase() + role.slice(1)} profile updated:`, response.data);
      alert("Profile updated successfully!");
      return response.data;
    } catch (error) {
      console.error(`Error updating ${role} profile:`, error.response?.data || error.message);
      alert("Failed to update profile. Please try again.");
    }
  };
  

  // Handle status filtering
  const handleStatusClick = (status) => {
    setFilterStatus(status);
  };

  // Handle email form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        await axios.put("https://nothing-server.vercel.app/api/user/updateuser", {
          email,
          userId,
        });
        localStorage.setItem("teleEmail", email);
        alert("Logged in successfully");
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
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
        <p className="mt-4 text-xl font-bold text-gray-700">{firstName}</p>
        <p className="text-sm text-gray-500">Welcome back! {role} Here is your dashboard.</p>
        <button
          onClick={toggleUpdateForm}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {showUpdateForm ? "Hide Update Form" : "Update"}
        </button>
      </div>

      {/* Profile Update Section */}
     
      {showUpdateForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Update Profile</h2>
          <div className="space-y-4">
          <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            {role === "agent" && (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            )}
            <button
              onClick={handleProfileUpdate}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Filter Buttons for Agents */}
      {role === "agent" ? (
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
              filterStatus === "archieve"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-red-400 transition`}
          >
            Archived
          </button>
        </div>
      )
     :(
// USer
      <div className="flex justify-center space-x-4 mb-4">
      <button
        onClick={() => handleStatusClick("draft")}
        className={`px-4 py-2 rounded shadow ${
          filterStatus === "draft" 
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        } hover:bg-blue-400 transition`}
      >
        Creation
      </button>
       
      <button
        onClick={() => handleStatusClick()}
        className={`px-4 py-2 rounded shadow ${
          filterStatus === ""
            ? "bg-red-500 text-white"
            : "bg-gray-200 text-gray-700"
        } hover:bg-red-400 transition`}
      >
        History
      </button>
    </div>
     )
    }

      {/* Properties Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
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
