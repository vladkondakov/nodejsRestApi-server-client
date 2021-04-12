import { getItemFromLocalStorage, formUrl, addQueryParamsToURL } from '../helpers/index.js'
import { constants } from '../config/constants.js'

const BASE_EMPLOYEES_URL = `${constants.BASE_URL}/employees` 

const getEmployeesData = async (queryParams) => {
  const urlPath = formUrl(BASE_EMPLOYEES_URL)
  const urlToGetEmployees = addQueryParamsToURL(urlPath, queryParams)

  const response = await fetch(urlToGetEmployees)
  const employeesData = await response.json()

  return employeesData
}

const getEmployeeData = async () => {
  const { accessToken, username } = getItemFromLocalStorage('currentUser')
  const urlToGetEmployees =  formUrl(BASE_EMPLOYEES_URL, username)

  const response = await fetch(urlToGetEmployees, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    }
  })

  const employeeData = await response.json()

  return employeeData.embeddedItems
}

const editEmployeeData = async (reqData) => {
  const { accessToken, username } = getItemFromLocalStorage('currentUser')
  const urlToEditEmployee = formUrl(BASE_EMPLOYEES_URL, username)

  const response = await fetch(urlToEditEmployee, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqData)
  })
}

$("#edit-employee").on('click', async () => {
  const $name = $("#inputEditName").val()
  const $surname = $("#inputEditSurname").val()
  const $dateOfBirth = $("#inputEditDateOfBirth").val()
  const $salary = $("#inputEditSalary").val()
  const $position = $("#inputEditPosition").val()

  const valuesFromEditModal = {
    name: $name,
    surname: $surname,
    dateOfBirth: $dateOfBirth,
    salary: $salary,
    position: $position
  }

  await editEmployeeData(valuesFromEditModal)
})

export { getEmployeesData, getEmployeeData}