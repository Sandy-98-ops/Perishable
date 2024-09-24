import { DataTypes, INTEGER, Model } from 'sequelize';
import sequelize from '../../config/db.js';    //Import it properly
import Inward from './Inward.js';
import Party from '../party/Party.js';
import Item from './Item.js';
import Company from '../company/Company.js';
import BaseModel from '../base/BaseModel.js';

class CustomerBill extends BaseModel { }

CustomerBill.init({
    customer_bill_id: {
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
        },
        allowNull: false
    },
    bill_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    inward_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Inward,
            key: 'inward_id'
        }
    },
    customer_id: {
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
    weight_2: {
        type: DataTypes.DECIMAL,
    },
    price_2: {
        type: DataTypes.DECIMAL,

    },
    item_total: {
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
    tableName: 'customer_bill', // Ensure this matches your actual table name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['company_id', 'bill_number'],
        }
    ]
});

export default CustomerBill;