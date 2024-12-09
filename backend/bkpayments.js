const express = require('express');
const connection = require('./dbConnect');
const verifyToken = require('./verifyToken');
const router = express.Router();

// Transferencia entre usuarios
router.post('/transferBetweenUsers', verifyToken, (req, res) => {
    const { email, amount, description } = req.body;
    const userId = req.userId; // ID del usuario autenticado

    connection.beginTransaction((err) => {
        if (err) {
            console.error('Error iniciando la transacción:', err);
            return res.status(500).json({ message: 'Error starting transaction' });
        }

        // Obtener ID del destinatario
        const getUserQuery = 'SELECT id FROM users WHERE email = ?';
        connection.execute(getUserQuery, [email], (err, results) => {
            if (err || results.length === 0) {
                console.error('Error al obtener destinatario:', err);
                return connection.rollback(() => {
                    res.status(404).json({ message: 'Recipient not found' });
                });
            }

            const recipientId = results[0].id;

            // Actualizar balance del remitente
            const deductBalanceQuery = `
                UPDATE users SET user_balance = user_balance - ?
                WHERE id = ? AND user_balance >= ?
            `;
            connection.execute(deductBalanceQuery, [amount, userId, amount], (err, results) => {
                if (err || results.affectedRows === 0) {
                    console.error('Error al deducir balance del remitente:', err);
                    return connection.rollback(() => {
                        res.status(400).json({ message: 'Insufficient balance' });
                    });
                }

                // Actualizar balance del destinatario
                const addBalanceQuery = `
                    UPDATE users SET user_balance = user_balance + ?
                    WHERE id = ?
                `;
                connection.execute(addBalanceQuery, [amount, recipientId], (err) => {
                    if (err) {
                        console.error('Error al añadir balance al destinatario:', err);
                        return connection.rollback(() => {
                            res.status(500).json({ message: 'Error updating recipient balance' });
                        });
                    }

                    // Registrar la transacción del remitente (expense)
                    const transactionQuery = `
                        INSERT INTO transactions (user_id, type, amount, description)
                        VALUES (?, 'expense', ?, ?)
                    `;
                    connection.execute(transactionQuery, [userId, amount, description], (err) => {
                        if (err) {
                            console.error('Error al registrar la transacción del remitente:', err);
                            return connection.rollback(() => {
                                res.status(500).json({ message: 'Error logging transaction' });
                            });
                        }

                        // Registrar la transacción del destinatario (income)
                        const recipientTransactionQuery = `
                            INSERT INTO transactions (user_id, type, amount, description)
                            VALUES (?, 'income', ?, ?)
                        `;
                        connection.execute(recipientTransactionQuery, [recipientId, amount, description], (err) => {
                            if (err) {
                                console.error('Error al registrar la transacción del destinatario:', err);
                                return connection.rollback(() => {
                                    res.status(500).json({ message: 'Error logging recipient transaction' });
                                });
                            }

                            // Confirmar la transacción
                            connection.commit((err) => {
                                if (err) {
                                    console.error('Error al confirmar la transacción:', err);
                                    return connection.rollback(() => {
                                        res.status(500).json({ message: 'Error committing transaction' });
                                    });
                                }
                                res.json({ message: 'Transfer successful' });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Transferencia entre tarjetas
router.post('/transferBetweenCards', verifyToken, (req, res) => {
    const { ownCard, endCard, amount, description } = req.body;
    const userId = req.userId; // ID del usuario autenticado

    connection.beginTransaction((err) => {
        if (err) {
            console.error('Error iniciando la transacción:', err);
            return res.status(500).json({ message: 'Error starting transaction' });
        }

        // Verificar fondos en la tarjeta propia
        const getOwnCardBalanceQuery = `
            SELECT card_balance FROM cards WHERE user_id = ? AND number = ?
        `;
        connection.execute(getOwnCardBalanceQuery, [userId, ownCard], (err, results) => {
            if (err || results.length === 0 || results[0].balance < amount) {
                console.error('Fondos insuficientes o tarjeta no encontrada:', err);
                return connection.rollback(() => {
                    res.status(400).json({ message: 'Insufficient funds or card not found' });
                });
            }

            // Deducir fondos de la tarjeta propia
            const deductOwnCardBalanceQuery = `
                UPDATE cards SET card_balance = card_balance - ?
                WHERE user_id = ? AND number = ?
            `;
            connection.execute(deductOwnCardBalanceQuery, [amount, userId, ownCard], (err) => {
                if (err) {
                    console.error('Error al deducir fondos de la tarjeta propia:', err);
                    return connection.rollback(() => {
                        res.status(500).json({ message: 'Error deducting funds from own card' });
                    });
                }

                // Añadir fondos a la tarjeta receptora
                const addRecipientCardBalanceQuery = `
                    UPDATE cards SET card_balance = card_balance + ?
                    WHERE number = ?
                `;
                connection.execute(addRecipientCardBalanceQuery, [amount, endCard], (err) => {
                    if (err) {
                        console.error('Error al añadir fondos a la tarjeta receptora:', err);
                        return connection.rollback(() => {
                            res.status(500).json({ message: 'Error adding funds to recipient card' });
                        });
                    }

                    // Registrar la transacción
                    const transactionQuery = `
                        INSERT INTO transactions (user_id, type, amount, description)
                        VALUES (?, 'expense', ?, ?)
                    `;
                    connection.execute(transactionQuery, [userId, amount, description], (err) => {
                        if (err) {
                            console.error('Error al registrar la transacción:', err);
                            return connection.rollback(() => {
                                res.status(500).json({ message: 'Error logging transaction' });
                            });
                        }

                        // Confirmar la transacción
                        connection.commit((err) => {
                            if (err) {
                                console.error('Error al confirmar la transacción:', err);
                                return connection.rollback(() => {
                                    res.status(500).json({ message: 'Error committing transaction' });
                                });
                            }
                            res.json({ message: 'Transfer successful' });
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;
