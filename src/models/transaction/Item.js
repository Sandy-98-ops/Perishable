import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import ItemCategory from '../master/ItemCategory.js';
import UnitMaster from '../master/UnitMaster.js';
import BaseModel from '../base/BaseModel.js'; // Import your BaseModel
import Company from '../company/Company.js';
import SubUnitMaster from '../master/SubUnitMaster.js';

class Item extends BaseModel { }

Item.init({
    item_id: {
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
    item_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    item_category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: ItemCategory,
            key: 'item_category_id',
        },
        allowNull: false, // Ensure this foreign key is not nullable if appropriate
    },
    unit_master_id: {
        type: DataTypes.INTEGER,
        references: {
            model: UnitMaster,
            key: 'unit_master_id',
        },
        allowNull: false, // Ensure this foreign key is not nullable if appropriate
    },
    sub_unit_master_id: {
        type: DataTypes.INTEGER,
        references: {
            model: SubUnitMaster,
            key: 'sub_unit_master_id'
        },
        allowNull: false, // Set to true if this is optional
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true, // Set to true if this is optional
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
    modelName: 'Item',
    tableName: 'items', // Use plural and underscore for table name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default Item;
