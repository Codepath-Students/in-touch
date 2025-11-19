// src/pages/Connects.jsx
import React, { useState } from "react";
import { addConnection } from "./services/ConnectionBackendService";
import "./ConnectionPage.css"; // reuse styles if you want

// A bunch of demo connections to seed
const DEMO_CONNECTIONS = [
  {
    connection_name: "Alice Johnson",
    connection_type: "friend",
    reminder_frequency_days: 30,
    notes: "Met at college. Works in product at a startup.",
    know_from: "College roommate",
    reach_out_priority: 7,
  },
  {
    connection_name: "Ravi Patel",
    connection_type: "close_friend",
    reminder_frequency_days: 14,
    notes: "Lives in NYC, into ML and robotics.",
    know_from: "Hackathon teammate",
    reach_out_priority: 9,
  },
  {
    connection_name: "Maria Gomez",
    connection_type: "acquaintance",
    reminder_frequency_days: 60,
    notes: "Met at a conference. Interested in climate tech.",
    know_from: "Conference panel",
    reach_out_priority: 5,
  },
  {
    connection_name: "James Lee",
    connection_type: "friend",
    reminder_frequency_days: 45,
    notes: "Old coworker from internship.",
    know_from: "Previous internship",
    reach_out_priority: 6,
  },
  {
    connection_name: "Priya Singh",
    connection_type: "family_member",
    reminder_frequency_days: 21,
    notes: "Cousin in Canada. Thinking about grad school.",
    know_from: "Family",
    reach_out_priority: 8,
  },
  {
    connection_name: "Tommy Nguyen",
    connection_type: "acquaintance",
    reminder_frequency_days: 90,
    notes: "Met at AI meetup.",
    know_from: "Local meetup",
    reach_out_priority: 4,
  },
  {
    connection_name: "Sara Ahmed",
    connection_type: "friend",
    reminder_frequency_days: 30,
    notes: "Designer you might want to collaborate with.",
    know_from: "Side project",
    reach_out_priority: 7,
  },
  {
    connection_name: "Ben Rosen",
    connection_type: "friend",
    reminder_frequency_days: 30,
    notes: "Funny as hell, also in tech.",
    know_from: "Comedy scene",
    reach_out_priority: 6,
  },
  {
    connection_name: "Linh Tran",
    connection_type: "acquaintance",
    reminder_frequency_days: 75,
    notes: "Works in impact investing.",
    know_from: "LinkedIn intro",
    reach_out_priority: 5,
  },
  {
    connection_name: "Dr. Hannah Christensen",
    connection_type: "acquaintance",
    reminder_frequency_days: 120,
    notes: "Potential research collaborator in climate.",
    know_from: "Academic outreach",
    reach_out_priority: 10,
  },
];

const Connects = () => {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [createdCount, setCreatedCount] = useState(0);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedConnections = async () => {
    setIsSeeding(true);
    setStatus("");
    setError("");
    setCreatedCount(0);

    // Fast-fail if not logged in
    try {
      const hasToken = Boolean(window?.localStorage?.getItem("access_token"));
      if (!hasToken) {
        setError("You must be logged in to seed connections.");
        setIsSeeding(false);
        return;
      }
    } catch {
      // ignore
    }

    try {
      let count = 0;

      for (const demo of DEMO_CONNECTIONS) {
        // addConnection already handles CSRF + Authorization via api client
        await addConnection(demo);
        count += 1;
        setCreatedCount(count);
      }

      setStatus(`Successfully created ${count} demo connections for this user.`);
    } catch (err) {
      console.error("Error seeding connections:", err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create demo connections."
      );
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="connections-page">
      <div className="connections-page-inner">
        <header className="connections-page-header">
          <h1 className="connections-page-title">Seed Connections</h1>
          <p className="connections-page-subtitle">
            Create a bunch of demo connections for the currently logged-in user.
          </p>
        </header>

        {error && (
          <div className="connections-error card">
            <div className="connections-error-header">Something went wrong</div>
            <div className="connections-error-body">{error}</div>
          </div>
        )}

        {status && !error && (
          <div className="connections-status card">
            <div className="connections-status-body">{status}</div>
          </div>
        )}

        <div className="seed-actions card">
          <p>
            This will create <strong>{DEMO_CONNECTIONS.length}</strong> demo
            connections in the database for <strong>your account</strong> (the
            user associated with the current access token).
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSeedConnections}
            disabled={isSeeding}
          >
            {isSeeding
              ? `Creating... (${createdCount}/${DEMO_CONNECTIONS.length})`
              : "Seed demo connections"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Connects;
