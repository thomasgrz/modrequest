import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("eh")
const node = document.getElementById("root");
if(node instanceof HTMLElement) {
    createRoot(node).render(
        <StrictMode>
            <App />
        </StrictMode>,
    );
} 