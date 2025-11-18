import pool from "../config/database.js";

const UsersController = {
    //get profile information for the authenticated user
    getProfile: async (req, res) => {
        const userId = req.userId;

        try {
            const query = `
                SELECT id, email, display_name, username, created_at, last_login_at, profile_picture_url, bio, personality_type, nearest_city, hobbies
                -- don't need is email verified since must have token already to reach this point
                FROM users
                WHERE id = $1
            `;
            const { rows } = await pool.query(query, [userId]);
            if (rows.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json({ user: rows[0] });
        } catch (err) {
            console.error("Error fetching user profile:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
    
    //update profile information for the authenticated user
    updateProfile: async (req, res) => {
        const userId = req.userId;
        const { username, display_name, profile_picture_url, bio, personality_type, nearest_city, hobbies } = req.body;
        try {
        const query = `
            UPDATE users
            SET username = $1, display_name = $2, profile_picture_url = $3, bio = $4, personality_type = $5, nearest_city = $6, hobbies = $7
            WHERE id = $8
            RETURNING id, email, username, display_name, profile_picture_url, bio, personality_type, nearest_city, hobbies, created_at
        `;
        const { rows } = await pool.query(query, [username, display_name, profile_picture_url, bio, personality_type, nearest_city, hobbies, userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ user: rows[0] });
        } catch (err) {
        // Unique violation for username
        if (err.code === "23505") {
            return res.status(400).json({ error: "Username already in use" });
        }
        console.error("Error updating user profile:", err);
        return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    //delete the authenticated user's account
    deleteAccount: async (req, res) => {
        const userId = req.userId;

        try {
            const query = `
                DELETE FROM users
                WHERE id = $1
                RETURNING id
            `;
            const { rows } = await pool.query(query, [userId]);
            if (rows.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(204).send();
        } catch (err) {
            console.error("Error deleting user account:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

};

export default UsersController;