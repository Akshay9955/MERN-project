
// import { useState, useEffect, } from "react";
// import axios from "axios";
// import api from "../api/axios";

// // const Cart = () => {
// // const userId = localStorage.getItem("userId");
// // const[cart, setcart] = useState(null);

// // //load cart data

// // const loadCart = async ()=>{
// //     if(!userId) return;
// //     const res = await api.get (`/cart/${userId}`);
// //     setcart(res.data);
// // }

// // useEffect(()=>{
// //     loadCart();

// // },[]);
// // const removeItem = async (productId) =>{
// //     await api.post (`/cart/remove`, {userId, productId});
// //     loadCart();
// //     window.dispatchEvent(new Event("cartUpdated"));
// // }

// // // update item quantity

// // const updateQty = async (productId, quantity) =>{
// //     if(quantity ===0){
// //         await removeItem(productId);
// //         return;
// //     }
// //     await api.post(`/cart/update`, {userId, productId , quantity});
// //     loadCart();
// //     window.dispatchEvent(new Event("cartUpdated"))
// // }
// // if(!cart){
// //     return<div>Loading...</div>;
// // }

// const Cart = () => {
//     // const userId = localStorage.getItem("userId");
//     const [userId, setUserId] = useState(localStorage.getItem("userId"));
//     // const [userId, setUserId] = useState(() => {
//     //     const id = localStorage.getItem("userId");
//     //     return id && id !== "undefined" && id !== "null" ? id : null;
//     // });
//     const [cart, setcart] = useState(null);
//     const [error, setError] = useState(null); // Added state to track errors

//     // 1. Load cart data safely
//     // const loadCart = async () => {
//     //     if (!userId) return;
//     //     try {
//     //         setError(null); // Clear previous errors before fetching
//     //         const res = await api.get(`/cart/${userId}`);
//     //         setcart(res.data);
//     //     } catch (err) {
//     //         console.error("Error loading cart:", err);
//     //         setError("Failed to load your cart. Please try again later.");
//     //     }
//     // };

//     const loadCart = async () => {
//         // FIX: Block literal string values "undefined" or "null" alongside normal falsy values
//         if (!userId || userId === "undefined" || userId === "null") {
//             return;
//         }
//         try {
//             setError(null);
//             const res = await api.get(`/cart/${userId}`);
//             setcart(res.data);
//         } catch (err) {
//             console.error("Error loading cart:", err);
//             setError("Failed to load your cart. Please try again later.");
//         }
//     };

//     useEffect(() => {
//         loadCart();
//     }, []);

//     // 2. Remove item safely
//     const removeItem = async (productId) => {
//         try {
//             await api.post(`/cart/remove`, { userId, productId }); // Don't send userId - it comes from token
//             await loadCart(); // Re-fetch data
//             window.dispatchEvent(new Event("cartUpdated"));
//         } catch (err) {
//             console.error("Error removing item:", err);
//             alert("Could not remove item. Please check your connection.");
//         }
//     };

//     // 3. Update quantity safely
//     const updateQty = async (productId, quantity) => {
//         if (quantity === 0) {
//             await removeItem(productId);
//             return;
//         }
//         try {
//             await api.post(`/cart/update`, { userId, productId, quantity , pricePerUnit }); // Don't send userId - it comes from token
//             await loadCart(); // Re-fetch data
//             window.dispatchEvent(new Event("cartUpdated"));
//         } catch (err) {
//             console.error("Error updating quantity:", err);
//             alert("Failed to update item quantity.");
//         }
//     };

//     // Error UI Guard
//     if (error) {
//         return <div className="text-red-600 p-4 text-center">{error}</div>;
//     }

//     // Loading UI Guard
//     if (!cart) {
//         return <div className="p-4 text-center">Loading...</div>;
//     }

//     const total = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);



//     return (
//         <div className="max-w-4xl mx-auto p-6">
//             <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

//             {
//                 cart.items.length === 0 ? (<div>Your cart is empty. </div>)
//                     :
//                     (<div className="space-y-4">
//                         {cart.items.map((item) => (<div key={item._id || item.productId._id} className=" flex items-center justify-between p-4 border rounded-2xl">
//                             <div className=" flex items-center gap-4"> <img src={item.productId.image} alt={item.productId.title} className="w-16 h-16 object-cover rounded-2xl"></img>
//                                 <div>
//                                     <h2 className="text-lg font-semibold">{item.productId.title}</h2>
//                                     <p className="text-gray-600">${item.productId.price.toFixed(2)}</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <button onClick={() => updateQty(item.productId._id, item.quantity - 1)} className="px-3 py-1 bg-gray-200 rounded-2xl hover:bg-gray-300" > - </button>
//                                 <span className="font-medium w-4 text-center">{item.quantity}</span>
//                                 <button onClick={() => updateQty(item.productId._id, item.quantity + 1)} className="px-3 py-1 bg-gray-200 rounded-2xl hover:bg-gray-300" >+</button>
//                             </div>
//                             <div> <p>${(item.productId.price * item.quantity).toFixed(2)}</p> </div>
//                             <button onClick={() => removeItem(item.productId._id)} className="text-red-500 hover:text-red-700 font-medium">Remove</button>

                          
//                         </div>))}

