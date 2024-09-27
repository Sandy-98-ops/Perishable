import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import ExpenseCategory from '../expense/ExpenseCategories.js';
import ExpenseEntry from '../expense/ExpenseEntry.js';
import Company from '../company/Company.js';
import PAYMENT_MODES from '../../constants/paymentModes.js';
import BaseModel from '../base/BaseModel.js';

class ExpenseLedger extends BaseModel { }

ExpenseLedger.init({
    company_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'company_id',
        },
        allowNull: false,
    },
    expense_id: {
        type: DataTypes.INTEGER,
        references: {
            model: ExpenseEntry,
            key: 'id',
        },
        allowNull: false,
    },
    expense_category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: ExpenseCategory,
            key: 'expense_category_id',
        },
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    transaction_id: {
        type: DataTypes.STRING,
        trim: true,
        allowNull: true, // Set to true if optional
    },
    payment_mode: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [PAYMENT_MODES], // Ensures only valid payment modes are accepted
        },
    },
    credit: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
    debit: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
    balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Expense_Ledger',
    tableName: 'Expense_Ledgers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

// Define associations
ExpenseLedger.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
ExpenseLedger.belongsTo(ExpenseEntry, { foreignKey: 'expense_id', as: 'expense_entry' });
ExpenseLedger.belongsTo(ExpenseCategory, { foreignKey: 'expense_category_id', as: 'expense_category' });

export default ExpenseLedger;