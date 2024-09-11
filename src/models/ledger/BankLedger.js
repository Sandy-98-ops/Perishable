import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
import PAYMENT_MODES from '../../constants/paymentModes.js'; // Ensure this is an array of strings
import Company from '../company/Company.js';
import ExpenseCategory from '../expense/ExpenseCategories.js';

class BankLedger extends Model { }

BankLedger.init({
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Company, // Name of the table for Company model
            key: 'id',
        },
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.JSON, // Use JSON to handle multiple language entries
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
            isIn: [PAYMENT_MODES],
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
    modelName: 'Bank_Ledger',
    timestamps: true,
});

export default BankLedger;