//                           {/* Insert this right below your item mapping list */}
//                             <div className="mt-2 flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
//                                 <span className="text-xl font-bold">Total:</span>
//                                 <span className="text-xl font-bold text-black">${total.toFixed(2)}</span>
//                             </div>

//                     </div>)
//             }

//         </div>
//     )
// }

// export default Cart



import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios";

const Cart = () => {
    const navigate = useNavigate();
    // FIX: Sanitize userId state so literal "undefined" or "null" strings don't leak into requests
    const [userId, setUserId] = useState(() => {
        const id = localStorage.getItem("userId");
        return id && id !== "undefined" && id !== "null" ? id : null;
    });
    const [cart, setcart] = useState(null);
    const [error, setError] = useState(null); 

    const loadCart = async () => {
        if (!userId) {
            return;
        }
        try {
            setError(null);
            const res = await api.get(`/cart/${userId}`);
            setcart(res.data);
        } catch (err) {
            console.error("Error loading cart:", err);
            setError("Failed to load your cart. Please try again later.");
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    // 2. Remove item safely
    const removeItem = async (productId) => {
        try {
            await api.post(`/cart/remove`, { userId, productId }); 
            await loadCart(); 
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (err) {
            console.error("Error removing item:", err);
            alert("Could not remove item. Please check your connection.");
        }
    };

    // 3. Update quantity safely
    const updateQty = async (productId, quantity) => {
        if (quantity === 0) {
            await removeItem(productId);
            return;
        }
        
        // FIX: Find the item context to extract the active price per unit
        const currentItem = cart.items.find((item) => item.productId._id === productId);
        const pricePerUnit = currentItem ? currentItem.productId.price : 0;

        try {
            // pricePerUnit is now defined and successfully passed to satisfy the schema constraints
            await api.post(`/cart/update`, { userId, productId, quantity, pricePerUnit }); 
            await loadCart(); 
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (err) {
            console.error("Error updating quantity:", err);
            alert("Failed to update item quantity.");
        }
    };

    // Error UI Guard
    if (error) {
        return <div className="text-red-600 p-4 text-center">{error}</div>;
    }

    // Loading UI Guard
    if (!cart) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    const total = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

            {
                cart.items.length === 0 ? (<div>Your cart is empty. </div>)
                    :
                    (<div className="space-y-4">
                        {cart.items.map((item) => (
                            /* FIX: Use item.productId._id because sub-documents have _id: false */
                            <div key={item.productId._id} className="flex items-center justify-between p-4 border rounded-2xl">
                                <div className="flex items-center gap-4"> 
                                    <img src={item.productId.image} alt={item.productId.title} className="w-16 h-16 object-cover rounded-2xl" />
                                    <div>
                                        <h2 className="text-lg font-semibold">{item.productId.title}</h2>
                                        <p className="text-gray-600">₹{item.productId.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateQty(item.productId._id, item.quantity - 1)} className="px-3 py-1 bg-gray-200 rounded-2xl hover:bg-gray-300"> - </button>
                                    <span className="font-medium w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQty(item.productId._id, item.quantity + 1)} className="px-3 py-1 bg-gray-200 rounded-2xl hover:bg-gray-300">+</button>
                                </div>
                                <div> <p>₹{(item.productId.price * item.quantity).toFixed(2)}</p> </div>
                                <button onClick={() => removeItem(item.productId._id)} className="text-red-500 hover:text-red-700 font-medium">Remove</button>
                            </div>
                        ))}

                        {/* Placed safely below list items */}
                        <div className="mt-2 flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                            <span className="text-xl font-bold">Total:</span>
                            <span className="text-xl font-bold text-black">₹{total.toFixed(2)}</span>
                        </div>

                        {/* Proceed to Checkout */}
                        <button
                            onClick={() => navigate("/checkout")}
                            className="mt-4 w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition duration-200"
                        >
                            Proceed to Checkout
                        </button>

                    </div>)
            }
        </div>
    );
};

export default Cart;
