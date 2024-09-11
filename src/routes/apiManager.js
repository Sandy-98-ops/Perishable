import express from 'express';
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


const apiRouter = express.Router();

// Middleware to validate API calls
apiRouter.use((req, res, next) => {
    const validEndpoints = ['/user', '/party',
        '/company', '/ledger', '/ledgerCategory', '/ledgerMaster', '/employee', '/expenseCategory', '/expenseEntry',
        '/employeeAdvance', '/employeeAttendance', '/employeePayroll',
    ];

    // Check if the request path starts with one of the valid base paths
    const isValidEndpoint = validEndpoints.some(endpoint => req.path.startsWith(endpoint));

    if (isValidEndpoint) {
        next(); // If the endpoint is valid, proceed to the specific route
    } else {
        res.status(404).send('Not Found');
    }
});

// Use UserRouter for /api/user routes

apiRouter.use('/user', UserRouter);
apiRouter.use('/party', partyRouter);
apiRouter.use('/company', companyRouter);
apiRouter.use('/ledger', ledgerRouter);
apiRouter.use('/ledgerCategory', ledgerCategoryRouter);
apiRouter.use('/ledgerMaster', ledgerMasterRouter);
apiRouter.use('/employeeAdvance', employeeAdvanceRouter);
apiRouter.use('/employeeAttendance', employeeAttendanceRouter);
apiRouter.use('/employeePayroll', employeePayrollRouter);
apiRouter.use('/employee', employeeRouter);
apiRouter.use('/expenseCategory', expenseCategoryRouter);
apiRouter.use('/expenseEntry', expenseEntryRouter);

export default apiRouter;
