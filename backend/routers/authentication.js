import express from 'express';
import AuthenticationController from '../controllers/authentication.js';

const AuthenticationRouter = express.Router('/auth');


// Route for verifying access token
AuthenticationRouter.post('/verify-token', AuthenticationController.verifyAccessToken);

// Route for verifying refresh token
AuthenticationRouter.post('/verify-refresh-token', AuthenticationController.verifyRefreshToken);

// Route to issue new access token using refresh token
AuthenticationRouter.post('/token/refresh', AuthenticationController.refreshAccessToken);

// Route for user login with email and password
AuthenticationRouter.post('/login', AuthenticationController.loginWithEmail);

// Route for user signup with email and password
AuthenticationRouter.post('/signup', AuthenticationController.signup);

// Google OAuth routes

// Route triggered when user clicks login/signup with Google
AuthenticationRouter.get('/google', 
    AuthenticationController.promptGoogle
)

// Route for handling Google OAuth callback
AuthenticationRouter.get('/google/callback', 
    AuthenticationController.handleGoogleCallback
);

// Route for user logout
AuthenticationRouter.post('/logout', AuthenticationController.logout);

// Route for verifying user email
AuthenticationRouter.get('/verify-email', AuthenticationController.verifyEmail);

// Route for initiating password reset
AuthenticationRouter.post('/reset-password', AuthenticationController.initiatePasswordReset);

// Route for completing password reset
AuthenticationRouter.post('/reset-password/complete', AuthenticationController.completePasswordReset);

export default AuthenticationRouter;