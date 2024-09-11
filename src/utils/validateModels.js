import { ValidationError } from './errors.js';

// Helper function to convert camelCase to readable format
const convertCamelCaseToReadable = (camelCaseString) => {
    return camelCaseString
        .replace(/([a-z])([A-Z])/g, '$1 $2')  // Insert space between camelCase words
        .replace(/^./, str => str.toUpperCase());  // Capitalize the first letter
};

// Function to generate user-friendly labels for fields
export const generateFieldLabel = (path) => {
    let readablePath = convertCamelCaseToReadable(path);
    readablePath = readablePath.replace(/\./g, ' ');
    return readablePath;
};

// Validation functions for specific fields

export const validatePhoneNumber = (phoneNumber) => {
    phoneNumber = phoneNumber.toString();
    const phoneRegex = /^[6789]\d{9}$/; // Indian phone number format
    if (!phoneRegex.test(phoneNumber)) {
        throw new ValidationError('Invalid phone number format. Indian phone numbers should be exactly 10 digits long and start with 6, 7, 8, or 9.');
    }
};

export const validateEmail = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // Basic email format
    if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email format.');
    }
    // Check for unique email if needed
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new ValidationError('Email already exists.');
    }
};

export const validatePassword = (password) => {
    const validPasswordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/; // At least 8 chars, 1 uppercase, 1 special character
    if (!validPasswordRegex.test(password)) {
        throw new ValidationError('Password must be at least 8 characters long, include at least one uppercase letter, and one special character.');
    }
};

export const validatePostalCode = (postalCode) => {
    const postalCodeRegex = /^\d{6}$/; // Indian postal code format
    if (!postalCodeRegex.test(postalCode)) {
        throw new ValidationError('Invalid postal code format. Indian postal codes should be exactly 6 digits long.');
    }
};

export const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s-]+$/; // Validates names containing only letters, spaces, and hyphens
    if (!nameRegex.test(name)) {
        throw new ValidationError('Invalid name format. Names should only contain letters, spaces, and hyphens.');
    }
};
