import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import Employee from '../employee/Employee.js';
import Company from '../company/Company.js';
import ExpenseCategory from './ExpenseCategories.js';
import PAYMENT_MODES from '../../constants/paymentModes.js';
import BaseModel from '../base/BaseModel.js';

class ExpenseEntry extends BaseModel { }

ExpenseEntry.init({
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key: 'emp_id',
        },
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
            isIn: [PAYMENT_MODES], // Validates payment modes
        },
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    approver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key: 'emp_id',
        },
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'ExpenseEntry',
    tableName: 'expense_entries', // Ensure table name is correctly pluralized and in snake_case
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default ExpenseEntry;