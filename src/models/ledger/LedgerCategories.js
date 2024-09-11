import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
import Company from '../company/Company.js';
// Define the LedgerCategory model
class LedgerCategory extends Model { }

LedgerCategory.init({
    company: {
        type: DataTypes.INTEGER,
        references: {
            model: Company, // Ensure this matches the name of your Company model
            key: 'id',
        },
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'company_categoryName_unique', // Unique constraint for the combination of company and categoryName
        validate: {
            len: [5, Infinity], // Ensure categoryName has at least 5 characters
        },
    },
    description: {
        type: DataTypes.STRING,
    },
    referance_id: {
        type: DataTypes.INTEGER,
        references: {
            model: LedgerCategory, // Ensure this matches the name of the LedgerCategories model
            key: 'id',
        },
    },
    status: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: 'Ledger_Category',
    timestamps: true, // Set to true if you want createdAt and updatedAt fields
});

LedgerCategory.belongsTo(Company, { foreignKey: 'company' });
LedgerCategory.belongsTo(LedgerCategory, { as: 'Referance', foreignKey: 'referanceId' });

export default LedgerCategory;
