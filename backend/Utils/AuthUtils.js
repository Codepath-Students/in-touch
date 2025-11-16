import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// class that will handle things like password hashing, encoding/decoding tokens, token verification, getting the user from a token, etc.
const Utils = {
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
      const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
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

};

export default Utils;