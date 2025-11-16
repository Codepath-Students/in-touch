import React, { useState, useEffect } from "react";
import { Chrome, Mail, Lock, User } from "lucide-react";

const AuthModal = ({ open, mode, onClose, onSwitchMode }) => {
  const [tab, setTab] = useState(mode === "signup" ? "google" : "credentials");

  useEffect(() => {
    if (mode === "signup") setTab("google");
  }, [mode]);

  if (!open) return null;

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className="modal-overlay"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div className="auth-modal" onClick={stop}>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p className="subtitle">
          {mode === "login"
            ? "Log in to stay in touch with your people."
            : "Sign up with Google to start nurturing connections."}
        </p>

        {/* Only show tab buttons in login mode */}
        {mode === "login" && (
          <div className="tab-row">
            <button
              className={`btn-switch ${tab === "google" ? "active" : ""}`}
              onClick={() => setTab("google")}
              type="button"
            >
              <Chrome className="h-5 w-5" /> Google
            </button>
            <button
              className={`btn-switch ${tab === "credentials" ? "active" : ""}`}
              onClick={() => setTab("credentials")}
              type="button"
            >
              <Mail className="h-5 w-5" />{" "}
              {mode === "login" ? "Email Login" : "Email Signup"}
            </button>
          </div>
        )}

        {/* Google auth card (used for both login and signup) */}
        {(tab === "google" || mode === "signup") && (
          <div className="card p-5 flex flex-col gap-4 mt-4">
            <p className="text-base text-[var(--color-muted)]">
              Placeholder for Google OAuth. This button doesn’t do anything yet.
            </p>
            <button className="btn-primary w-full">
              <Chrome className="h-5 w-5 mr-2" />
              {mode === "login"
                ? "Continue with Google"
                : "Sign up with Google"}
            </button>
          </div>
        )}

        {/* Email credentials only available in login mode */}
        {mode === "login" && tab === "credentials" && (
          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="email">Email</label>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[var(--color-muted)]" />
                <input id="email" placeholder="you@example.com" type="email" />
              </div>
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-[var(--color-muted)]" />
                <input id="password" placeholder="••••••••" type="password" />
              </div>
            </div>

            <div className="helper-text">
              Use any placeholder credentials for now.
            </div>

            <button className="btn-primary w-full mt-1" type="button">
              Log In
            </button>
          </form>
        )}

        {/* Switch between login/signup */}
        <div className="switch-auth mt-3">
          {mode === "login" ? (
            <>
              New here?{" "}
              <button type="button" onClick={() => onSwitchMode("signup")}>
                Create account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => onSwitchMode("login")}>
                Log in
              </button>
            </>
          )}
        </div>

        <div className="divider" />
        <p className="text-[12px] text-center text-[var(--color-muted)] px-2">
          By continuing you agree to our Terms & Privacy (placeholder).
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
