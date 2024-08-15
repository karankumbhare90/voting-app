const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const db = require('./db/db');

// PORT
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// use the router
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);


// Server Running
app.listen(PORT, () => {
    console.log(`Server Running on PORT : ${PORT}`);
})