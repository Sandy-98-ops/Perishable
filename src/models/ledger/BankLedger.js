// models/ledger/BankLedger.js
import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import PAYMENT_MODES from '../../constants/paymentModes.js'; // Ensure this is an array of strings
import Company from '../company/Company.js';

// Define the BankLedger model
const BankLedger = sequelize.define('BankLedger', {
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Set to true if optional
        references: {
            model: Company, // Ensure this references the correct model
            key: 'company_id',
        },
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.JSON, // Use JSON if needed for multiple language entries or complex data
        allowNull: false,
    },
    transaction_id: {
        type: DataTypes.STRING,
        trim: true,
    },
    payment_mode: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [PAYMENT_MODES], // Ensures only valid payment modes are accepted
        },
    },
    credit: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    debit: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
}, {
    tableName: 'Bank_Ledger', // Explicitly define the table name
    timestamps: true, // Ensure timestamps are enabled
});

// Define any instance methods if necessary
// Example: Method to get formatted transaction details
BankLedger.prototype.getFormattedTransaction = function () {
    return `Transaction ID: ${this.transaction_id}, Date: ${this.date.toISOString().split('T')[0]}`;
};

// Define associations if necessary
BankLedger.belongsTo(Company, { foreignKey: 'company_id' });
// Add other associations if applicable

export default BankLedger;