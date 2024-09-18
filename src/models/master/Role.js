import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js'; // Adjust path as needed
import BaseModel from '../base/BaseModel.js';
import Company from '../company/Company.js';

class Role extends BaseModel { }

Role.init({
    role_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    company_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'company_id'
        }
    },
    role_name: {
        type: DataTypes.STRING,
        allowNull: false,
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
    }
}, {
    sequelize,
    modelName: 'Role',
    tableName: 'role', // Ensure this matches your actual table name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['role_name', 'company_id']
        }
    ]
});

export default Role;
