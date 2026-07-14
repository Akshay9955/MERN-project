// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router";
// import api from "../api/axios";

// const Checkout = () => {
//   const navigate = useNavigate();

//   // State management
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddressId, setSelectedAddressId] = useState("");
//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [checkoutLoading, setCheckoutLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Retrieve userId dynamically from localStorage
//   const userId = localStorage.getItem("userId");

//   // Fetch addresses + cart on mount
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!userId || userId === "undefined" || userId === "null") {
//         setError("User not authenticated. Please log in.");
//         setLoading(false);
//         return;
//       }

//       try {
//         // Fetch addresses and cart in parallel
//         const [addressRes, cartRes] = await Promise.all([
//           api.get(`/address/${userId}`),
//           api.get(`/cart/${userId}`),
//         ]);

//         if (addressRes.data.success) {
//           setAddresses(addressRes.data.data);
//           if (addressRes.data.data.length > 0) {
//             setSelectedAddressId(addressRes.data.data[0]._id);
//           }
//         }

//         setCart(cartRes.data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load checkout details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userId]);

//   // Compute totals from cart
//   const subtotal = cart?.items?.reduce(
//     (sum, item) => sum + item.productId.price * item.quantity,
//     0
//   ) ?? 0;
//   const delivery = subtotal > 500 ? 0 : 49;
//   const totalPayable = subtotal + delivery;

//   // Main checkout processing function
//   const handleCheckout = async () => {
//     if (!selectedAddressId) {
//       alert("Please select a shipping address to proceed.");
//       return;
//     }

//     setCheckoutLoading(true);
//     try {
//       const orderPayload = {
//         userId,
//         items: cart.items.map((item) => ({
//           productId: item.productId._id,
//           quantity: item.quantity,
//         })),
//         addressId: selectedAddressId,
//         totalAmount: totalPayable,
//         paymentMethod: "COD", // Defaulting to Cash on Delivery
//       };

//       // POST to /api/orders/place via api instance (has auth token)
//       const response = await api.post("/orders/place", orderPayload);

//       if (response.data.success) {
//         const selectedAddress = addresses.find(
//           (a) => a._id === selectedAddressId
//         );
//         navigate("/order-success", {
//           state: {
//             order: response.data.data, // Accessing the saved order from backend response
//             address: selectedAddress,
//             items: cart?.items || [],
//             subtotal,
//             delivery,
//             totalPayable,
//           },
//         });
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Checkout failed. Please try again.");
//     } finally {
//       setCheckoutLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="text-center mt-20 text-gray-600 font-medium">Loading checkout details...</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto my-10 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//       {/* Left side: Address Selection */}
//       <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">Select Delivery Address</h2>
//           <button
//             onClick={() => navigate("/checkout-address")}
//             className="text-sm font-semibold text-blue-600 hover:text-blue-800"
//           >
//             + Add New
//           </button>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
//             {error}
//           </div>
//         )}

//         {addresses.length === 0 ? (
//           <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-md">
//             <p className="text-gray-500 mb-4">No saved addresses found.</p>
//             <button
//               onClick={() => navigate("/checkout-address")}
//               className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
//             >
//               Add Your First Address
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {addresses.map((addr) => (
//               <label
//                 key={addr._id}
//                 className={`block p-4 border rounded-lg cursor-pointer transition ${selectedAddressId === addr._id
//                     ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20"
//                     : "border-gray-200 hover:border-gray-300"
//                   }`}
//               >

//                 <div className="flex items-start">

//                   <input
//                     type="radio"
//                     name="selectedAddress"
//                     value={addr._id}
//                     checked={selectedAddressId === addr._id}
//                     onChange={() => setSelectedAddressId(addr._id)}
//                     className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                   />
//                   <div className="ml-3">

//                     <p className="font-bold text-gray-800">{addr.fullName}</p>
//                     <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
//                     <p className="text-sm text-gray-600">
//                       {addr.city}, {addr.state} - {addr.pincode}
//                     </p>
//                     {addr.Country && <p className="text-xs text-gray-500 mt-0.5">{addr.Country}</p>}
//                     <p className="text-xs font-medium text-gray-500 mt-2">Phone: {addr.phone}</p>


//                   </div>
//                 </div>
//               </label>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Right side: Order Summary & Action */}
//       <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit">
//         <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>

//         {/* Cart items */}
//         {cart?.items?.length > 0 && (
//           <div className="space-y-2 mb-4">
//             {cart.items.map((item) => (
//               <div key={item.productId._id} className="flex justify-between text-sm text-gray-600">
//                 <span className="truncate max-w-[150px]">
//                   {item.productId.title} × {item.quantity}
//                 </span>
//                 <span>₹{(item.productId.price * item.quantity).toFixed(2)}</span>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Totals */}
//         <div className="space-y-2 border-t border-gray-200 pt-4 pb-4 mb-4 text-sm text-gray-600">
//           <div className="flex justify-between">
//             <span>Items Subtotal</span>
//             <span>₹{subtotal.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Delivery charges</span>
//             {delivery === 0
//               ? <span className="text-green-600">FREE</span>
//               : <span>₹{delivery.toFixed(2)}</span>
//             }
//           </div>
//           {subtotal > 0 && subtotal <= 500 && (
//             <p className="text-xs text-gray-400">Add ₹{(500 - subtotal).toFixed(2)} more for free delivery</p>
//           )}
//         </div>

//         <div className="flex justify-between font-bold text-base text-gray-800 mb-6">
//           <span>Total Payable</span>
//           <span>₹{totalPayable.toFixed(2)}</span>
//         </div>

//         <button
//           onClick={handleCheckout}
//           disabled={checkoutLoading || addresses.length === 0}
//           className={`w-full py-3 text-white font-bold rounded-md transition duration-200 uppercase tracking-wider text-sm ${checkoutLoading || addresses.length === 0
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20"
//             }`}
//         >
//           {checkoutLoading ? "Processing..." : "Place Order"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Checkout;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios";

const Checkout = () => {
  const navigate = useNavigate();

  // State management
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Matches 'COD' or 'UPI' enum
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  // Retrieve userId dynamically from localStorage
  const userId = localStorage.getItem("userId");

  // Fetch addresses + cart on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!userId || userId === "undefined" || userId === "null") {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // Fetch addresses and cart in parallel
        const [addressRes, cartRes] = await Promise.all([
          api.get(`/address/${userId}`),
          api.get(`/cart/${userId}`),
        ]);

        if (addressRes.data.success) {
          setAddresses(addressRes.data.data);
          if (addressRes.data.data.length > 0) {
            setSelectedAddressId(addressRes.data.data[0]._id);
          }
        }

        setCart(cartRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load checkout details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Compute totals from cart safely
  const subtotal = cart?.items?.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  ) ?? 0;
  const delivery = subtotal > 500 ? 0 : 49;
  const totalPayable = subtotal + delivery;

  // Main checkout processing function
  const handleCheckout = async () => {
    if (!selectedAddressId) {
      alert("Please select a shipping address to proceed.");
      return;
    }

    if (!cart?.items || cart.items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setCheckoutLoading(true);
    try {
      // Format items array to match nested order schema expectations exactly
      const formattedItems = cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price, // Maps directly to required nested price property
      }));

      // Constructed payload matching exactly what your orderSchema accepts
      const orderPayload = {
        userId,
        items: formattedItems,
        addressId: selectedAddressId, // Backend controller will use this to find and copy originalAddress values
        totalAmount: totalPayable,
        paymentMethod: paymentMethod, // Dynamically tracks 'COD' or 'UPI'
      };

      // POST to backend api instance
      const response = await api.post("/orders/place", orderPayload);

      if (response.data.success) {
        const selectedAddress = addresses.find(
          (a) => a._id === selectedAddressId
        );
        
        // Navigate on success and pass current states forward
        navigate("/order-success", {
          state: {
            order: response.data.data || response.data,
            address: selectedAddress,
            items: cart?.items || [],
            subtotal,
            delivery,
            totalPayable,
          },
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-600 font-medium">Loading checkout details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left side: Address Selection & Payment Method Setup */}
      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Select Delivery Address</h2>
          <button
            onClick={() => navigate("/checkout-address")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            + Add New
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {addresses.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-md">
            <p className="text-gray-500 mb-4">No saved addresses found.</p>
            <button
              onClick={() => navigate("/checkout-address")}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <label
                key={addr._id}
                className={`block p-4 border rounded-lg cursor-pointer transition ${
                  selectedAddressId === addr._id
                    ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={addr._id}
                    checked={selectedAddressId === addr._id}
                    onChange={() => setSelectedAddressId(addr._id)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <p className="font-bold text-gray-800">{addr.fullName}</p>
                    <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                    <p className="text-sm text-gray-600">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    {addr.Country && <p className="text-xs text-gray-500 mt-0.5">{addr.Country}</p>}
                    <p className="text-xs font-medium text-gray-500 mt-2">Phone: {addr.phone}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Interactive Payment Choice Selection Block */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Select Payment Method</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className={`p-4 border rounded-lg flex items-center cursor-pointer transition ${paymentMethod === "COD" ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/10" : "border-gray-200"}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 font-semibold text-gray-700">Cash On Delivery (COD)</span>
            </label>
            <label className={`p-4 border rounded-lg flex items-center cursor-pointer transition ${paymentMethod === "UPI" ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/10" : "border-gray-200"}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={() => setPaymentMethod("UPI")}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 font-semibold text-gray-700">UPI Payments (GPay/PhonePe)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Right side: Summary Dashboard Calculations */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>

        {/* Live Cart Array Render Loop */}
        {cart?.items?.length > 0 && (
          <div className="space-y-2 mb-4">
            {cart.items.map((item) => (
              <div key={item.productId?._id || Math.random()} className="flex justify-between text-sm text-gray-600">
                <span className="truncate max-w-[150px]">
                  {item.productId?.title || item.productId?.name || "Product"} × {item.quantity}
                </span>
                <span>₹{((item.productId?.price || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Delivery Threshold Summary Layout */}
        <div className="space-y-2 border-t border-gray-200 pt-4 pb-4 mb-4 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Items Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery charges</span>
            {delivery === 0
              ? <span className="text-green-600 font-medium">FREE</span>
              : <span>₹{delivery.toFixed(2)}</span>
            }
          </div>
          {subtotal > 0 && subtotal <= 500 && (
            <p className="text-xs text-orange-500">Add ₹{(500 - subtotal).toFixed(2)} more for free delivery</p>
          )}
        </div>

  <div className="flex flex-col gap-4 border-t border-gray-200 pt-4 mb-6">
  <div className="flex justify-between font-bold text-base text-gray-800">
    <span>Total Payable</span>
    <span>₹{totalPayable.toFixed(2)}</span>
  </div>
  
  <button
    onClick={handleCheckout}
    disabled={checkoutLoading || addresses.length === 0}
    className={`w-full py-3 text-white font-bold rounded-md transition duration-200 uppercase tracking-wider text-sm ${
      checkoutLoading || addresses.length === 0
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20"
    }`}
  >
    {checkoutLoading ? "Processing Order..." : "Place Order"}
  </button>
</div>


      
      </div>
    </div>
  );
};export default Checkout;