import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
import Company from '../models/company/Company.js';

class Counter extends Model { }

Counter.init({
    counter_id: {
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
