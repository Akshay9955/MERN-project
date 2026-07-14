import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import UserContext from './context/UserContext.jsx';
import CaptainContext from './context/CaptainContext.jsx';
import SocketContextProvider from './context/SocketContext.jsx';
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketContextProvider>
      <CaptainContext>
        <UserContext>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserContext>
      </CaptainContext>
    </SocketContextProvider>
  </StrictMode>,
)
