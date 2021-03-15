const LowDBOperations = require('../database/lowdb-service');
const { employeeMapper } = require('../helpers/employee-helper');

class Employee {
    static async getEmployee(username) {
        const employee = await LowDBOperations.getElement('employees', { username });
        if (!employee) {
            return null;
        }
        return employeeMapper(employee);
    }

    static async updateEmployee(employee) {
        const existingEmployee = await LowDBOperations.getElement('employees', { username: employee.username });
        employee.password = existingEmployee.password;
        await LowDBOperations.updateElement('employees', { username: employee.username }, employee)
    }

    static async deleteEmployee(username) {
        await LowDBOperations.deleteElement('employees', { username });
    }

    static async getAllEmployees() {
        const employees = [...await LowDBOperations.getAllElements('employees')];
        const results = employees.map(employee => employeeMapper(employee));

        return results;
    }

    static async getFilteredEmployees(name, surname) {
        const employees = await this.getAllEmployees();
        if (!name && !surname) {
            return employees;
        }

        const regName = new RegExp(name, 'i');
        const regSurname = new RegExp(surname, 'i');
        const filteredEmployees = employees.filter(employee => {
            const isNameMatch = regName.test(employee.name);
            const isSurnameMatch = regSurname.test(employee.surname);
            return (isNameMatch && isSurnameMatch);
        });

        return filteredEmployees;
    }

    static async getSortedEmployees(employees, order) {
        const ascFunction = (a, b) => +a.salary - +b.salary;
        const descFunction = (a, b) => +b.salary - +a.salary;

        if (order) {
            const compareFunction = (order === 'desc' ? descFunction : ascFunction);
            return employees.sort(compareFunction);
        }

        return employees;
    }

    static async getPageEmployees(employees, offset, limit) {
        const results = {};
        const startIndex = (offset - 1) * limit;
        const endIndex = startIndex + limit;

        if (startIndex > 0) {
            results.previous = {
                offset: offset - 1,
                limit
            };
        }
        if (endIndex < employees.length) {
            results.next = {
                offset: offset + 1,
                limit
            };
        }

        results.pageEmployees = employees.slice(startIndex, endIndex);
        return results;
    }
}

module.exports = Employee;