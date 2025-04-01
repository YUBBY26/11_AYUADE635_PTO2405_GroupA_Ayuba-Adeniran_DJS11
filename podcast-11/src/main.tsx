import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import { FavouritesProvider } from "./context/FavouritesContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <FavouritesProvider>
      <App />
    </FavouritesProvider>
    </BrowserRouter>
  </StrictMode>,
)
