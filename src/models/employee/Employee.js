import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
import Company from '../company/Company.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // Define your salt rounds here or import from config

class Employee extends Model { }

Employee.init({
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
            key: 'id',
        },
        allowNull: true,
    },
    employee_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true // Ensure email is unique within the same company
    },
    phone_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Ensure phone number is unique within the same company
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
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.JSON, // Use JSON to store roles as an array
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Employee',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['email', 'company_id'],
        },
        {
            unique: true,
            fields: ['phone_no', 'company_id'],
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

export default Employee;