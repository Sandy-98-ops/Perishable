import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';
import Company from '../company/Company.js';

class ExpenseCategory extends Model { }

ExpenseCategory.init({
    company_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Company, // Name of the table for Company model
            key: 'id',
        },
        allowNull: true,
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    maxAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Expense_Category',
    timestamps: true,
    indexes: [
        {
            fields: ['company_id'],
        },
        {
            fields: ['company_id', 'category_name'],
            unique: true // Add uniqueness constraint to this index
        }
    ]
});

export default ExpenseCategory;
