import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

class BaseModel extends Model { }

BaseModel.init({
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'BaseModel',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default BaseModel;