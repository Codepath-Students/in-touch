import React, { useState } from 'react';

const AuthModal = ({ open, mode, onClose, onSwitchMode }) => {
  const [tab, setTab] = useState('credentials'); // 'google' | 'credentials'

  if (!open) return null;

  return (
    <div className="modal-overlay" aria-modal="true" role="dialog">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
        <h2>{mode === 'login' ? 'Welcome Back' : 'Create Your Account'}</h2>
        <div className="tab-row">
          <button
            className={`btn-switch ${tab === 'google' ? 'active' : ''}`}
            onClick={() => setTab('google')}
            type="button"
          >
            Google
          </button>
          <button
            className={`btn-switch ${tab === 'credentials' ? 'active' : ''}`}
            onClick={() => setTab('credentials')}
            type="button"
          >
            {mode === 'login' ? 'Email Login' : 'Email Signup'}
          </button>
        </div>

        {tab === 'google' && (
          <div className="card p-4 flex flex-col gap-3">
            <p className="text-xs text-[var(--color-muted)]">
              For now this is a placeholder. A Google OAuth button would appear here.
            </p>
            <button className="btn-primary w-full justify-center">Continue with Google</button>
          </div>
        )}

        {tab === 'credentials' && (
          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" placeholder="you@example.com" type="email" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input id="password" placeholder="••••••••" type="password" />
            </div>
            <div className="helper-text">
              {mode === 'login'
                ? 'Use any placeholder credentials for now.'
                : 'Choose a strong password. (Demo placeholder)'}
            </div>
            <button className="btn-primary w-full justify-center mt-1" type="button">
              {mode === 'login' ? 'Log In' : 'Sign Up'}
            </button>
            <div className="switch-auth">
              {mode === 'login' ? (
                <>
                  New here?{' '}
                  <button type="button" onClick={() => onSwitchMode('signup')}>
                    Create account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button type="button" onClick={() => onSwitchMode('login')}>
                    Log in
                  </button>
                </>
              )}
            </div>
          </form>
        )}

        <div className="divider" />

        <p className="text-[10px] text-center text-[var(--color-muted)] px-2">
          By continuing you agree (placeholder) to the Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;