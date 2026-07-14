
import React from 'react'
import { Routes, Route } from "react-router-dom";
import Start from './pages/Start'
import CaptainSignup from './pages/CaptainSignup';
import UserSignup from './pages/UserSignup';

import CaptainLogin from './pages/CaptainLogin'
import './index.css'
import Home from './pages/Home';
import UserProtectWrapper from './pages/UserProtectWrapper';
import UserLogout from './pages/UserLogout';
// import CaptainHome from '../../CaptainHome';
import CaptainHome from './pages/CaptainHome';
import CaptainRiding from './pages/CaptainRiding';
import CaptainProtectWrapper from './pages/captainProtectWrapper'
import UserLogin from './pages/UserLogin'
import Riding from './pages/Riding';
import 'remixicon/fonts/remixicon.css'




const App = () => {


  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path= "/riding" element={<Riding />}/>
        <Route path='/captain-riding' element={<CaptainRiding />}/>
        

        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        
        <Route path='/home' element={
          <UserProtectWrapper>
            <Home />
          </UserProtectWrapper>} />

        <Route path='/user/logout' element={
          <UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
        } />

        {/* <Route path='/captain-home' element={<CaptainProtectWrapper>
          <CaptainHome />
        </CaptainProtectWrapper>} /> */}

       
          <Route path='/captain-home' element={
          <CaptainProtectWrapper>
            <CaptainHome />
            {/* <FCaptainHome /> */}
          </CaptainProtectWrapper>

        } />

      </Routes>

       




    </div>
  )
}

export default App
