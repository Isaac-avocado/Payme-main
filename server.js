require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const register = require('./backend/bkregister');
const login = require('./backend/bklogin');
const cards = require('./backend/bkcards'); 
const income = require('./backend/bkincome');
const expenses = require('./backend/bkexpenses');
const balance = require('./backend/bkbalance');
const payments = require('./backend/bkpayments'); 
const transactions = require('./backend/bktransactions');

const app = express();

const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/user', register);
app.use('/api/user', login);
app.use('/api/cards', cards);
app.use('/api/income', income); 
app.use('/api/expenses', expenses);
app.use('/api/balance', balance);
app.use('/api/payments', payments); 
app.use('/api/transactions', transactions);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
