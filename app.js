const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

//import route and swagger
const bookingsRoute = require('./routes/bookings');
const setupSwagger = require('./swagger');

const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_CONN_STRING);

app.use('/api', bookingsRoute);

//setup swagger
setupSwagger(app);

// Start the server and store the server instance
const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

// Function to gracefully shut down the server
const shutdownServer = async () => {
  await mongoose.connection.close();
  server.close();
};

// Export the server and shutdown function
module.exports = { app, server, shutdownServer };
