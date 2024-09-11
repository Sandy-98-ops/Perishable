// sync.js
import sequelize from './src/config/db.js';

import Counter from './src/models/utils/Counter.js';
import User from './src/models/user/User.js';
import Employee from './src/models/employee/Employee.js';

import EmployeeAdvance from './src/models/employee/EmployeeAdvance.js';
import EmployeeAttendance from './src/models/employee/EmployeeAttendance.js';
import EmployeePayroll from './src/models/employee/EmployeePayroll.js';
import ExpenseCategory from './src/models/expense/ExpenseCategories.js';
import ExpenseCollection from './src/models/expense/ExpenseEntry.js';
import Ledger from './src/models/ledger/Ledger.js';
import LedgerCategory from './src/models/ledger/LedgerCategories.js';
import LedgerMaster from './src/models/ledger/LedgerMaster.js';
import Party from './src/models/party/Party.js';
import BankLedger from './src/models/ledger/BankLedger.js';
import CashLedger from './src/models/ledger/CashLedger.js';
import ExpenseLedger from './src/models/ledger/ExpenseLedger.js';
import AdvanceLedger from './src/models/ledger/AdvanceLedger.js';
import SalaryLedger from './src/models/ledger/SalaryLedger.js';

(async () => {
    try {
        // Sync all defined models to the DB
        await sequelize.sync({ alter: true }); // Use { force: true } with caution
        console.log('Database & tables created or updated!');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
})();
