import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';    //Import it properly
import BaseModel from '../base/BaseModel.js';
import Employee from './Employee.js';
import Role from '../master/Role.js';

class EmployeeRoles extends BaseModel { }

EmployeeRoles.init({
    //Other Fields
    employee_role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    employee_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Employee,
            key: 'emp_id'
        },
        onDelete: 'CASCADE',
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'role_id'
        },
        onDelete: 'CASCADE',
        allowNull: false
    },
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
    tableName: 'employee_roles', // Ensure this matches your actual table name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default EmployeeRoles;