import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../../config/db.js';

const SALT_ROUNDS = 10; // Number of salt rounds for hashing

const Company = sequelize.define('Company', {
    company_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING
    },
    phone_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gst_no: {
        type: DataTypes.STRING
    },
    pan_no: {
        type: DataTypes.STRING
    },
    industry_type: {
        type: DataTypes.STRING
    },
    business_type: {
        type: DataTypes.STRING
    },
    bank_account: {
        type: DataTypes.JSON
    },
    address: {
        type: DataTypes.JSON
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    language: {
        type: DataTypes.STRING
    },
    currency: {
        type: DataTypes.STRING
    },
    plan_id: {
        type: DataTypes.STRING
    },
    digital_sign: {
        type: DataTypes.STRING
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'Companies',
    timestamps: true,
    hooks: {
        beforeSave: async (company) => {
            if (company.changed('password')) {
                const hashedPassword = await bcrypt.hash(company.password, SALT_ROUNDS);
                company.password = hashedPassword;
            }
        }
    }
});

// Instance method to check password
Company.prototype.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default Company;
