import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import Company from '../company/Company.js';

// Define the LedgerMaster model
const LedgerMaster = sequelize.define('LedgerMaster', {
    ledger_name: {  // Use underscores for column names
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [4, Infinity],  // Ensure ledger_name has at least 4 characters
        },
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [5, Infinity],  // Ensure code has at least 5 characters
        },
    },
    status: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    tableName: 'ledger_masters',  // Use underscores for table name
    timestamps: true,
});

// Define associations
LedgerMaster.belongsTo(Company, { foreignKey: 'company_id' });

export default LedgerMaster;