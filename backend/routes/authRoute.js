import express from "express";
import pool from "../db/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
    try {
        const {username, email, password, rePassword} = req.body;

        if (!username?.trim() || !email?.trim() || !password?.trim() || !rePassword?.trim()) {
            return res.status(400).json({error: "All fields are required."});
        }

        if (password !== rePassword) {
            return res.status(422).json({error: "Passwords do not match."});
        }

        const existingAccount = await pool.query("SELECT * FROM users WHERE username = $1 OR email = $2", [username, email]);

        if (existingAccount.rows.length > 0) {
            return res.status(409).json({error: "Username or email already exists."});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(`INSERT INTO users (username, email, password) 
                                        VALUES ($1, $2, $3) RETURNING *`, [username, email, hashedPassword]);
        if (result.rows.length === 0) {
            return res.status(400).json({error: "Register failed."});
        }

        const user = result.rows[0];

        const token = jwt.sign({id: user.id, username: user.username, email: user.email}, process.env.JWT_SECRET, {expiresIn: "1d"});

        return res.status(201).json({message: "User registered.", token, id: user.id, username: user.username, email: user.email});

    } catch (err) {
        console.error("Register error.", err);
        return res.status(500).json({error: "Internal server error."});
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({error: "All fields are required."});
        }

        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({error: "Email does not exist."});
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({error: "Incorrect password"});
        }

        const token = jwt.sign({id: user.id, username: user.username, email: user.email}, process.env.JWT_SECRET, {expiresIn: "1d"});

        return res.status(200).json({message: "User logged in.", token, id: user.id, username: user.username, email: user.email});

    } catch (err) {
        console.error("Login error.", err);
        return res.status(500).json({error: "Internal server error."});
    }
});

authRouter.post("/forgotpassword", async (req, res) => {
    try {
        const {username, email} = req.body;

        if (!username?.trim() || !email?.trim()) {
            return res.status(400).json({error: "All fields are required."});
        }

        const result = await pool.query("SELECT * FROM users WHERE username = $1 AND email = $2", [username, email]);
        if (result.rows.length === 0) {
            return res.status(404).json({error: "Username or email does not exist."});
        }

        const temporaryPassword = crypto.randomBytes(6).toString("base64").slice(0,8);
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        const result2 = await pool.query("UPDATE users SET password = $1 WHERE username = $2 AND email = $3 RETURNING *", 
                                        [hashedPassword, username, email]);
        
        if (result2.rows.length === 0) {
            return res.status(400).json({error: "Unable to set temporary password."});
        }

        return res.status(200).json({message: "Temporary password has been set."});

    } catch (err) {
        console.error("Unable to send temporary password.", err);
        return res.status(500).json({error: "Internal server error."});
    }
});

authRouter.post("/changepassword", authenticateToken, async (req, res) => {
    try {
        const {id, username, email} = req.user;
        const {currentPassword, newPassword, reNewPassword} = req.body;

        if (!currentPassword?.trim() || !newPassword?.trim() || !reNewPassword?.trim()) {
            return res.status(400).json({error: "All fields are required."});
        }

        if (newPassword !== reNewPassword) {
            return res.status(422).json({error: "New passwords do not match."});
        }

        const checkCurrentPassword = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (checkCurrentPassword.rows.length === 0) {
            return res.status(404).json({error: "Username or email invalid."});
        }

        const isMatch = await bcrypt.compare(currentPassword, checkCurrentPassword.rows[0].password);

        if (!isMatch) {
            return res.status(401).json({error: "Incorrect current password."});
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const result = await pool.query("UPDATE users SET password = $1 WHERE id = $2 RETURNING *", 
            [hashedNewPassword, id]);

        if (result.rows.length === 0) {
            return res.status(400).json({error: "Unable to set new password."});
        }

        return res.status(200).json({message: "New password has been set."});

    } catch (err) {
        console.error("Unable to change password.");
        return res.status(500).json({error: "Internal server error."});
    }
});

export default authRouter;