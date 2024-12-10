const express = require('express');
const connection = require('./dbConnect');
const verifyToken = require('./verifyToken');
const router = express.Router();

router.get('/getUserTransactions', verifyToken, (req, res) => {
    const userId = req.userId; // ID del usuario autenticado

    const query = `
        SELECT id, type, date, description, amount, status, created_at, updated_at 
        FROM transactions 
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    connection.execute(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            return res.status(500).json({ message: 'Error fetching transactions' });
        }
        res.json(results);
    });
});

module.exports = router;
router.get('/getUserTransactionsByDate', verifyToken, (req, res) => {
    const userId = req.userId; // ID del usuario autenticado
    const { date } = req.query; // Fecha pasada como parámetro de consulta

    if (!date) {
        return res.status(400).json({ message: 'Date parameter is required' });
    }

    const query = `
        SELECT id, type, date, description, amount, status, created_at, updated_at 
        FROM transactions 
        WHERE user_id = ? AND DATE(created_at) = ?
        ORDER BY created_at DESC;
    `;

    connection.execute(query, [userId, date], (err, results) => {
        if (err) {
            console.error('Error fetching transactions by date:', err);
            return res.status(500).json({ message: 'Error fetching transactions' });
        }
        res.json(results);
    });
});