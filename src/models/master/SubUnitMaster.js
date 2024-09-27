import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import BaseModel from '../base/BaseModel.js';
import UnitMaster from './UnitMaster.js';
import Company from '../company/Company.js';

class SubUnitMaster extends BaseModel { }

SubUnitMaster.init({
    sub_unit_master_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    unit_master_id: {
        type: DataTypes.INTEGER,
        references: {
            model: UnitMaster,
            key: 'unit_master_id'
        }
    },
    company_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'company_id'
        }
    },
    sub_unit_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    conversion_ratio: {
        type: DataTypes.DECIMAL,
        allowNull: true, // Assuming it may be optional or default to null
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
    modelName: 'SubUnitMaster',
    tableName: 'sub_unit_masters',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default SubUnitMaster;
