const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('./dbConnect');
const router = express.Router();

const JWT_SECRET = process.env.JWT_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

router.post('/register', (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
    connection.execute(query, [first_name, last_name, email, hashedPassword], (err, results) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ message: 'Error registering user' });
        }
        
        // Generar un JWT para el usuario
        const token = jwt.sign({ userId: results.insertId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({ message: 'User registered successfully', token });
    });
});

module.exports = router;
