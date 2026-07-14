
import { Link, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import api from "../api/axios";


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const [cartCount, setCartCount] = useState(0);

  // Read userId from localStorage and sanitize it
  const getStoredUserId = () => {
    const id = localStorage.getItem("userId");
    return id && id !== "undefined" && id !== "null" ? id : null;
  };

  const [userId, setUserId] = useState(getStoredUserId);

  // Sync userId when localStorage changes (e.g. after login in another tab or after navigate)
  useEffect(() => {
    const syncAuth = () => {
      setUserId(getStoredUserId());
    };

    // Listen to storage changes (fires when localStorage changes)
    window.addEventListener("storage", syncAuth);
    // Also listen to a custom "authChanged" event we'll fire on login/logout
    window.addEventListener("authChanged", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authChanged", syncAuth);
    };
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      if (!userId) {
        setCartCount(0);
        return;
      }
      try {
        const res = await api.get(`/cart/${userId}`);
        const total = res.data.items.reduce(
          (sum, item) => sum + item.quantity, 0
        );
        setCartCount(total);
      } catch (err) {
        console.error("Failed to load cart data:", err);
        setCartCount(0);
      }
    };

    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, [userId]);

  const logout = () => {
    localStorage.clear();
    setUserId(null);
    setCartCount(0);
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  return (
    <nav className="flex justify-between p-4 shadow">
      <Link to="/" className="font-bold text-xl">Kalabindu</Link>

      <div className="flex gap-4 items-center">
        {isAuthPage ? (

          <>
            <Link to="/login" className="text-xl">Login</Link>
            <Link to="/signup" className="text-xl">Signup</Link>
          </>
        ) : userId ? (
          <>
            {/* <Link to="/cart" className="relative text-xl">
              🛒
              {cartCount > 0 && (
                <span className="absolute  -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link> */}
            <Link to="/cart" className="relative text-xl">
              🛒
              <span
                className={`absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full
      transition-all duration-300 ease-out
      ${cartCount > 0
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-0 pointer-events-none'
                  }`}
              >
                {cartCount}
              </span>
            </Link>
            <button onClick={logout} className="text-lg">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-xl">Login</Link>
            <Link to="/signup" className="text-xl">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar















