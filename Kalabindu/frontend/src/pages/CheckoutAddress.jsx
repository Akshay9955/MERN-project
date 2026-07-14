import React, { useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios";

const CheckoutAddress = () => {
  const navigate = useNavigate();

  // Get the actual logged-in userId from localStorage
  const userId = localStorage.getItem("userId");

  // Initialize state matching your backend Mongoose model
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    Country: "India",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle inputs dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle submission, API call, and redirection
  const saveAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!userId || userId === "undefined" || userId === "null") {
      setError("You must be logged in to save an address.");
      setLoading(false);
      return;
    }

    try {
      // Build payload: include userId + cast phone & pincode to Numbers
      const payload = {
        userId,
        ...formData,
        phone: Number(formData.phone),
        pincode: Number(formData.pincode),
      };

      // POST to /api/address/add — api instance adds the Bearer token automatically
      const response = await api.post("/address/add", payload);

      if (response.data.success) {
        // Navigate to the checkout page on success
        navigate("/checkout");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Shipping Address</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={saveAddress} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="9876543210"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Flat/House No, Building, Street"
          ></textarea>
        </div>

        {/* City and State grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mumbai"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Maharashtra"
            />
          </div>
        </div>

        {/* Pincode and Country grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="400001"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
            <input
              type="text"
              name="Country"
              value={formData.Country}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="India"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-2.5 px-4 text-white font-medium rounded-md transition duration-200 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save Address & Proceed"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutAddress;
