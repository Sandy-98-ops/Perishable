import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import Company from '../company/Company.js';
import BaseModel from '../base/BaseModel.js'; // Import your BaseModel

class LedgerMaster extends BaseModel { }

LedgerMaster.init({
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Assuming company_id is mandatory
        references: {
            model: Company,
            key: 'company_id',
        },
        onDelete: 'CASCADE', // Handle deletions if the company is removed
        onUpdate: 'CASCADE', // Handle updates if the company ID changes
    },
    ledger_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [4, Infinity], // Ensure ledger_name has at least 4 characters
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
        allowNull: true, // Optional field
    },
}, {
    sequelize,
    modelName: 'LedgerMaster',
    tableName: 'ledger_masters', // Use underscores for table name
    timestamps: true,
    underscored: true, // Ensure snake_case for column names
});

// Define associations
LedgerMaster.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

export default LedgerMaster;