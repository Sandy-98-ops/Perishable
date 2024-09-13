import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
import Employee from './Employee.js';
import Company from '../company/Company.js'; // Ensure the path to the Company model is correct
import PAYMENT_MODES from '../../constants/paymentModes.js';

class EmployeePayroll extends Model { }

EmployeePayroll.init({
    employee_payroll_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    employee_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Employee,
            key: 'emp_id',
        },
        allowNull: false,
    },
    base_salary: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    hours_worked: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    overtime_hours: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    total_earnings: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    tax_deductions: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    other_deductions: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    advances_deducted: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    net_pay: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    payment_status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pay_period: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    company_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'company_id',
        },
        allowNull: false,
    },
    payment_mode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [PAYMENT_MODES], // Ensures only valid payment modes are accepted
        },
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Employee_Payroll',
    tableName: "employee_payroll",
    timestamps: true,
});

// Define associations
EmployeePayroll.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
EmployeePayroll.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

export default EmployeePayroll;