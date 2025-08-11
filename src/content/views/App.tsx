import Logo from "@/assets/crx.svg";
import { useState } from "react";
import "./App.css";
import { Dashboard } from "@/components/Dashboard";
import { Theme } from "@radix-ui/themes";

function App() {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);

  return (
    <div className="popup-container">
      {show && (
        <div className={`popup-content ${show ? "opacity-100" : "opacity-0"}`}>
          <Theme>
            <Dashboard />
          </Theme>
        </div>
      )}
      <button className="toggle-button" onClick={toggle}>
        <img src={Logo} alt="CRXJS logo" className="button-icon" />
      </button>
    </div>
  );
}

export default App;
