import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/Landing-Page.jsx";
import AuthModal from "./components/AuthModal.jsx";

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'
  const [authInfo, setAuthInfo] = useState("");

  const openAuth = (mode = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  // After Google callback, token and needsUsername may be in the URL
  const googleParams = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );
  useEffect(() => {
    const token = googleParams.get("token");
    const needsUsername = googleParams.get("needsUsername") === "true";
    if (token) {
      // Store token in memory or app state later. For now, just show success.
      setAuthInfo(
        needsUsername
          ? "Welcome! Please choose a username to complete your profile."
          : "Logged in with Google successfully."
      );
      setAuthMode(needsUsername ? "signup" : "login");
      setAuthOpen(true);
      // Optionally clean URL (no router changes here to keep it simple)
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      url.searchParams.delete("needsUsername");
      window.history.replaceState({}, "", url);
    }
  }, [googleParams]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage onAuth={openAuth} />} />
      </Routes>
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSwitchMode={(m) => setAuthMode(m)}
        initialInfo={authInfo}
      />
    </>
  );
}

export default App;
