import { useEffect, useState } from "react"
import api from "../api/axios"
import { Link } from "react-router"


const Home = () => {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");


  const loadProducts = async () => {
    try {
      const res = await api.get(`/products?search=${search}&category=${category}`);
      // Optional chaining ensures it won't crash if res or res.data is null/undefined
      setProducts(res?.data?.products || []);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]); // Fallback to an empty array so the UI doesn't break
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");

    // Strict block for missing, uninitialized, or broken userId strings
    if (!userId || userId === "undefined" || userId === "null") {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const res = await api.post(`/cart/add`, { productId }); // Don't send userId - it comes from the token
      const total = res.data.cart.items.reduce(
        (sum, item) => sum + item.quantity, 0
      );
      localStorage.setItem("cartCount", total);
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "Failed to add item to cart");
    }
  }



  return (
    <div className="p-6">
      {/* // Search */}

      <div className="mb-4 flex gap-3">
        <input
          placeholder="Search Products.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-1/2"
        />

        {/* category filter */}
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border px-3 py-2 rounded ">
          <option value="" >All Categories</option>
          <option value="photos">painting</option>
          <option value="iphone">Iphone</option>
          <option value="apple">MacBook</option>
          <option value="ipad">ipad</option>




        </select>
      </div>

      {/* products grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 ">
        {products.map((product) => (
          <div key={product._id} className="border p-3 rounded-2xl shadow">
            <Link key={product._id} to={`/product/${product._id}`} >
              <img src={product.image} alt={product.title} className="w-full h-40 object-contain bg-white rounded" />
              <h2 className="mt-2 font-semibold text-lg">{product.title}</h2>
              <p className="text-gray-600">${product.price}</p>
            </Link>

            <button onClick={() => addToCart(product._id)} className="mt-2 w-full bg-blue-500 text-white px-3 py-2 rounded-2xl ">Add to Cart</button>

          </div>


        ))}


      </div>


    </div>
  )
}



export default Home
