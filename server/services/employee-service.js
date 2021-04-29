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

        if (!employee) {
          return null
        }
        
        employee.password = existingEmployee.password;
        const updatedElement = await LowDBOperations.updateElement('employees', { username: employee.username }, employee)
        
        return updatedElement 
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

    // calculate previous according to employees length
    static async getPageEmployees(employees, offset, limit) {
        const getActualOffset = () => {
          let actualOffset = Math.floor(employees.length / limit);
          if (employees.length % limit > 0) {
            actualOffset += 1;
          }

          return actualOffset >= offset ? offset : actualOffset
        }

        const currentOffset = getActualOffset();

        const results = {};
        const startIndex = (currentOffset - 1) * limit;
        const endIndex = startIndex + limit;

        if (startIndex > 0) {
            results.previous = {
                offset: currentOffset - 1,
                limit
            };
        }
        if (endIndex < employees.length) {
            results.next = {
                offset: currentOffset + 1,
                limit
            };
        }

        results.pageEmployees = employees.slice(startIndex, endIndex);
        results.currentOffset = currentOffset;
        console.log(offset, currentOffset)
        return results;
    }
}

module.exports = Employee;