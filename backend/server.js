import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import UsersRouter from './routers/users.js';
import AuthenticationRouter from './routers/authentication.js';
import ConnectionsRouter from './routers/connections.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend", "public")));

app.use("/api/users", UsersRouter);
app.use("/api/auth", AuthenticationRouter);
app.use("/api/connections", ConnectionsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});