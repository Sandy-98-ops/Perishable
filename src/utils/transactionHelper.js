import sequelize from "../config/db.js";

/**
 * Executes a function within a Sequelize transaction.
 *
 * @param {Function} operation - The function that performs database operations.
 * @returns {Promise<any>} - The result of the operation function.
 */
export const withTransaction = async (operation) => {
    const transaction = await sequelize.transaction(); // Start a new transaction
    try {
        const result = await operation(transaction); // Execute the operation function
        await transaction.commit(); // Commit the transaction if successful
        return result; // Return the result of the operation
    } catch (error) {
        await transaction.rollback(); // Rollback the transaction in case of error
        throw error; // Re-throw the error to be handled by the caller
    }
};
