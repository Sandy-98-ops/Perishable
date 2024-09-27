import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';    //Import it properly
import BaseModel from '../base/BaseModel.js';
import Company from '../company/Company.js';
import Party from '../party/Party.js';
import LedgerMaster from './LedgerMaster.js';
import PAYMENT_MODES from '../../constants/paymentModes.js';

class Ledger extends BaseModel { }

Ledger.init({
    //Other Fields

    company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Company, // Name of the table for Company model
            key: 'company_id',
        },
    },
    party_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Party, // Name of the table for Company model
            key: 'party_id',
        },
    },
    ledger_master: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: LedgerMaster,
            key: 'id',
        },
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.JSON, // Use JSON to handle multiple language entries
        allowNull: false,
    },
    transaction_id: {
        type: DataTypes.STRING,
        trim: true,
    },
    payment_mode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [PAYMENT_MODES],
        },
    },
    credit: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    debit: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
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
    tableName: 'ledgers', // Ensure this matches your actual table name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default Ledger;