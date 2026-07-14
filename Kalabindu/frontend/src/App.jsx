import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router"

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import AddProduct from './admin/AddProduct.jsx'
import EditProduct from './admin/EditProduct.jsx'
import ProductList from './admin/ProductList.jsx'
import Layout from './Layout.jsx'
import Cart from './pages/Cart.jsx'
import CheckoutAddress from './pages/CheckoutAddress.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/product/:id", element: <ProductDetails /> },

      { path: "/admin/products/add", element: <AddProduct /> },
      { path: "/admin/products/update/:id", element: <EditProduct /> },
      { path: "/admin/products", element: <ProductList /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout-address", element: <CheckoutAddress /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/order-success", element: <OrderSuccess /> },
    ]
  }
]);


export default function App() {
  return <RouterProvider router={router} />;
}







