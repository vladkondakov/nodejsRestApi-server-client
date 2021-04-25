import { constants } from '../config/constants.js';

const getEmployeesWithSetNumber = (employees, compiledRow, offset) => {
  const { LIMIT } = constants;

  const addNumToEmployee = (employee, number) => {
    const numberedEmployee = employee;
    numberedEmployee.number = number;
    return numberedEmployee;
  };

  const employeesToReturn = employees.map((employee, index) => {
    const number = (offset - 1) * LIMIT + index + 1;
    const mappedEmployee = addNumToEmployee(employee, number);
    return compiledRow(mappedEmployee);
  });

  return employeesToReturn;
};

const getItemFromLocalStorage = (itemName) => {
  try {
    const item = JSON.parse(localStorage.getItem(itemName));
    return item;
  } catch (e) {
    console.error(e);
  }
};

const formUrl = (...urlParts) => {
  let url = '';

  for (let i = 0; i < urlParts.length; i++) {
    url += `${urlParts[i]}/`;
  }

  const urlPath = new URL(url);
  return urlPath;
};

const addQueryParamsToURL = (url, queryParams) => {
  for (const [key, value] of Object.entries(queryParams)) {
    url.searchParams.append(`${key}`, `${value}`);
  }

  return url;
};

const calcExpiresInTime = (tokenLifeTime) => {
  const minutes = parseInt(tokenLifeTime.slice(0, tokenLifeTime.length - 1), 10);
  const currentDate = new Date();
  const expiresInTime = new Date(currentDate.getTime() + minutes * 60000);

  return expiresInTime;
};

export {
  getEmployeesWithSetNumber,
  getItemFromLocalStorage,
  formUrl,
  addQueryParamsToURL,
  calcExpiresInTime,
};
