import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import ExpenseCategory from '../expense/ExpenseCategories.js';
import ExpenseEntry from '../expense/ExpenseEntry.js';
import Company from '../company/Company.js';
import PAYMENT_MODES from '../../constants/paymentModes.js';
import Employee from '../employee/Employee.js';

// Define the EmployeeLedger model
const EmployeeLedger = sequelize.define('EmployeeLedger', {

    employee_ledger_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key: 'emp_id',
        }
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Company,
            key: 'company_id',
        },
    },
    expense_category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ExpenseCategory,
            key: 'expense_category_id',
        },
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
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
        defaultValue: 0.0
    },
    debit: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
}, {
    sequelize,
    tableName: 'Expense_Ledgers',
    timestamps: true,
});

export default EmployeeLedger;