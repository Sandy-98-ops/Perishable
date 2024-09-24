import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';    //Import it properly
import BaseModel from '../base/BaseModel.js';
import Item from './Item.js';
import Company from '../company/Company.js';
import Party from '../party/Party.js';

class Inward extends BaseModel { }

Inward.init({
    inward_id: {
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
    faramer_id: {
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
    item_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Item,
            key: 'item_id'
        }
    },
    total_quantity: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    total_weight: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    entry_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
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
    tableName: 'inward', // Ensure this matches your actual table name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default Inward;