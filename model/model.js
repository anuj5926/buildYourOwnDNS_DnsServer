const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const recordSchema = new Schema({
    Username: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Record: [
        {
            Type: { type: String, required: true },
            Subdomain: { type: String, required: true },
            Value: { type: String, required: true },
            Comment: { type: String }
        }
    ],
    domain: { type: String, required: true, unique: true },
});

// Create the model
const Record = mongoose.model('logins', recordSchema);

module.exports = Record;