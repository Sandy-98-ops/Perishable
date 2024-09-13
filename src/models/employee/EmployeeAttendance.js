import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
import Employee from './Employee.js'; // Import the Employee model
import Company from '../company/Company.js';

class EmployeeAttendance extends Model { }

EmployeeAttendance.init({
    employee_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Employee, // Name of the Employee model
            key: 'emp_id',
        },
        allowNull: false,
    },
    company_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Company, // Name of the Company model
            key: 'company_id',
        },
        allowNull: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    hours_worked: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    overtime_hours: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Employee_Attendance',
    timestamps: true,
});

// Define associations
EmployeeAttendance.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
EmployeeAttendance.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

export default EmployeeAttendance;
