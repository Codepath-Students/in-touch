import pool from "../config/database.js";

const UsersController = {
    //get profile information for the authenticated user
    getProfile: async (req, res) => {
        const userId = req.userId;

        try {
            const query = `
                SELECT id, email, name, created_at, updated_at
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
        const { name } = req.body;
        try {
            const query = `
                UPDATE users
                SET name = $1, updated_at = NOW()
                WHERE id = $2
                RETURNING id, email, name, created_at, updated_at
            `;
            const { rows } = await pool.query(query, [name, userId]);
            if (rows.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json({ user: rows[0] });
        } catch (err) {
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