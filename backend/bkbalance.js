const express = require('express');
const connection = require('./dbConnect');
const verifyToken = require('./verifyToken');
const router = express.Router();
router.get('/', verifyToken, (req, res) => {
    const userId = req.userId; 
    console.log(`Fetching balance for userId: ${userId}`); // Log para depuración
    const query = 'SELECT user_balance FROM users WHERE id = ?';
    connection.execute(query, [userId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Error executing query', error: err });
        }
       
        if (results.length > 0) {
            const balance = results[0].user_balance;
            if (balance !== null && !isNaN(balance)) {
                console.log(`User balance for userId ${userId}: ${balance}`);
                res.json({ balance: parseFloat(balance) });
            } else {
                console.error('Balance is not a number');
                res.status(500).json({ message: 'Balance is not a number', balance });
            }
        } else {
            console.error('User not found or no balance available');
            return res.status(404).json({ message: 'User not found or no balance available' });
        }
    });
});
module.exports = router;