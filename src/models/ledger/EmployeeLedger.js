// src/models/EmployeeLedger.js
import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import BaseModel from '../base/BaseModel.js'; // Adjust path as needed
import Employee from '../employee/Employee.js';
import Company from '../company/Company.js';
import PAYMENT_MODES from '../../constants/paymentModes.js';

// Define the EmployeeLedger model
class EmployeeLedger extends BaseModel { }

EmployeeLedger.init({
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
    // Include fields from BaseModel
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize,
    tableName: 'employee_ledger', // Ensure this matches your actual table name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default EmployeeLedger;