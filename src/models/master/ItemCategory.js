import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import Company from '../company/Company.js';
import BaseModel from '../base/BaseModel.js'; // Import your BaseModel

class ItemCategory extends BaseModel { }

ItemCategory.init({
    item_category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Company,
            key: 'company_id',
        },
        onDelete: 'CASCADE', // Handle deletions if the company is removed
        onUpdate: 'CASCADE', // Handle updates if the company ID changes
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'ItemCategory',
    tableName: 'item_category', // Use plural and underscores for table name
    indexes: [{
        unique: true,
        fields: ['company_id', 'category_name'], // Unique constraint for the combination of company and category_name
    }],
    timestamps: true,
    underscored: true, // Ensure snake_case for column names
});

// Define associations
ItemCategory.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

export default ItemCategory;