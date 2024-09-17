import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import Company from '../company/Company.js';
import LedgerMaster from './LedgerMaster.js';
import BaseModel from '../base/BaseModel.js'; // Import your BaseModel

class LedgerCategory extends BaseModel { }

LedgerCategory.init({
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Assuming company_id is mandatory
        references: {
            model: Company,
            key: 'company_id',
        },
        onDelete: 'CASCADE', // Handle deletions if company is removed
        onUpdate: 'CASCADE', // Handle updates if company ID changes
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'company_category_name_unique', // Unique constraint for the combination of company and category_name
        validate: {
            len: [5, Infinity], // Ensure category_name has at least 5 characters
        },
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field
    },
    reference_id: { // Corrected typo from referance_id to reference_id
        type: DataTypes.INTEGER,
        allowNull: true, // Optional field
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field
    },
    ledger_master_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Optional field
        references: {
            model: LedgerMaster,
            key: 'id',
        },
        onDelete: 'SET NULL', // Handle deletions if LedgerMaster is removed
        onUpdate: 'CASCADE', // Handle updates if LedgerMaster ID changes
    },
}, {
    sequelize,
    modelName: 'LedgerCategory',
    tableName: 'ledger_categories', // Use underscores for table name
    timestamps: true,
    underscored: true, // Ensure snake_case for column names
});

// Define associations
LedgerCategory.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
LedgerCategory.belongsTo(LedgerMaster, { foreignKey: 'ledger_master_id', as: 'ledger_master' });

export default LedgerCategory;