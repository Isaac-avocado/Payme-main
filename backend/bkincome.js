const express = require('express');
const connection = require('./dbConnect');
const verifyToken = require('./verifyToken');
const router = express.Router();

router.get('/', verifyToken, (req, res) => {
    const userId = req.userId; // Obtener el ID del usuario autenticado

    const query = `
        SELECT date, amount
        FROM transactions
        WHERE user_id = ? AND type = 'income'
        ORDER BY date`;

    connection.execute(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching income data:', err);
            return res.status(500).json({ message: 'Error fetching income data' });
        }
        const labels = results.map(row => row.date);
        const values = results.map(row => row.amount);

        // Calcular la suma total de ingresos
        const totalIncome = values.reduce((acc, currentValue) => acc + currentValue, 0);

        res.json({ labels, values, totalIncome: parseFloat(totalIncome) }); // Asegurarse de que sea un número
    });
});

module.exports = router;
