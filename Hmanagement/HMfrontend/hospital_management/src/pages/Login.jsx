import React , { useContext , useState } from 'react';
import { Context } from '../main';
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Use Vite environment variable for backend URL (fallback to relative API path for dev proxy)
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

   const navigateTo = useNavigate();
  
   const handleLogin = async (e) => { 
    e.preventDefault();

    // Always use relative path to go through Vite proxy
    const url = "/api/v1/user/login";

    try {
      const response = await axios.post(
        url,
        { email, password, role: "Patient" },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      toast.success(response.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
   };
    if (isAuthenticated) {
      return <Navigate to="/" />;
    }

  return (
    <div className='container form-component login-form'>
      <h2>sign In</h2>
      <p>please login to continue</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos quisquam dicta sint nemo voluptatibus asperiores minus adipisci doloribus odit provident. Possimus animi veritatis quos nobis vero porro pariatur, quisquam eaque!</p>
      <form onSubmit={handleLogin}>
        <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='email'></input>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password'></input>
        <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder='Confirm Password'></input>
        <div style={{gap:"10px", justifyContent:"flex-end", flexDirection:"row," }} >
          <p style={{marginBottom: 0}}>Not Registered?</p>
          <Link to="/register">Register Now</Link>
        </div>
        <div style={{justifyContent:"center", alignItems:"center"}}>
          <button type='submit'>Login</button>

        </div>
      </form>
    </div>
  )
}

export default Login
