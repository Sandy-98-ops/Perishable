// models/Party.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
import Company from '../company/Company.js';

class Party extends Model { }

Party.init({
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Company,
            key: 'id',
        },
    },
    name: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    phone_no: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    party_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    account_no: {
        type: DataTypes.STRING,
        trim: true,
    },
    business_details: {
        type: DataTypes.JSON,
    },
    credit_info: {
        type: DataTypes.JSON,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category_name: {
        type: DataTypes.JSON,
    },
    photo: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.JSON,
    },
    state: {
        type: DataTypes.STRING,
        trim: true,
    },
    status: {
        type: DataTypes.STRING,
        trim: true,
    },
    custom_field: {
        type: DataTypes.JSON,
    },
    balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    }
}, {
    sequelize,
    modelName: 'Party',
    timestamps: true,
    indexes: [
        { fields: ['company_id'] },
        { unique: true, fields: ['company_id', 'phone_no'] },
        { fields: ['company_id', 'account_no'] },

    ],
});

export default Party;
