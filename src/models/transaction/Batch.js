import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import Item from './Item.js';
import BaseModel from '../base/BaseModel.js'; // Import your BaseModel

class Batch extends BaseModel { }

Batch.init({
    batch_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    item_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Item,
            key: 'item_id',
        },
        allowNull: false, // Ensure this foreign key is not nullable if appropriate
    },
    batch_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    creation_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    initial_stock: {
        type: DataTypes.DECIMAL,
        defaultValue: 0.0,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Batch',
    tableName: 'batches', // Use plural and underscore for table name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default Batch;