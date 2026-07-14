import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import api from "../api/axios"


export default function Signup(){
  const [form,setForm]= useState({
    name:"",
    email:"",
    password:""
  })

  const [msg, setMsg]= useState("");
  const navigate = useNavigate();
   
  const handleChange=(e) =>{
       setForm({
        ...form,
         [e.target.name]: e.target.value
       });
}

const handleSubmit = async(e)=>{
  e.preventDefault();

  try {
    // const response = await api.p);
      const response = await api.post("/auth/signup", form);
    setMsg(response.data.message );
    
    // Save Token and userId to localstorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userId", response.data.user.id);
    window.dispatchEvent(new Event("authChanged")); // Notify Navbar to update
    
    //redirect to home page 
    setTimeout(()=>{
      navigate("/");
    }, 1000);setMsg(response.data.message );
    
    
  } catch (error) {
     setMsg(error.response?.data?.message || "An error occurred during signup")
  }
}

 return (
    <div className='flex item-center justify-center min-h-screen bg-gray-100 px-4'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-sm'>
        <h2 className='text-2xl font-bold mb-6 text-center   '>Create Account</h2>

        {msg && (
          <div className='mb-4 text-center text-sm text-blue-600 font-medium  b '> {msg} </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input 
          name='name'
          placeholder='Enter Name'
          value={form.name}
          onChange={handleChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus-outline-none focus:ring-blue-500'
            required
          />
          <input name='email' type='email' placeholder='Enter Email'
          value={form.email}
          onChange={handleChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus-outline-none focus:ring-blue-500'
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
          Sign Up
         </button>

        </form>

      </div>
      
    </div>
  )


}







