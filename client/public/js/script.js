import { fillEmployees } from './fillers.js';
import { getPaginatedSortedFilteredEmployees } from './employees.js';

import {
  filterClick,
  sortBySalaryClick,
  editEmployeeClick,
  previousPageClick,
  nextPageClick,
  signInClick,
  signUpClick,
  logoutClick,
} from './events.js';

$(document).ready(async () => {
  const { pageEmployees } = await getPaginatedSortedFilteredEmployees();

  fillEmployees(pageEmployees);

  $('#applyFilter').on('click', filterClick);
  $('#applySortBySalary').on('click', sortBySalaryClick);
  $('#edit-employee').on('click', editEmployeeClick);
  $('#previous-page').on('click', previousPageClick);
  $('#next-page').on('click', nextPageClick);

  $('#sign-up').on('click', signUpClick);
  $('#sign-in').on('click', signInClick);
  $('#logout').on('click', logoutClick);
});
