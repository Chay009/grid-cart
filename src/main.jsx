import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { NowPlayingContextProvider } from 'react-nowplaying';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster />
    <NowPlayingContextProvider>
        
            <App />
      </NowPlayingContextProvider>
       
  </React.StrictMode>,
);
