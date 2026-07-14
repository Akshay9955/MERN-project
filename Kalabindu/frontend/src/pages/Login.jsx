import { useState } from "react";
import {useNavigate} from "react-router";
import api from "../api/axios"

export default function Login(){
  const [form,setForm]=useState({
    email:"",
    password:""
  })
  const [msg,setMsg]=useState("");
  const navigate = useNavigate();

  const handleChange =(e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    });
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
     try {
    const response = await api.post("/auth/login", form);
    console.log(response, "data");
    
    // Save Token to localstorage
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("userId", response.data.user.id);
  window.dispatchEvent(new Event("authChanged")); // Notify Navbar to update
    
  setMsg('Login Successfully');

  //redirect to home page 
  setTimeout(()=>{
    navigate("/");
  }, 1000);
    
  } catch (error) {
     setMsg(error.response?.data?.message || "An error occurred during signup")
  }
  }


return(
  <div className="flex items-center justify-center min-h-screen bg-gray-300 px-4">
   <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
    <h2 className="text-2xl font-bold mb-6 text-center">Login to your account </h2>
    {msg && (
      <div className="mb-4 text-center text-sm text-red-600 font-medium"> {msg} </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
      name="email"
      type="email"
      placeholder="Enter Email"
      value= {form.email}
      onChange={handleChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus-outline-none focus:ring-blue-500"
      required
      />

        <input
             name='password'
             type='password'
             placeholder='Enter Password'
             value={form.password}
             onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus-outline-none focus:ring-blue-500'
             required
          />


         <button type='submit'
         className='w-full px-3 py-2 border border-gray-300 bg-blue-500 rounded-md focus-outline-none focus:ring-blue-500'
         >
          Login 
         </button>

    </form>

   </div>
  </div>
)

}
