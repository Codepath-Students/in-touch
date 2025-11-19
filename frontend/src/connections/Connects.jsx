// src/dev/Connects.jsx
import React, { useState } from "react";
import { addConnection } from "../connections/services/ConnectionBackendService"; // 🔁 adjust path if needed
import "../connections/ConnectionPage.css"; // reuse existing styles

// Helper: get an ISO string for N days ago
const isoDaysAgo = (daysAgo) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

// A bunch of demo connections to seed
// daysAgoLastContact is just for seeding; not sent to backend directly.
const DEMO_CONNECTIONS = [
  {
    connection_name: "Alice Johnson",
    connection_type: "friend",
    reminder_frequency_days: 14,
    notes: "Met at college. Works in product at a startup.",
    know_from: "College roommate",
    reach_out_priority: 7,
    daysAgoLastContact: 0, // today → super close
  },
  {
    connection_name: "Ravi Patel",
    connection_type: "close_friend",
    reminder_frequency_days: 7,
    notes: "Lives in NYC, into ML and robotics.",
    know_from: "Hackathon teammate",
    reach_out_priority: 9,
    daysAgoLastContact: 3,
  },
  {
    connection_name: "Maria Gomez",
    connection_type: "acquaintance",
    reminder_frequency_days: 30,
    notes: "Met at a conference. Interested in climate tech.",
    know_from: "Conference panel",
    reach_out_priority: 5,
    daysAgoLastContact: 10,
  },
  {
    connection_name: "James Lee",
    connection_type: "friend",
    reminder_frequency_days: 30,
    notes: "Old coworker from internship.",
    know_from: "Previous internship",
    reach_out_priority: 6,
    daysAgoLastContact: 20, // mid ring
  },
  {
    connection_name: "Priya Singh",
    connection_type: "family_member",
    reminder_frequency_days: 21,
    notes: "Cousin in Canada. Thinking about grad school.",
    know_from: "Family",
    reach_out_priority: 8,
    daysAgoLastContact: 45, // around stale threshold
  },
  {
    connection_name: "Tommy Nguyen",
    connection_type: "acquaintance",
    reminder_frequency_days: 60,
    notes: "Met at AI meetup.",
    know_from: "Local meetup",
    reach_out_priority: 4,
    daysAgoLastContact: 60, // stale-ish
  },
  {
    connection_name: "Sara Ahmed",
    connection_type: "friend",
    reminder_frequency_days: 30,
    notes: "Designer you might want to collaborate with.",
    know_from: "Side project",
    reach_out_priority: 7,
    daysAgoLastContact: 75,
  },
  {
    connection_name: "Ben Rosen",
    connection_type: "friend",
    reminder_frequency_days: 30,
    notes: "Funny as hell, also in tech.",
    know_from: "Comedy scene",
    reach_out_priority: 6,
    daysAgoLastContact: 90, // near max distance
  },
  {
    connection_name: "Linh Tran",
    connection_type: "acquaintance",
    reminder_frequency_days: 45,
    notes: "Works in impact investing.",
    know_from: "LinkedIn intro",
    reach_out_priority: 5,
    daysAgoLastContact: 25,
  },
  {
    connection_name: "Dr. Hannah Christensen",
    connection_type: "acquaintance",
    reminder_frequency_days: 120,
    notes: "Potential research collaborator in climate.",
    know_from: "Academic outreach",
    reach_out_priority: 10,
    daysAgoLastContact: 120, // will clamp at MAX_DAYS on map
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
        const payload = {
          connection_name: demo.connection_name,
          connection_type: demo.connection_type,
          reminder_frequency_days: demo.reminder_frequency_days,
          notes: demo.notes,
          know_from: demo.know_from,
          reach_out_priority: demo.reach_out_priority,
          // 🔥 NEW: backward date so map shows different radii / colors
          last_contacted_at: isoDaysAgo(demo.daysAgoLastContact),
        };

        await addConnection(payload);
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
            Create a bunch of demo connections (with different last-contact
            dates) for the currently logged-in user.
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
            user associated with the current access token). Their last-contact
            dates are spread out so you can see different distances and colors
            on the map, and verify that{" "}
            <code>Reached Out</code> updates their position.
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
