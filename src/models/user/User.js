import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import BaseModel from '../base/BaseModel.js'; // Ensure BaseModel is imported if you have it

class User extends BaseModel { }

User.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false, // Required field
    },
    email: {
        type: DataTypes.STRING,
        unique: true, // Ensure email is unique
        allowNull: true, // Optional field
        validate: {
            isEmail: true, // Validate the format of the email
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, // Required field
    },
    phone_no: { // Use snake_case for consistency
        type: DataTypes.BIGINT, // Use BIGINT for phone numbers to handle large values
        allowNull: false, // Required field
        validate: {
            isNumeric: true, // Ensure only numeric values are allowed
            len: [10, 15], // Validate length if needed (example: length between 10 and 15 digits)
        },
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user', // Default role
    },
    // Add other fields as needed
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users', // Use plural and underscore for table name
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
    underscored: true, // Use snake_case for column names
});

export default User;