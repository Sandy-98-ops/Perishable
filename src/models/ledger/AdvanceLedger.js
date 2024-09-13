// models/ledger/AdvanceLedger.js
import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import PAYMENT_MODES from '../../constants/paymentModes.js'; // Ensure this is an array of strings
import Company from '../company/Company.js';
import ExpenseEntry from '../expense/ExpenseEntry.js';
import Employee from '../employee/Employee.js';

const AdvanceLedger = sequelize.define('AdvanceLedger', {
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Company,
            key: 'company_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key: 'emp_id',
        },
    },
    advance_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ExpenseEntry,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
        allowNull: true,
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
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'Advance_Ledgers', // Explicitly set table name if different from modelName
    timestamps: true, // Automatically manage createdAt and updatedAt
});


export default AdvanceLedger;