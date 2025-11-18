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

  //update profile information for the authenticated user (partial update)
  updateProfile: async (req, res) => {
    const userId = req.userId;
    const allowed = [
      "username",
      "display_name",
      "profile_picture_url",
      "bio",
      "personality_type",
      "nearest_city",
      "hobbies",
    ];
    try {
      const entries = Object.entries(req.body || {}).filter(([k, v]) =>
        allowed.includes(k)
      );

      // If nothing to update, return current profile
      if (entries.length === 0) {
        const { rows } = await pool.query(
          `SELECT id, email, display_name, username, created_at, last_login_at, profile_picture_url, bio, personality_type, nearest_city, hobbies
                     FROM users WHERE id = $1`,
          [userId]
        );
        if (rows.length === 0)
          return res.status(404).json({ error: "User not found" });
        return res.status(200).json({ user: rows[0] });
      }

      // Basic length validations aligned to schema
      const obj = Object.fromEntries(entries);
      if (obj.display_name && obj.display_name.length > 100) {
        return res
          .status(400)
          .json({ error: "display_name too long (max 100)" });
      }
      if (obj.username && obj.username.length > 50) {
        return res.status(400).json({ error: "username too long (max 50)" });
      }
      if (obj.bio && obj.bio.length > 500) {
        return res.status(400).json({ error: "bio too long (max 500)" });
      }
      if (obj.personality_type && obj.personality_type.length > 50) {
        return res
          .status(400)
          .json({ error: "personality_type too long (max 50)" });
      }
      if (obj.nearest_city && obj.nearest_city.length > 100) {
        return res
          .status(400)
          .json({ error: "nearest_city too long (max 100)" });
      }
      if (obj.hobbies && obj.hobbies.length > 255) {
        return res.status(400).json({ error: "hobbies too long (max 255)" });
      }

      // Build dynamic SET clause only for provided fields
      const setClauses = entries.map(([k], i) => `${k} = $${i + 1}`);
      const values = entries.map(([, v]) => v);
      const query = `
                UPDATE users
                SET ${setClauses.join(", ")}
                WHERE id = $${values.length + 1}
                RETURNING id, email, username, display_name, profile_picture_url, bio, personality_type, nearest_city, hobbies, created_at
            `;
      const { rows } = await pool.query(query, [...values, userId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({ user: rows[0] });
    } catch (err) {
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
