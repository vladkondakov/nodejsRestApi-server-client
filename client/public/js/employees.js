import { getItemFromLocalStorage, formUrl, addQueryParamsToURL } from '../helpers/index.js';
import { constants } from '../config/constants.js';
import { getParamsToGetEmployees } from '../helpers/jquery-helpers.js';

const BASE_EMPLOYEES_URL = `${constants.BASE_URL}/employees`;

const getEmployeesData = async (queryParams) => {
  const urlPath = formUrl(BASE_EMPLOYEES_URL);
  const urlToGetEmployees = addQueryParamsToURL(urlPath, queryParams);

  const response = await fetch(urlToGetEmployees);

  if (!response.ok) {
    const err = new Error(`${response.status}: ${response.statusText}`);
    throw err;
  }

  const employeesData = await response.json();

  return employeesData;
};

const getEmployeeData = async () => {
  const { accessToken, username } = getItemFromLocalStorage('currentUser');
  const urlToGetEmployees = formUrl(BASE_EMPLOYEES_URL, username);

  const response = await fetch(urlToGetEmployees, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const err = new Error(`${response.status}: ${response.statusText}`);
    throw err;
  }

  const employeeData = await response.json();

  return employeeData?.embeddedItems;
};

const editEmployeeData = async (reqData) => {
  const { accessToken, username } = getItemFromLocalStorage('currentUser');
  const urlToEditEmployee = formUrl(BASE_EMPLOYEES_URL, username);

  const response = await fetch(urlToEditEmployee, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqData),
  });

  console.log(response);

  if (!response.ok) {
    const err = new Error(`${response.status}: ${response.statusText}`);
    throw err;
  }

  const updatedEmployee = await response.json();

  if (updatedEmployee) {
    return updatedEmployee.embeddedItems;
  }

  return null;
};

//
const getPaginatedSortedFilteredEmployees = async () => {
  const queryParams = getParamsToGetEmployees();

  try {
    const employees = await getEmployeesData(queryParams);
    return employees;
  } catch (e) {
    console.log(e);
    return { pageEmployees: null };
  }
};

export { getEmployeesData, getEmployeeData, editEmployeeData, getPaginatedSortedFilteredEmployees };
