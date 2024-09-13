import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import Company from '../company/Company.js';
import LedgerMaster from './LedgerMaster.js'; // Ensure path is correct

// Define the LedgerCategory model
const LedgerCategory = sequelize.define('LedgerCategory', {
    company_id: {  // Use underscores for column names
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'company_id',
        },
    },
    category_name: {  // Use underscores for column names
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'company_category_name_unique', // Unique constraint for the combination of company and category_name
        validate: {
            len: [5, Infinity],  // Ensure category_name has at least 5 characters
        },
    },
    description: {
        type: DataTypes.STRING,
    },
    referance_id: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.STRING,
    },
    ledger_master_id: {  // Foreign key pointing to LedgerMaster
        type: DataTypes.INTEGER,
        references: {
            model: LedgerMaster,
            key: 'id',
        },
    },
}, {
    sequelize,
    tableName: 'ledger_categories',  // Use underscores for table name
    timestamps: true,
});

export default LedgerCategory;