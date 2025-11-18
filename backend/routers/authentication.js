import express from "express";
import rateLimit from "express-rate-limit";
import AuthenticationController from "../controllers/authentication.js";
import { verifyRefreshToken } from "../middleware/auth.js";

const AuthenticationRouter = express.Router();

// Rate limiter for sensitive authentication endpoints
const verifyTokenRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
// Route for verifying access token
AuthenticationRouter.post(
  "/verify-token",
  verifyTokenRateLimiter,
  AuthenticationController.verifyAccessToken
);

// Route for verifying refresh token
AuthenticationRouter.post(
  "/verify-refresh-token",
  AuthenticationController.verifyRefreshToken
);

// Route to issue new access token using refresh token (from cookie)
AuthenticationRouter.post(
  "/token/refresh",
  verifyRefreshToken,
  AuthenticationController.refreshAccessToken
);

// Route for user login with email and password
AuthenticationRouter.post("/login", AuthenticationController.loginWithEmail);

// Route for user signup with email and password
AuthenticationRouter.post("/signup", AuthenticationController.signup);

// Google OAuth routes :
// Route triggered when user clicks login/signup with Google
AuthenticationRouter.get("/google", AuthenticationController.promptGoogle);

// Route for handling Google OAuth callback
AuthenticationRouter.get(
  "/google/callback",
  AuthenticationController.handleGoogleCallback
);

// Route for user logout
AuthenticationRouter.post("/logout", AuthenticationController.logout);

// Route for verifying user email
AuthenticationRouter.get("/verify-email", AuthenticationController.verifyEmail);

// Route for initiating password reset
AuthenticationRouter.post(
  "/reset-password",
  AuthenticationController.initiatePasswordReset
);

// Route for completing password reset
AuthenticationRouter.post(
  "/reset-password/complete",
  AuthenticationController.completePasswordReset
);

export default AuthenticationRouter;
