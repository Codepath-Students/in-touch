import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto, { verify } from 'crypto';

dotenv.config();

// class that will handle things like password hashing, encoding/decoding tokens, token verification, getting the user from a token, etc.
const AuthUtils = {
// hash password function
// input : password (string)
// output: hashed password (string)
  hashPassword: async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  },

// compare password function
// input : password (string), hashedPassword (string)
// output: boolean
  comparePassword: async (password, hashedPassword) => {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  },

//issue JWT token function
// input : user object
// output : access token, refresh token
    issueTokens: (user) => {
      const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
      const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
      return { accessToken, refreshToken };
    },

// verify access token
    verifyAccessToken: (token) => {
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return decoded;
      } catch (err) {
        return null;
      }
    },

// verify refresh token
    verifyRefreshToken: (token) => {
      try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        return decoded;
      } catch (err) {
        return null;
      }
    },

// set refresh token cookies
    setRefreshTokenCookie: (res, token) => {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      };
      res.cookie("refreshToken", token, cookieOptions);
    },

// create email verification token
    createEmailVerificationToken: () => {
      const plain_token =  crypto.randomBytes(32).toString('hex');
      const hashed_token = bcrypt.hash(plain_token, 10);
      return { plain_token, hashed_token };
    },

    verifyEmailVerificationToken: async (plain_token, hashed_token) => {
      if (plain_token.expiresIn < Date.now()) {
        return false;
      }
     
      const match = await bcrypt.compare(plain_token, hashed_token);
      if (match) {
        return true;
      }
      return false;
    },

};

export default AuthUtils;