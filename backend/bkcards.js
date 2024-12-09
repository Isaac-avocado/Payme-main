const express = require('express');
const connection = require('./dbConnect');
const verifyToken = require('./verifyToken');
const router = express.Router();

router.post('/addCard', verifyToken, (req, res) => {
    const { cardNumber, expireDate, cvv } = req.body;
    const userId = req.userId; 

    // Convertir expireDate de MM/YY a YYYY-MM-DD
    const [month, year] = expireDate.split('/');
    const formattedExpireDate = `20${year}-${month}-01`;

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

router.get('/getCards', verifyToken, (req, res) => {
    const userId = req.userId; 

    const query = 'SELECT number, expire_date FROM cards WHERE user_id = ?';
    connection.execute(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching cards:', err);
            return res.status(500).json({ message: 'Error fetching cards' });
        }
        res.json(results);
    });
});

router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const userId = req.userId; 

    const query = 'DELETE FROM cards WHERE id = ? AND user_id = ?';
    connection.execute(query, [id, userId], (err, results) => {
        if (err) {
            console.error('Error deleting card:', err);
            return res.status(500).json({ message: 'Error deleting card' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Card not found or not authorized' });
        }

        res.json({ message: 'Card deleted successfully' });
    });
});


module.exports = router;
