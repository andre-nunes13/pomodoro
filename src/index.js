import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProvider } from "./context/AppContext"; // Certifique-se de importar o AppProvider
import App from "./App";
import customTheme from "./chakra.config";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={customTheme}>
      <AppProvider> {/* Envolva o App com o AppProvider */}
        <App />
      </AppProvider>
    </ChakraProvider>
  </React.StrictMode>
);