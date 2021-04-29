const router = require('express').Router();
const { checkAuth, compareIdAndUser } = require('../middlewares/check-request');
const EmployeeController = require('../controllers/employees-controller');
const { employeeValidation } = require('../middlewares/validations');

// /employees
router.route('/')
    .get(EmployeeController.getPageEmployees)

// /employees/:id
router.route('/:id')
    .get(checkAuth, EmployeeController.getEmployee)
    .post(checkAuth, employeeValidation, EmployeeController.updateEmployee)
    .delete(checkAuth, EmployeeController.deleteEmployee)

module.exports = router;