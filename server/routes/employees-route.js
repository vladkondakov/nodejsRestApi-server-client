const router = require('express').Router();
const { checkAuth, compareIdAndUser } = require('../middlewares/check-request');
const EmployeeController = require('../controllers/employees-controller');
const { employeeValidation } = require('../middlewares/validations');

// /employees
router.route('/')
    .get(EmployeeController.getPageEmployees)

// /employees/:id
router.route('/:id')
    .get(checkAuth, compareIdAndUser, EmployeeController.getEmployee)
    .post(checkAuth, compareIdAndUser, employeeValidation, EmployeeController.updateEmployee)
    .delete(checkAuth, compareIdAndUser, EmployeeController.deleteEmployee)

module.exports = router;