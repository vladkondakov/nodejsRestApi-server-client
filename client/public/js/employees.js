import { getItemFromLocalStorage, formUrl, addQueryParamsToURL } from '../helpers/index.js';
import { constants } from '../config/constants.js';
import { getParamsToGetEmployees, disableViewProfile } from '../helpers/jquery-helpers.js';

const BASE_EMPLOYEES_URL = `${constants.BASE_URL}/employees`;

const getEmployeesData = async (queryParams) => {
  const urlPath = formUrl(BASE_EMPLOYEES_URL);
  const urlToGetEmployees = addQueryParamsToURL(urlPath, queryParams);

  const response = await fetch(urlToGetEmployees);
  const employeesData = await response.json();

  return employeesData;
};

const getEmployeeData = async () => {
  const { accessToken, username } = getItemFromLocalStorage('currentUser');
  const urlToGetEmployees = formUrl(BASE_EMPLOYEES_URL, username);

  try {
    const response = await fetch(urlToGetEmployees, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const employeeData = await response.json();

    return employeeData.embeddedItems;
  } catch (e) {
    disableViewProfile();
    return { employeeData: null };
  }
};

const editEmployeeData = async (reqData) => {
  const { accessToken, username } = getItemFromLocalStorage('currentUser');
  const urlToEditEmployee = formUrl(BASE_EMPLOYEES_URL, username);

  let updatedEmployee;

  try {
    const response = await fetch(urlToEditEmployee, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqData),
    });

    updatedEmployee = await response.json();
  } catch (e) {
    console.log('%s%v', 'color: red;', e);
  }

  if (updatedEmployee) {
    return updatedEmployee.embeddedItems;
  }

  return null;
};

const getPaginatedSortedFilteredEmployees = async () => {
  const queryParams = getParamsToGetEmployees();
  const employees = await getEmployeesData(queryParams);

  return employees;
};

export { getEmployeesData, getEmployeeData, editEmployeeData, getPaginatedSortedFilteredEmployees };
