import { useEffect, useState } from "react"
import api from "../api/axios"
import { useParams } from "react-router"


const ProductDetails = () => {
 const {id} = useParams();
 const [product, setProduct] = useState(null);
 const [error, setError] = useState(false);

// const loadProduct = async () => {
//   const res = await api.get(`/products/`);
//   const p = res.data.find((find)=> item._id === id)
//   setProduct (p);
// };

const loadProduct = async () => {
    try {
      // Best Practice: Fetch only the specific product using its ID
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.warn("Could not fetch single product by ID route, falling back to array filtering:", err);
      
      // Fallback: If your API requires fetching the whole list, access the nested .products array safely
      try {
        const res = await api.get(`/products`);
        const productsArray = res.data.products || res.data || [];
        
        // Fixed loop variable reference mismatch (item vs find)
        const foundProduct = productsArray.find((item) => item._id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError(true);
        }
      } catch (fallbackErr) {
        console.error("All product fetch attempts failed:", fallbackErr);
        setError(true);
      }
    }
  };


useEffect (()=>{
  loadProduct();
},[id]);

const addToCart = async () => {
  const userId = localStorage.getItem("userId");
  
  if (!userId || userId === "undefined" || userId === "null") {
    alert("Please log in to add items to your cart.");
    return;
  }
  
  try {
    await api.post(`/cart/add`, { userId, productId: id ,   quantity: 1  }); // Don't send userId - it comes from token
    alert("Item added to cart!");
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert(error.response?.data?.message || "Failed to add item to cart");
  }
};

if(!product){
  return<div>Loading...</div>
}
     

  return (
    <div className="p-6 max-w-3xl mx-auto">
       <img src={product.image} alt={product.title} className="w-auto h-auto object-center bg-white rounded"></img>
       <h1 className="text-2xl font-bold mt-4">{product.title}</h1>
       <p className="text-gray-700 mt-2">{product.description}</p>
       <p className="text-xl font-semibold mt-4">${product.price}</p>

       <button onClick={addToCart} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ">Add to Cart</button>
    </div>
  )
}

export default ProductDetails
