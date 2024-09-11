import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
import PAYMENT_MODES from '../../constants/paymentModes.js'; // Ensure this is an array of strings
import Company from '../company/Company.js';
import ExpenseCategory from '../expense/ExpenseCategories.js';
import ExpenseEntry from '../expense/ExpenseEntry.js';

class SalaryLedger extends Model { }

SalaryLedger.init({
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Company,
            key: 'id',
        },
    },
    salary_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ExpenseEntry,
            key: 'id',
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING, // Changed to STRING if JSON is not necessary
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
    sequelize,
    modelName: 'Salary_Ledger',
    timestamps: true,
});

export default SalaryLedger; // Export the model itself
