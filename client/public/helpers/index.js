import { constants } from '../config/constants.js'

const getEmployeesWithSetNumber = (employees, compiledRow, offset) => {
  const { LIMIT } = constants

  const employeesToReturn = employees.map((employee, index) => {
    const number = (offset - 1) * LIMIT + index + 1
    employee.number = number
    return compiledRow(employee)
  })

  return employeesToReturn
}

const getItemFromLocalStorage = (itemName) => {
  try {
    const item = JSON.parse(localStorage.getItem(itemName))
    return item
  } catch (e) {
    console.error(e)
  }
}

const formUrl = (...urlParts) => {
  let url = ''
  
  for (let i = 0; i < urlParts.length; i++) {
    url += `${urlParts[i]}/`
  }

  const urlPath = new URL(url)
  return urlPath
}

const addQueryParamsToURL = (url, queryParams) => {
  for (const [key, value] of Object.entries(queryParams)) {
    url.searchParams.append(`${key}`, `${value}`)
  }

  return url
}

export { 
  getEmployeesWithSetNumber, 
  getItemFromLocalStorage, 
  formUrl, 
  addQueryParamsToURL
}