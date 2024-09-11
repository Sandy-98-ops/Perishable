import express from 'express';
import UserRouter from '../routers/UserRouter.js';
import partyRouter from '../routers/PartyRouter.js';
import companyRouter from '../routers/CompanyRouter.js';
import LedgerRouter from '../routers/LedgerRouter.js';
import ledgerCategoryRouter from '../routers/LedgerCategoryRouter.js';
import ledgerMasterRouter from '../routers/LedgerMasterRouter.js';
import employeeAdvanceRouter from '../routers/EmployeeAdvanceRouter.js';
import employeeAttendanceRouter from '../routers/EmployeeAttendanceRouter.js';
import employeePayrollRouter from '../routers/EmployeePayrollRouter.js';
import employeeRouter from '../routers/EmployeeRouter.js';
import expenseCategoryRouter from '../routers/ExpenseCategoryRouter.js';
import expenseCollectionRouter from '../routers/ExpenseCollectionRouter.js';

const apiRouter = express.Router();

// Middleware to validate API calls
apiRouter.use((req, res, next) => {
    const validEndpoints = ['/user', '/party',
        '/company', '/ledger', '/ledgerCategory', '/ledgerMaster', '/employee', '/expenseCategory', '/expenseCollection',
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
apiRouter.use('/ledger', LedgerRouter);
apiRouter.use('/ledgerCategory', ledgerCategoryRouter);
apiRouter.use('/ledgerMaster', ledgerMasterRouter);
apiRouter.use('/employeeAdvance', employeeAdvanceRouter);
apiRouter.use('/employeeAttendance', employeeAttendanceRouter);
apiRouter.use('/employeePayroll', employeePayrollRouter);
apiRouter.use('/employee', employeeRouter);
apiRouter.use('/expenseCategory', expenseCategoryRouter);
apiRouter.use('/expenseCollection', expenseCollectionRouter);

export default apiRouter;
