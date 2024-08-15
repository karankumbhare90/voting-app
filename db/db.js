const mongoose = require('mongoose');
require('dotenv').config();

// connection URL || connect the database;

const mongoURL = process.env.MONGO_LOCAL_URL;

mongoose.connect(mongoURL);

// get the default connection
const db = mongoose.connection;

// event listener of database
// Connected
db.on('connected', () => {
    console.log('Database Connected');
})

// Error while connecting
db.on('error', (err) => {
    console.log(`Error while connecting : ${err}`);
})

// Disconnect
db.on('disconnected', () => {
    console.log('Database Disconnect');
})

module.exports = {
    db,
}