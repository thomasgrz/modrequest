import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./_app.css";
import { Popup } from "./Popup";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Popup />
  </StrictMode>,
);
