import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';    //Import it properly
import BaseModel from '../base/BaseModel.js';
import Inward from './Inward.js';
import Party from '../party/Party.js';

class Differences extends BaseModel { }

Differences.init({
    //Other Fields

    difference_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    inward_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Inward,
            key: 'inward_id'
        },
    },
    farmer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Party,
            key: 'party_id'
        }
    },
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Party,
            key: 'party_id'
        }
    },
    weight_1: {
        type: DataTypes.DECIMAL,
    },
    price_1: {
        type: DataTypes.DECIMAL,

    },
    total_1: {
        type: DataTypes.DECIMAL,
    },
    weight_2: {
        type: DataTypes.DECIMAL,
    },
    price_2: {
        type: DataTypes.DECIMAL,

    },
    total_2: {
        type: DataTypes.DECIMAL,
    },
    weight_difference: {
        type: DataTypes.DECIMAL,
    },
    price_difference: {
        type: DataTypes.DECIMAL,
    },
    total_difference: {
        type: DataTypes.DECIMAL,
    },
    entry_date: {
        type: DataTypes.DATE
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
    tableName: 'differences', // Ensure this matches your actual table name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default Differences;