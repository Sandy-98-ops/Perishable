// src/config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

// Initialize Sequelize
const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
    host: MYSQL_HOST,
    dialect: 'mysql',
    logging: (msg) => console.log(msg), // Adjust logging as needed, or set to `false` to disable
});

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to MySQL has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

connectToDatabase();

export default sequelize;
