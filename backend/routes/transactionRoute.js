import express from "express";
import authenticateToken from "../middleware/authMiddleware.js";
import pool from "../db/index.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {

    try {
        const userId = req.user.id;
        const result = await pool.query("SELECT * FROM transactions WHERE user_id = $1 ORDER BY id DESC", [userId]);

        return res.status(200).json(result.rows);

    } catch (err) {
        console.log("GET request error.", err);
        return res.status(500).json({error: "Internal server error."});
    }
});

router.post("/", authenticateToken, async (req, res) => {

    try {
        const userId = req.user.id;
        const {type, category, amount, description, date} = req.body;

        const result = await pool.query(`INSERT INTO transactions (user_id, type, category, amount, description, date)
                                        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, 
                                    [userId, type, category, amount, description, date]);

        if (result.rows.length === 0) {
            return res.status(400).json({error: "Unable to insert the data to transactions."});
        }

        return res.status(201).json(result.rows[0]);

    } catch (err) {
        console.log("POST request error.", err);
        return res.status(500).json({error: "Internal server error."});
    }
});

router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const transactionId = req.params.id;

        const result = await pool.query(`DELETE FROM transactions WHERE id = $1 AND user_id = $2`, [transactionId, userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({error: "Transaction not found or not authorized."});
        }

        res.status(200).json({message: "Transaction deleted successfully."});

    } catch (err) {
        console.log("DELETE request error.", err);
        return res.status(500).json({error: "Internal server error."});
    }
});

router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const transactionId = req.params.id;
        const {type, category, amount, description, date} = req.body;

        const result = await pool.query(`UPDATE transactions SET type = $1, category = $2, amount = $3, description = $4, date = $5
                                        WHERE id = $6 AND user_id = $7 RETURNING *`, 
                                        [type, category, amount, description, date, transactionId, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({error: "Transaction not found."});
        }

        return res.status(200).json(result.rows[0]);

    } catch (err) {
        console.log("PUT request error.", err);
        return res.status(500).json({error: "Internal server error."});
    }   
});

export default router;