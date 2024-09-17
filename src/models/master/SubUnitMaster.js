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
    }
}, {
    sequelize,
    modelName: 'SubUnitMaster',
    tableName: 'sub_unit_masters',
    timestamps: true,
    underscored: true,
});

export default SubUnitMaster;
