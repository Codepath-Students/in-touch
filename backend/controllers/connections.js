import pool from "../config/database.js";
import express from "express";

// Class to host all of the relevant connections queries methods
const ConnectionsController = {

    //get connections for a user with pagination
    getConnections: async (req, res) => {
        const userId = req.userId;
        const page = parseInt(req.params.page, 10) || 1;
        const limit = 51; // Fetch one extra to check if there's a next page
        const offset = (page - 1) * limit;

        try {
            const query = `
                SELECT id, connection_name, reach_out_priority, reminder_frequency_days, created_at, last_contacted_at
                FROM connections
                WHERE user_id = $1
                ORDER BY 
                (reach_out_priority * 0.5) + (0.5 * (EXTRACT(EPOCH FROM (NOW() - last_contacted_at))/86400 - reminder_frequency_days)) DESC,
                connection_name ASC
                LIMIT $2 OFFSET $3
            `;
            const { rows } = await pool.query(query, [userId, limit, offset]);
            return res.status(200).json({ connections: rows });
        } catch (err) {
            console.error("Error fetching connections:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    //create a new connection for the authenticated user
    createConnection: async (req, res) => {
        const userId = req.userId;
        const { connection_name, reachout_priority, reminder_frequency, notes, connection_type, know_from, reach_out_priority } = req.body;

        try {
            const query = `
                INSERT INTO connections (user_id, connection_name, reminder_frequency_days, notes, connection_type, know_from, reach_out_priority)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, connection_name, reach_out_priority, reminder_frequency_days, created_at, last_contacted_at
            `;
            const { rows } = await pool.query(query, [userId, connection_name, reminder_frequency, notes, connection_type, know_from, reach_out_priority]);
            return res.status(201).json({ connection: rows[0] });
        } catch (err) {
            console.error("Error creating connection:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    //update an existing connection for the authenticated user
    updateConnection: async (req, res) => {
        const userId = req.userId;
        const connectionId = req.params.connectionId;
        const { connection_name, reach_out_priority, reminder_frequency_days, notes, connection_type, know_from } = req.body;

        try {
            const query = `
                UPDATE connections
                SET connection_name = $1, reach_out_priority = $2, reminder_frequency_days = $3, notes = $4, connection_type = $5, know_from = $6
                WHERE id = $7 AND user_id = $8
                RETURNING id, connection_name, reach_out_priority, reminder_frequency_days, created_at, last_contacted_at
            `;
            const { rows } = await pool.query(query, [connection_name, reach_out_priority, reminder_frequency_days, notes, connection_type, know_from, connectionId, userId]);
            if (rows.length === 0) {
                return res.status(404).json({ error: "Connection not found" });
            }
            return res.status(200).json({ connection: rows[0] });
        } catch (err) {
            console.error("Error updating connection:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    //delete a connection for the authenticated user
    deleteConnection: async (req, res) => {
        const userId = req.userId;
        const connectionId = req.params.connectionId;

        try {
            const query = `
                DELETE FROM connections
                WHERE id = $1 AND user_id = $2
                RETURNING id
            `;
            const { rows } = await pool.query(query, [connectionId, userId]);
            if (rows.length === 0) {
                return res.status(404).json({ error: "Connection not found" });
            }
            return res.status(204).send();
        } catch (err) {
            console.error("Error deleting connection:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    //get details for a specific connection
    getConnectionDetails: async (req, res) => {
        const userId = req.userId;
        const connectionId = req.params.connectionId;

        try {
            const query = `
                SELECT *
                FROM connections
                WHERE id = $1 AND user_id = $2
            `;
            const { rows } = await pool.query(query, [connectionId, userId]);
            if (rows.length === 0) {
                return res.status(404).json({ error: "Connection not found" });
            }
            return res.status(200).json({ connection: rows[0] });
        } catch (err) {
            console.error("Error fetching connection details:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    searchConnections: async (req, res) => {
        const userId = req.userId;
        const queryParam = req.params.query;
        const limit = 50; // limit to 50 results, don't worry about pages (if user were to want to search more in depth, assume for now they would refine their search)

        try {
            const query = `
                SELECT id, connection_name, reach_out_priority, reminder_frequency_days, created_at, last_contacted_at
                FROM connections
                WHERE user_id = $1 AND connection_name ILIKE $2
                ORDER BY 
                (reach_out_priority * 0.5) + (0.5 * (EXTRACT(EPOCH FROM (NOW() - last_contacted_at))/86400 - reminder_frequency_days)) DESC,
                connection_name ASC
                LIMIT 50
            `;
            const { rows } = await pool.query(query, [userId, `%${queryParam}%`]);
            return res.status(200).json({ connections: rows });
        } catch (err) {
            console.error("Error searching connections:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

export default ConnectionsController;