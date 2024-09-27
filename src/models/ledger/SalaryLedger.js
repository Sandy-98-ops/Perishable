import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
import PAYMENT_MODES from '../../constants/paymentModes.js'; // Ensure this is an array of strings
import Company from '../company/Company.js';
import EmployeePayroll from '../employee/EmployeePayroll.js';
import BaseModel from '../base/BaseModel.js';

class SalaryLedger extends BaseModel { }

SalaryLedger.init({
    salary_Ledger_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    employee_payroll_id: {
        type: DataTypes.INTEGER,
        references: {
            model: EmployeePayroll,
            key: 'employee_payroll_id'
        }
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Company,
            key: 'company_id' // Make sure this key matches the Company model’s primary key
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
        allowNull: true,
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
    modelName: 'Salary_Ledger', // Consistent naming
    timestamps: true,
    createdAt: 'created_at',
    modifiedAt: 'modified_at'
});

export default SalaryLedger;