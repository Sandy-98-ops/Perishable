import express from 'express';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import apiRouter from './src/routes/apiManager.js'; // This will include user routes as well

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

// Set up Sequelize for MySQL connection
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
  }
);

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('DB Connected Successfully');
    app.listen(port, () => {
      console.log(`Server is running on Port: ${port}`);
    });
  })
  .catch(error => {
    console.error('DB Connection Error:', error);
  });

app.use(express.json()); // Parse incoming JSON requests

// Use the API manager for all incoming requests
app.use('/api', apiRouter);

// Middleware for handling errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
