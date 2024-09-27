import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
import Employee from './Employee.js'; // Import the Employee model
import Company from '../company/Company.js'; // Import the Company model
import PAYMENT_MODES from '../../constants/paymentModes.js';
import BaseModel from '../base/BaseModel.js';

class EmployeeAdvance extends BaseModel { }

EmployeeAdvance.init({
    employee_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Employee,
            key: 'emp_id',
        },
        allowNull: false,
    },
    company_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'company_id',
        },
        allowNull: true,
    },
    advance_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    advance_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    repayment_start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    repayment_terms: {
        type: DataTypes.JSON, // Use JSON to store repayment terms as an object
        allowNull: true,
    },
    remaining_balance: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    payment_mode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [PAYMENT_MODES], // Ensures only valid payment modes are accepted
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
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
    modelName: 'Employee_Advance',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

// Define associations
EmployeeAdvance.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
EmployeeAdvance.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

export default EmployeeAdvance;
