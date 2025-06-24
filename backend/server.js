import express from "express";
import cors from "cors";
import pool from "./db/index.js"
import dotenv from "dotenv";
import authRouter from "./routes/authRoute.js";
import transactionRouter from "./routes/transactionRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.DATABASE_URL || 5000;

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api/auth", authRouter);
app.use("/api/transaction", transactionRouter);

app.listen((PORT), () => {
    console.log(`Server running on http://localhost:${PORT}.`);
});