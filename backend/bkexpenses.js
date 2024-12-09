const express = require('express');
const connection = require('./dbConnect');
const verifyToken = require('./verifyToken');
const router = express.Router();

router.get('/', verifyToken, (req, res) => {
    const userId = req.userId; // Obtener el ID del usuario autenticado

    const query = `
        SELECT date, amount
        FROM transactions
        WHERE user_id = ? AND type = 'expense'
        ORDER BY date`;

    connection.execute(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching expense data:', err);
            return res.status(500).json({ message: 'Error fetching expense data' });
        }
        const labels = results.map(row => row.date);
        const values = results.map(row => row.amount);

        // Calcular la suma total de gastos
        const totalExpenses = values.reduce((acc, currentValue) => acc + currentValue, 0);

        res.json({ labels, values, totalExpenses: parseFloat(totalExpenses) }); // Asegurarse de que sea un número
    });
});

module.exports = router;
