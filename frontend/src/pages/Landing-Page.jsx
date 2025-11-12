import React from "react";
import { Heart, Calendar, MessageCircle, Users, Sparkles, Map, Clock } from "lucide-react";

const LandingPage = ({ onAuth }) => {

const Feature = ({ icon: Icon, title, children }) => {
  return (
    <div className="text-center flex flex-col items-center gap-2">
      <div className="icon-circle mb-2">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 text-xs text-[var(--color-muted)] max-w-[220px]">{children}</p>
    </div>
  );
};
  return (
    <div className="app-shell">
      <div className="mx-auto w-full rounded-md max-w-7xl px-5 py-8 flex flex-col gap-10">
        {/* Framed surface */}
        <div className="surface-framed px-6 pt-6 pb-12 flex flex-col gap-12">
          {/* Header */}
          <header className="flex items-center justify-around">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-primary-600)] text-white shadow">
                <Heart className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold tracking-tight">
                In Touch
              </span>
            </div>
            <div className="flex items-center gap-2">t
              <button
                className="btn-ghost"
                onClick={() => onAuth('login')}
              >
                Log In
              </button>
              <button
                className="btn-primary"
                onClick={() => onAuth('signup')}
              >
                Sign Up
              </button>
            </div>
          </header>

          {/* Hero */}
            <section className="mx-auto max-w-3xl text-center flex flex-col gap-6">
              <h1 className="text-4xl font-semibold sm:text-5xl leading-tight">
                Stay Connected with the People Who Matter Most
              </h1>
              <p className="mx-auto max-w-2xl text-base text-[var(--color-muted)]">
                Life gets busy. Relationships shouldn't fade. In Touch brings structure,
                warmth, and gentle reminders to help you nurture meaningful connections.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  className="btn-primary"
                  onClick={() => onAuth('signup')}
                >
                  Get Started
                </button>
                <button className="btn-ghost">
                  Learn More
                </button>
              </div>
            </section>

          {/* Features */}
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            <Feature icon={Heart} title="Never Forget">
              Capture important moments & reflections with close friends.
            </Feature>
            <Feature icon={Calendar} title="Smart Reminders">
              Gentle nudges to reach out at the right cadence.
            </Feature>
            <Feature icon={MessageCircle} title="Context Rich">
              Pick up conversations without losing thread continuity.
            </Feature>
            <Feature icon={Users} title="Grow Together">
              Track how connections evolve over time.
            </Feature>
            <Feature icon={Map} title="Visual Network">
              See your social circle represented spatially (future).
            </Feature>
            <Feature icon={Clock} title="History">
              Recall when you last engaged & what was shared.
            </Feature>
          </section>

          {/* How It Works */}
          <section className="section pt-0">
            <div className="mx-auto max-w-5xl grid gap-10 md:grid-cols-3">
              <div className="card p-6 flex flex-col gap-3">
                <Sparkles className="h-5 w-5 text-[var(--color-primary-400)]" />
                <h3 className="text-sm font-semibold">Add Connections</h3>
                <p className="text-xs text-[var(--color-muted)]">
                  Start by adding people you care about. Later you&apos;ll see suggested
                  touch points based on interaction patterns.
                </p>
              </div>
              <div className="card p-6 flex flex-col gap-3">
                <Calendar className="h-5 w-5 text-[var(--color-primary-400)]" />
                <h3 className="text-sm font-semibold">Set Cadence</h3>
                <p className="text-xs text-[var(--color-muted)]">
                  Choose how frequently you want to reconnect so nothing meaningful drifts.
                </p>
              </div>
              <div className="card p-6 flex flex-col gap-3">
                <MessageCircle className="h-5 w-5 text-[var(--color-primary-400)]" />
                <h3 className="text-sm font-semibold">Engage Intentionally</h3>
                <p className="text-xs text-[var(--color-muted)]">
                  Jot small notes after each interaction. Track sentiment & watch depth grow.
                </p>
              </div>
            </div>
          </section>

          {/* Callout */}
          <section className="mx-auto max-w-4xl card p-8 text-center flex flex-col gap-5">
            <h2 className="text-lg font-semibold">
              Your friendships deserve attention
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-[var(--color-muted)]">
              Build stronger relationships with a platform designed for steady,
              mindful connection—not noisy feeds. Healthy networks start with intention.
            </p>
            <div>
              <button
                className="btn-primary"
                onClick={() => onAuth('signup')}
              >
                Start Your Journey
              </button>
            </div>
          </section>
        </div>

        {/* Footer (placeholder) */}
        <footer className="text-center text-[10px] text-[var(--color-muted)] pb-6">
          © {new Date().getFullYear()} In Touch. Building meaningful connection.
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
