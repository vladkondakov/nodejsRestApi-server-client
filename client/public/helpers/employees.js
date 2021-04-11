 import { constants } from '../config/constants.js'
 
 // put it to mappers
 const getEmployeesWithSetNumber = (employees, compiledRow, offset) => {
  const { LIMIT } = constants

  const employeesToReturn = employees.map((employee, index) => {
    const number = (offset - 1) * LIMIT + index + 1
    employee.number = number
    return compiledRow(employee)
  })

  return employeesToReturn
}

export { getEmployeesWithSetNumber }