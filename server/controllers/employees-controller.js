const config = require('config');
const LowDBOperations = require('../database/lowdb-service');
const Employee = require('../services/employee-service');
const ApiError = require('../error/apierror');

const getPageEmployees = async (req, res, next) => {
    const queryOffset = req.query.offset;
    const queryLimit = req.query.limit;
    const offset = (+queryOffset && +queryOffset > 0) ? +queryOffset : config.get('OFFSET');
    const limit = (+queryLimit && +queryLimit > 0) ? +queryLimit : config.get('LIMIT');
    const { name, surname, order } = req.query;

    const filteredEmployees = await Employee.getFilteredEmployees(name, surname);
    const sortedEmployees = await Employee.getSortedEmployees(filteredEmployees, order);
    const pageEmployees = await Employee.getPageEmployees(sortedEmployees, offset, limit);
    
    return res.json(pageEmployees);
}

const getEmployee = async (req, res, next) => {
    const id = req.params.id;
    const employee = await Employee.getEmployee(id);

    return res.json({ embeddedItems: employee });
}

const getAllEmployees = async (req, res, next) => {
    const employees = await Employee.getAllEmployees();
    return res.json({ embeddedItems: employees })
}

const updateEmployee = async (req, res, next) => {
    const employee = req.body;
    
    // Update the user according to url id
    // const username = req.currentUser.username;
    // employee.username = username;

    employee.username = req.params.id
    const updatedEmployee = await Employee.updateEmployee(employee);

    return res.status(200).json({ embeddedItems: updatedEmployee });
}

const deleteEmployee = async (req, res, next) => {
    const id = req.params.id

    if (!id) {
      const err = ApiError.badRequest(`Wrong query param value: ${id}`);
      return next(err);
    }

    await Employee.deleteEmployee(id);
    await LowDBOperations.deleteElement('users', { username: id });

    return res.sendStatus(204);
}

module.exports = {
    getPageEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee
}