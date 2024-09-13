import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Company from "../company/Company.js";

const ItemCategory = sequelize.define('ItemCategory', {
    item_category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    company_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'company_id'
        }
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    tableName: "item_category",
    indexes: [{
        unique: true,
        fields: ['company_id', 'category_name']
    }],
    timestamps: true
});

export default ItemCategory;