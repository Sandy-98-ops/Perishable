import { DataTypes } from "sequelize";
import BaseModel from "../base/BaseModel.js";
import Company from "../company/Company.js";
import Item from "../transaction/Item.js";
import Batch from "../transaction/Batch.js";
import sequelize from "../../config/db.js";

class ItemLedger extends BaseModel { }

ItemLedger.init({
    item_ledger_id: {
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
        },
        allowNull: false
    },
    item_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Item,
            key: 'item_id'
        },
        allowNull: true
    },
    batch_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Batch,
            key: 'batch_id'
        },
        allowNull: true
    },
    transaction_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.DECIMAL,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'ItemLedger',
    tableName: 'item_ledger', // Use plural and underscore for table name
    timestamps: true, // Ensure timestamps are enabled
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default ItemLedger;