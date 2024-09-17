import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import Company from '../company/Company.js';
import PAYMENT_MODES from '../../constants/paymentModes.js';
import BaseModel from '../base/BaseModel.js';

class CashLedger extends BaseModel { }

CashLedger.init({
    company_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'company_id',
        },
        allowNull: true, // Set to true if optional
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING, // Changed to STRING for simplicity unless JSON is needed
        allowNull: false,
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true,
    },
    reference_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    payment_mode: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [PAYMENT_MODES], // Ensures only valid payment modes are accepted
        },
    },
    credit: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
    debit: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
    balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
}, {
    sequelize,
    modelName: 'Cash_Ledger',
    tableName: 'Cash_Ledger',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

// Define associations
CashLedger.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// Define any instance methods if necessary
// Example: Method to get formatted transaction details
CashLedger.prototype.getFormattedTransaction = function () {
    return `Transaction ID: ${this.transaction_id}, Date: ${this.date.toISOString().split('T')[0]}`;
};

export default CashLedger;