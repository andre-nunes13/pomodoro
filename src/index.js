import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProvider } from "./context/AppContext";
import App from "./App";
import customTheme from "./chakra.config";
import "./index.css";

document.body.style.cursor = "url('/xp-pointer.cur'), pointer";

document.querySelectorAll("button").forEach((btn) => {
  btn.style.cursor = "url('/xp-grab.cur'), grab";
});


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ChakraProvider theme={customTheme}>
      <AppProvider>
        <App />
      </AppProvider>
    </ChakraProvider>
  </React.StrictMode>
);