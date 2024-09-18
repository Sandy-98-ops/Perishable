import jwt from 'jsonwebtoken';
import EmployeeRoleService from '../services/employee/EmployeeRoleService.js';
import RoleService from '../services/master/RoleService.js';

const SECRET_KEY = 'your_secret_key';

// Generate JWT
export const generateToken = async (employee) => {
    try {
        // Fetch roles associated with the employee
        const employeeRoles = await EmployeeRoleService.findAll({ employee_id: employee.emp_id });

        const roleNames = [];

        // Iterate over employee roles to get role names
        for (const employeeRole of employeeRoles) {
            const role = await RoleService.findById(employeeRole.role_id);
            if (role) {
                roleNames.push(role.role_name); // Push role name into the array
            }
        }

        const token = jwt.sign(
            {
                id: employee.emp_id,
                email: employee.email,
                roles: roleNames // Include roles here as an array
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Failed to generate token');
    }
};

// Verify JWT
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid token');
    }
};