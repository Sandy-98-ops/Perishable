import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/db.js'; // Adjust the path to your sequelize instance

class User extends Model { }

User.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false, // Required field
    },
    email: {
        type: DataTypes.STRING,
        unique: true, // Ensure email is unique
        allowNull: true, // Optional field
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, // Required field
    },
    phoneNo: {
        type: DataTypes.BIGINT, // Use BIGINT for phone numbers to handle large values
        allowNull: false, // Required field
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user', // Default role
    },
    // Add other fields as needed
}, {
    sequelize,
    modelName: 'User',
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
});

export default User;
