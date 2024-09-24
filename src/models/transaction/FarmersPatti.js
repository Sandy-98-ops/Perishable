import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';    //Import it properly
import Inward from './Inward.js';
import Party from '../party/Party.js';
import Item from './Item.js';
import BaseModel from '../base/BaseModel.js';
import Company from '../company/Company.js';

class FarmersPatti extends BaseModel { }

FarmersPatti.init({
    //Other Fields
    farmers_Patti_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    company_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'company_id'
        }
    },
    bill_number: {
        type: DataTypes.STRING,
    },
    inward_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Inward,
            key: 'inward_id'
        }
    },
    farmer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Party,
            key: 'party_id'
        }
    },
    item_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Item,
            key: 'item_id'
        }
    },
    total_qty: {
        type: DataTypes.DECIMAL,

    },
    weight_1: {
        type: DataTypes.DECIMAL,
    },
    price_1: {
        type: DataTypes.DECIMAL,

    },
    item_total: {
        type: DataTypes.DECIMAL,
    },
    dynamic_charges: {
        type: DataTypes.JSON,
    },
    total_charges: {
        type: DataTypes.DECIMAL,
    },
    net_total: {
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
    tableName: 'farmers_patti', // Ensure this matches your actual table name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['company_id', 'bill_number']
        }
    ]
});

export default FarmersPatti;