"use strict";
const express = require('express');
const path = require("path");
const app = express();

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 8000;

// Connect to the database
const { dbConnection } = require('./src/configs/dbConnection');
dbConnection();

// Use CORS to allow cross-origin requests
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the upload directory
app.use('/upload', express.static('./upload'));

// Authentication middleware
app.use(require('./src/middlewares/authentication'));

// Logging middleware
app.use(require('./src/middlewares/logger'));

// Query handler middleware
app.use(require('./src/middlewares/queryHandler'));

// API Routes:
app.use('/api', require('./src/routes/index'));

// Serve React build directory
const frontendPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendPath));

// Serve the index.html for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
});

// Error handler middleware
app.use(require('./src/middlewares/errorHandler'));

// Start the server
app.listen(PORT, HOST, () => console.log(`Server running at http://${HOST}:${PORT}`));


/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')() // !!! It clear database.