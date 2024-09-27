import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import Company from '../company/Company.js';
import bcrypt from 'bcrypt';
import BaseModel from '../base/BaseModel.js';
import Role from '../master/Role.js';

const SALT_ROUNDS = 10; // Define your salt rounds here or import from config

class Employee extends BaseModel { }

Employee.init({
    emp_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    company_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'company_id',
        },
        allowNull: false,
    },
    employee_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    phone_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    hire_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    job_title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    salary: { // One Day Salary 
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    number_of_hours: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    hourly_rate: { // Splitting salary to hourly rate
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    payment_method: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bank_account: {
        type: DataTypes.JSON, // Use JSON to store bank account details
        allowNull: true,
    },
    tax_details: {
        type: DataTypes.JSON, // Use JSON to store tax details
        allowNull: true,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    otp_expiration: {
        type: DataTypes.DATE,
        allowNull: true
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
    modelName: 'Employee',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['company_id', 'employee_id']
        }
    ],
    hooks: {
        beforeSave: async (employee) => {
            if (employee.changed('password')) {
                const hashedPassword = await bcrypt.hash(employee.password, SALT_ROUNDS);
                employee.password = hashedPassword;
            }
        }
    }
});

// Define associations
Employee.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Employee.belongsToMany(Role, { through: 'EmployeeRoles', foreignKey: 'emp_id' });
Role.belongsToMany(Employee, { through: 'EmployeeRoles', foreignKey: 'role_id' });

export default Employee;