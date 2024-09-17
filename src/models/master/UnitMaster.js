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
    }
}, {
    sequelize,
    modelName: 'UnitMaster',
    tableName: 'unit_masters', // Use plural and underscores for table name
    timestamps: true, // Ensure timestamps are enabled
    underscored: true, // Use snake_case for column names
    indexes: [
        {
            unique: true,
            fields: ['company_id', 'unit_name']
        }
    ]
});

export default UnitMaster;