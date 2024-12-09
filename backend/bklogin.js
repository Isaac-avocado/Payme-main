require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('./dbConnect');
const router = express.Router();

const JWT_SECRET = process.env.JWT_KEY; // Usar la clave secreta desde el archivo .env
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN; // Usar la duración desde el archivo .env

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    connection.execute(query, [email], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ message: 'Error logging in' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generar un JWT para el usuario
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({ message: 'Login successful', token, firstName: user.first_name });
    });
});

module.exports = router;
