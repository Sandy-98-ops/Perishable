// sync.js
import sequelize from './src/config/db.js';

import Counter from './src/utils/Counter.js';
import User from './src/models/user/User.js';
import Employee from './src/models/employee/Employee.js';

import EmployeeAdvance from './src/models/employee/EmployeeAdvance.js';
import EmployeeAttendance from './src/models/employee/EmployeeAttendance.js';
import EmployeePayroll from './src/models/employee/EmployeePayroll.js';
import ExpenseCategory from './src/models/expense/ExpenseCategories.js';
import Ledger from './src/models/ledger/Ledger.js';
import LedgerCategory from './src/models/ledger/LedgerCategories.js';
import LedgerMaster from './src/models/ledger/LedgerMaster.js';
import Party from './src/models/party/Party.js';
import BankLedger from './src/models/ledger/BankLedger.js';
import CashLedger from './src/models/ledger/CashLedger.js';
import ExpenseLedger from './src/models/ledger/ExpenseLedger.js';
import AdvanceLedger from './src/models/ledger/AdvanceLedger.js';
import SalaryLedger from './src/models/ledger/SalaryLedger.js';
import ItemCategory from './src/models/master/ItemCategory.js';
import UnitMaster from './src/models/master/UnitMaster.js';
import SubUnitMaster from './src/models/master/SubUnitMaster.js';
import Batch from './src/models/transaction/Batch.js';
import Item from './src/models/transaction/Item.js';

import Company from './src/models/company/Company.js';
import EmployeeLedger from './src/models/ledger/EmployeeLedger.js';
import ExpenseEntry from './src/models/expense/ExpenseEntry.js';
import ItemLedger from './src/models/ledger/ItemLedger.js';
import Role from './src/models/master/Role.js';
import EmployeeRoles from './src/models/employee/EmployeeRoles.js';

(async () => {
    try {
        // Sync all defined models to the DB
        await sequelize.sync({ alter: true }); // Use { force: true } with caution
        console.log('Database & tables created or updated!');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
})();