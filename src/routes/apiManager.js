import express from 'express';
import authenticateJWT from '../middleware/authMiddleware.js'; // Adjust the path as needed
import authorizeRoles from '../middleware/authorizationMiddleware.js'; // Adjust the path as needed
import UserRouter from '../routers/user/UserRouter.js';
import partyRouter from '../routers/party/PartyRouter.js';
import companyRouter from '../routers/company/CompanyRouter.js';
import ledgerRouter from '../routers/ledger/LedgerRouter.js';
import ledgerCategoryRouter from '../routers/ledger/LedgerCategoryRouter.js';
import ledgerMasterRouter from '../routers/ledger/LedgerMasterRouter.js';
import employeeAdvanceRouter from '../routers/employee/EmployeeAdvanceRouter.js';
import employeeAttendanceRouter from '../routers/employee/EmployeeAttendanceRouter.js';
import employeePayrollRouter from '../routers/employee/EmployeePayrollRouter.js';
import employeeRouter from '../routers/employee/EmployeeRouter.js';
import expenseCategoryRouter from '../routers/expense/ExpenseCategoryRouter.js';
import expenseEntryRouter from '../routers/expense/ExpenseEntryRouter.js';
import expenseLedgerRouter from '../routers/ledger/ExpenseLedgerRouter.js';
import itemCategoryRouter from '../routers/master/ItemCategoryRouter.js';
import unitMasterRouter from '../routers/master/UnitMasterRouter.js';
import batchRouter from '../routers/transaction/BatchRouter.js';
import itemRouter from '../routers/transaction/ItemRouter.js';
import subUnitMasterRouter from '../routers/master/SubUnitMasterRouter.js';
import employeeRoleRouter from '../routers/employee/EmployeeRoleRouter.js';
import roleRouter from '../routers/master/RoleRouter.js';

const apiRouter = express.Router();

// Middleware to validate API calls
apiRouter.use((req, res, next) => {
    const validEndpoints = ['/user', '/party', '/company', '/ledger', '/ledgerCategory', '/ledgerMaster', '/employee', '/expenseCategory', '/expenseEntry',
        '/employeeAdvance', '/employeeAttendance', '/employeePayroll', '/expenseLedger', '/itemCategory', '/unitMaster',
        '/batch', '/item', '/subUnitMaster', '/employeeRole', '/role'
    ];

    // Check if the request path starts with one of the valid base paths
    const isValidEndpoint = validEndpoints.some(endpoint => req.path.startsWith(endpoint));

    if (isValidEndpoint) {
        next(); // If the endpoint is valid, proceed to the specific route
    } else {
        res.status(404).send('Not Found');
    }
});

// Use companyRouter without authentication
apiRouter.use('/company', companyRouter);
apiRouter.use('/role', roleRouter);
apiRouter.use('/employee', employeeRouter);

// Apply authentication middleware to all other routes
apiRouter.use(authenticateJWT);

// Use authorization middleware on specific routes
apiRouter.use('/user', authorizeRoles('admin'), UserRouter);
apiRouter.use('/party', authorizeRoles('admin', 'manager'), partyRouter);
apiRouter.use('/ledger', authorizeRoles('admin', 'accountant'), ledgerRouter);
apiRouter.use('/ledgerCategory', authorizeRoles('admin', 'accountant'), ledgerCategoryRouter);
apiRouter.use('/ledgerMaster', authorizeRoles('admin', 'accountant'), ledgerMasterRouter);
apiRouter.use('/employeeAdvance', authorizeRoles('admin', 'hr'), employeeAdvanceRouter);
apiRouter.use('/employeeAttendance', authorizeRoles('admin', 'hr'), employeeAttendanceRouter);
apiRouter.use('/employeePayroll', authorizeRoles('admin', 'hr'), employeePayrollRouter);
apiRouter.use('/employeeRole', authorizeRoles('admin'), employeeRoleRouter);
apiRouter.use('/expenseCategory', authorizeRoles('admin', 'accountant'), expenseCategoryRouter);
apiRouter.use('/expenseEntry', authorizeRoles('admin', 'accountant'), expenseEntryRouter);
apiRouter.use('/expenseLedger', authorizeRoles('admin', 'accountant'), expenseLedgerRouter);
apiRouter.use('/itemCategory', authorizeRoles('admin', 'manager'), itemCategoryRouter);
apiRouter.use('/unitMaster', authorizeRoles('admin', 'manager'), unitMasterRouter);
apiRouter.use('/subUnitMaster', authorizeRoles('admin', 'manager'), subUnitMasterRouter);
apiRouter.use('/batch', authorizeRoles('admin', 'manager'), batchRouter);
apiRouter.use('/item', authorizeRoles('admin', 'manager'), itemRouter);
export default apiRouter;
