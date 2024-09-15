// src/models/Company.js
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import BaseModel from '../../base/BaseModel.js';
import sequelize from '../../config/db.js';

const SALT_ROUNDS = 10; // Number of salt rounds for hashing

class Company extends BaseModel { }

Company.init({
    company_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gst_no: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pan_no: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    industry_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    business_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bank_account: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    address: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    language: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    plan_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    digital_sign: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'company', // Ensure this matches your actual table name
    hooks: {
        beforeSave: async (company) => {
            if (company.changed('password')) {
                const hashedPassword = await bcrypt.hash(company.password, SALT_ROUNDS);
                company.password = hashedPassword;
            }
        },
    },
});

// Instance method to check password
Company.prototype.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default Company;