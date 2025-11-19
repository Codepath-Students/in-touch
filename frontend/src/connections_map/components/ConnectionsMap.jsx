// src/components/connections/ConnectionsMap.jsx
import React, { useMemo } from "react";
import "./ConnectionsMap.css";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const computeDaysSinceLastContact = (c) => {
  const lastContactedRaw =
    c.last_contacted_at ??
    c.lastContactedAt ??
    c.created_at ??
    c.createdAt;

  if (!lastContactedRaw) return null;

  const lastDate = new Date(lastContactedRaw);
  if (Number.isNaN(lastDate.getTime())) return null;

  const today = new Date();
  lastDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffMs = today - lastDate;
  return Math.floor(diffMs / MS_PER_DAY);
};

/**
 * Compute ring bucket from daysSinceLastContact:
 * - ring 0 (inner): recently contacted
 * - ring 1 (middle): okay / neutral
 * - ring 2 (outer): stale / red
 */
const getRingIndex = (connection, recentDays, staleDays) => {
  const days = computeDaysSinceLastContact(connection);

  if (days == null) {
    // If unknown, treat as middle.
    return 1;
  }

  if (days <= recentDays) return 0;
  if (days >= staleDays) return 2;
  return 1;
};

const getDisplayName = (c) =>
  c.connection_name ?? c.name ?? "Connection";

const ConnectionsMap = ({
  connections,
  loading,
  recentDays,
  staleDays,
  onNodeClick,
}) => {
  const rings = useMemo(() => {
    const groups = { 0: [], 1: [], 2: [] };

    connections.forEach((c) => {
      const ringIndex = getRingIndex(c, recentDays, staleDays);
      groups[ringIndex].push(c);
    });

    return groups;
  }, [connections, recentDays, staleDays]);

  const hasConnections = connections && connections.length > 0;

  return (
    <section className="connections-map-section">
      <div className="connections-map card">
        <div className="connections-map-orbit">
          {/* Orbit rings as background */}
          <div className="orbit-ring orbit-ring-1" />
          <div className="orbit-ring orbit-ring-2" />
          <div className="orbit-ring orbit-ring-3" />

          {/* Center "You" node */}
          <div className="orbit-center-node">
            <div className="orbit-center-avatar">You</div>
            <div className="orbit-center-label">Your network</div>
          </div>

          {/* Connection nodes */}
          {[0, 1, 2].map((ringIndex) => {
            const bucket = rings[ringIndex];
            if (!bucket || bucket.length === 0) return null;

            const count = bucket.length;
            const radiusFactor = [0.32, 0.48, 0.64][ringIndex]; // relative radius

            return bucket.map((connection, idx) => {
              const angle = (idx / count) * Math.PI * 2;
              const x = 50 + Math.cos(angle) * radiusFactor * 100;
              const y = 50 + Math.sin(angle) * radiusFactor * 100;

              const days = computeDaysSinceLastContact(connection);
              const isRecent =
                days != null && days <= recentDays;
              const isStale =
                days != null && days >= staleDays;

              const classNames = [
                "orbit-node",
                `orbit-node-ring-${ringIndex}`,
                isRecent ? "orbit-node-recent" : "",
                isStale ? "orbit-node-stale" : "",
              ]
                .filter(Boolean)
                .join(" ");

              const handleClick = () => {
                if (onNodeClick) onNodeClick(connection);
              };

              const label = getDisplayName(connection);
              const initial =
                (connection.connection_name ??
                  connection.name ??
                  "?")[0]?.toUpperCase() || "?";

              return (
                <button
                  key={connection.id ?? connection.connectionId}
                  type="button"
                  className={classNames}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onClick={handleClick}
                  aria-label={`Connection: ${label}. ${
                    days != null
                      ? `Last contacted ${days} days ago.`
                      : "Last contacted date unknown."
                  }`}
                >
                  <div className="orbit-node-inner">
                    <div className="orbit-node-avatar">
                      {initial}
                    </div>
                  </div>
                  <span className="orbit-node-name" aria-hidden="true">
                    {label}
                  </span>
                </button>
              );
            });
          })}

          {loading && (
            <div className="connections-map-loading">
              Mapping your network...
            </div>
          )}

          {!loading && !hasConnections && (
            <div className="connections-map-empty">
              <h3>No connections to map yet</h3>
              <p>Add a few connections first, then come back to see your orbit.</p>
            </div>
          )}
        </div>
      </div>

      <p className="connections-map-legend">
        <span className="legend-dot legend-dot-green" /> Close (recently
        contacted) &nbsp;·&nbsp;
        <span className="legend-dot legend-dot-red" /> Far (haven’t reached out
        in a while)
      </p>
    </section>
  );
};

export default ConnectionsMap;
