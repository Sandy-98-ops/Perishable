import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
import Employee from '../employee/Employee.js';
import Company from '../company/Company.js';
import ExpenseCategory from './ExpenseCategories.js';
import PAYMENT_MODES from '../../constants/paymentModes.js';

class ExpenseEntry extends Model { }

ExpenseEntry.init({
    employee_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Employee, // Name of the table for Employee model
            key: 'emp_id',
        },
        allowNull: false,
    },
    company_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Company, // Name of the table for Company model
            key: 'company_id',
        },
        allowNull: true,
    },
    expense_category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: ExpenseCategory, // Name of the table for ExpenseCategories model
            key: 'expense_category_id',
        },
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    receipt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    payment_mode: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [PAYMENT_MODES], // Ensures only valid payment modes are accepted
        },
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    approver_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Employee, // Name of the table for Employee model
            key: 'emp_id',
        },
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Expense_Entry',
    timestamps: true,
});

export default ExpenseEntry;