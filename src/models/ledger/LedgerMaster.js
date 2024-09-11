import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
import LedgerCategory from './LedgerCategories.js';
import Company from '../company/Company.js';
// Define the LedgerMaster model
class LedgerMaster extends Model { }

LedgerMaster.init({
    ledgerCategory: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: LedgerCategory, // This should match the name of the LedgerCategories model
            key: 'id',
        },
    },
    company: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Company, // This should match the name of the Company model
            key: 'id',
        },
    },
    ledgerName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [4, Infinity], // Ensure ledgerName has at least 4 characters
        },
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [5, Infinity], // Ensure code has at least 5 characters
        },
    },
    status: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: 'Ledger_Master',
    timestamps: true, // or true if you want createdAt and updatedAt fields
});

// Define associations

LedgerMaster.belongsTo(LedgerCategory, { foreignKey: 'ledgerCategory' });
LedgerMaster.belongsTo(Company, { foreignKey: 'company' });

export default LedgerMaster;
