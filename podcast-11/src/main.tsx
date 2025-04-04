import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { FavouritesProvider } from "./context/FavouritesContext";
import { AudioPlayerProvider } from "./context/AudioPlayerContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    
    <AudioPlayerProvider>
    <FavouritesProvider>
    <BrowserRouter>
          <App /> 
    </BrowserRouter>
    </FavouritesProvider>
    </AudioPlayerProvider>

  </StrictMode>
);
