import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Specify path to .env file relative to current script execution inside src/
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || '';

console.log('Testing MongoDB Connection...');
console.log('URI:', MONGO_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('SUCCESS: MongoDB Connected!');
        process.exit(0);
    })
    .catch(err => {
        console.error('ERROR: MongoDB Connection Failed');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        if (err.cause) console.error('Cause:', err.cause);
        process.exit(1);
    });
