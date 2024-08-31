const mongoose = require('mongoose');

// MongoDB connection URL
const mongoURI = 'mongodb+srv://anuj:Anuj5926@dns.csww1j3.mongodb.net/?retryWrites=true&w=majority&appName=DNS';

function mongodbConnect() {

    mongoose.connect(mongoURI);

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    db.once('open', () => {
        console.log('Connected to MongoDB');
    });
}

module.exports = mongodbConnect;
