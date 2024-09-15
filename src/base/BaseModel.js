// src/models/BaseModel.js
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class BaseModel extends Model { }

BaseModel.init({
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'BaseModel',
    timestamps: true,
});

export default BaseModel;