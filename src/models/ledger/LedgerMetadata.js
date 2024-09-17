import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
import Ledger from './Ledger.js';
import BaseModel from '../base/BaseModel.js';

class LedgerMetaData extends BaseModel { }

LedgerMetaData.init({
    invoiceNo: {
        type: DataTypes.STRING,
        trim: true,
    },
    receiptNo: {
        type: DataTypes.STRING,
        trim: true,
    },
    purchaseNo: {
        type: DataTypes.STRING,
        trim: true,
    },
    paymentNo: {
        type: DataTypes.STRING,
        trim: true,
    },
    creditNote: {
        type: DataTypes.STRING,
        trim: true,
    },
    debitNote: {
        type: DataTypes.STRING,
        trim: true,
    },
    saleReturn: {
        type: DataTypes.STRING,
        trim: true,
    },
    ledgerDataId: {
        type: DataTypes.INTEGER,
        references: {
            model: Ledger,
            key: 'id',
        },
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Ledger_MetaData',
    timestamps: true,
});

export default LedgerMetaData;