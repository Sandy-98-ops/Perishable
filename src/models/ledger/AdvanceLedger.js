import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import Employee from '../employee/Employee.js';
import Company from '../company/Company.js';
import PAYMENT_MODES from '../../constants/paymentModes.js';
import BaseModel from '../base/BaseModel.js';
import EmployeeAdvance from '../employee/EmployeeAdvance.js';

class AdvanceLedger extends BaseModel { }

AdvanceLedger.init({
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
    advance_id: {
        type: DataTypes.INTEGER,
        references: {
            model: EmployeeAdvance, // Name of the table for EmployeeAdvance model
            key: 'id',
        },
        allowNull: true,
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
    modelName: 'Advance_Ledger',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

// Define associations
AdvanceLedger.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
AdvanceLedger.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
AdvanceLedger.belongsTo(EmployeeAdvance, { foreignKey: 'advance_id', as: 'employee_advance' });

export default AdvanceLedger;