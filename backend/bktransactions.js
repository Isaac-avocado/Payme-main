const express = require('express');
const connection = require('./dbConnect');
const verifyToken = require('./verifyToken');
const router = express.Router();

router.get('/getUserTransactions', verifyToken, (req, res) => {
    const userId = req.userId; // ID del usuario autenticado
    const { date } = req.query; // Obtener el parámetro de fecha de la consulta

    let query = `
        SELECT id, type, date, description, amount, status, created_at, updated_at 
        FROM transactions 
        WHERE user_id = ?
    `;

    // Si se proporciona una fecha, agregar un filtro para la fecha
    if (date) {
        query += ` AND DATE(created_at) = ?`;  // Filtrar por la fecha exacta (solo la parte de la fecha sin hora)
    }

    query += ' ORDER BY created_at DESC'; // Ordenar por fecha de creación en orden descendente

    connection.execute(query, [userId, date], (err, results) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            return res.status(500).json({ message: 'Error fetching transactions' });
        }
        res.json(results);
    });
});

module.exports = router;
console.log('Received date:', date); // Esto mostrará el valor de la fecha recibida
