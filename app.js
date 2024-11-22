const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const usersRouter = require('./routes/users');  // Import users routes
const productsRouter = require('./routes/products');  // Import products routes

const app = express();
const prisma = new PrismaClient();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use the users and products routes
app.use('/users', usersRouter);  // Prefix all user routes with /users
app.use('/products', productsRouter);  // Prefix all product routes with /products

// Example Route: Test Route to check server status
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
