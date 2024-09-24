import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';    //Import it properly
import BaseModel from '../base/BaseModel.js';
import Company from '../company/Company.js';

class Charge extends BaseModel { }

Charge.init({
    //Other Fields

    charge_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    company_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'company_id'
        }
    },
    charge_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    calculation_method: {
        type: DataTypes.ENUM,
        values: ['Percentage', 'Quantity'], // Define ENUM values here
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
    tableName: 'charge', // Ensure this matches your actual table name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default Charge;