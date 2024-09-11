import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js';

class Counter extends Model { }

Counter.init({
    company_id: {
        type: DataTypes.INTEGER, // Adjust type based on your actual ID type (INTEGER, BIGINT, etc.)
        allowNull: true,
    },
    sequence_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sequence_value: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    prefix: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    suffix: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    financial_year: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Counter',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['company_id', 'sequence_type']
        }
    ]
});

export default Counter;
