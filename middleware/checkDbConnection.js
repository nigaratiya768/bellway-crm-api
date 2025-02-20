// middleware/checkDbConnection.js
const mongoose = require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:"../config/config.env"});
const checkDbConnection = async (req, res, next) => {
    try {
        const mongodbUrl = req?.headers['mongodb-url']?.trim();
        if (mongoose.connection.readyState === 0) {
            // If not connected, attempt to connect
            await mongoose.connect(process.env.mongodbUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
           next();
        } else {
            console.log('Already connected to MongoDB');
        }
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle connection errors
        console.error('Error connecting to MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = checkDbConnection;
