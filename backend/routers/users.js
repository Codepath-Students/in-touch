import express from 'express';
import rateLimit from "express-rate-limit";
import UsersController from '../controllers/users.js';
import { requireAccessToken } from '../middleware/auth.js';

const UsersRouter = express.Router();



// Route to get user profile information (requires authentication) -- uses requireAccessToken middleware so don't need to pass user ID in URL (in future when we want to allow getting other users' profiles we can modify this and will probably have seperate views for own profile vs others)
UsersRouter.get('', requireAccessToken, UsersController.getProfile);

// Route to update user profile information (requires authentication) --- once again since we have requireAccessToken middleware we can get user ID from req.user.id
UsersRouter.put('', requireAccessToken, UsersController.updateProfile);

// Route to delete user account (requires authentication) -- once again since we have requireAccessToken middleware we can get user ID from req.user.id
UsersRouter.delete('', requireAccessToken, UsersController.deleteAccount);

export default UsersRouter;