import { editEmployeeData } from './employees.js';
import { fillEmployees } from './fillers.js';
import { getPaginatedSortedFilteredEmployees } from '../helpers/index.js';
import { handlePaginationOnNextClick, handlePaginationOnPrevClick } from './handlers.js';
import { getValuesFromEditModal } from '../helpers/jquery-helpers.js';

$(document).ready(async () => {
  const { pageEmployees } = await getPaginatedSortedFilteredEmployees();

  fillEmployees(pageEmployees);

  $('#applyFilter').on('click', async () => {
    const { pageEmployees } = await getPaginatedSortedFilteredEmployees();
    fillEmployees(pageEmployees);
  });

  $('#applySortBySalary').on('click', async () => {
    $('#applySortBySalary').toggleClass('asc');
    $('#applySortBySalary').addClass('applied');

    const { pageEmployees } = await getPaginatedSortedFilteredEmployees();
    fillEmployees(pageEmployees);
  });

  $('#edit-employee').on('click', async () => {
    const valuesFromEditModal = getValuesFromEditModal();
    await editEmployeeData(valuesFromEditModal);
  });

  $('#previous-page').on('click', (e) => {
    if ($('#previous-page').hasClass('disabled')) {
      e.preventDefault();
    } else {
      handlePaginationOnPrevClick();
    }
  });

  $('#next-page').on('click', (e) => {
    if ($('#next-page').hasClass('disabled')) {
      e.preventDefault();
    } else {
      handlePaginationOnNextClick();
    }
  });
});
