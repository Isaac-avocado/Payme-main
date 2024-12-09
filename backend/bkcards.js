const express = require('express');
const connection = require('./dbConnect');
const verifyToken = require('./verifyToken');
const router = express.Router();

router.post('/addCard', verifyToken, (req, res) => {
    const { cardNumber, expireDate, cvv } = req.body;
    const userId = req.userId; // Obtener el ID del usuario autenticado

    // Convertir expireDate de MM/YY a YYYY-MM-DD
    const [month, year] = expireDate.split('/');
    const formattedExpireDate = `20${year}-${month}-01`; // Asume que el día es 01 para la fecha de expiración

    console.log(`Received data: cardNumber=${cardNumber}, expireDate=${formattedExpireDate}, cvv=${cvv}, userId=${userId}`);

    const query = 'INSERT INTO cards (user_id, number, expire_date, CVV) VALUES (?, ?, ?, ?)';
    connection.execute(query, [userId, cardNumber, formattedExpireDate, cvv], (err, results) => {
        if (err) {
            console.error('Error inserting card:', err);
            return res.status(500).json({ message: 'Error adding card' });
        }
        res.json({ message: 'Card added successfully' });
    });
});

// Nueva ruta para obtener las tarjetas del usuario
router.get('/getCards', verifyToken, (req, res) => {
    const userId = req.userId; // Obtener el ID del usuario autenticado

    const query = 'SELECT number, expire_date FROM cards WHERE user_id = ?';
    connection.execute(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching cards:', err);
            return res.status(500).json({ message: 'Error fetching cards' });
        }
        res.json(results);
    });
});

module.exports = router;
