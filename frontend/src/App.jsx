import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/Landing-Page.jsx";
import AuthModal from "./components/AuthModal.jsx";
import Connections from "./connections/ConnectionPage.jsx";

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'

  const openAuth = (mode = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage onAuth={openAuth} />} />
        <Route path="/connections" element={<Connections />} />
      </Routes>
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSwitchMode={(m) => setAuthMode(m)}
      />
    </>
  );
}

export default App;
