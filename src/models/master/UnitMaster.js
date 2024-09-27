import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import BaseModel from '../base/BaseModel.js'; // Import your BaseModel
import Company from '../company/Company.js';

class UnitMaster extends BaseModel { }

UnitMaster.init({
    unit_master_id: {
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
        },
        allowNull: false
    },
    unit_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    conversion_ratio: {
        type: DataTypes.DECIMAL,
        allowNull: false,
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
    modelName: 'UnitMaster',
    tableName: 'unit_masters', // Use plural and underscores for table name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['company_id', 'unit_name']
        }
    ]
});

export default UnitMaster;