import {
  getEmployeesWithSetNumber,
  getItemFromLocalStorage,
  setItemToLocalStorage,
} from '../helpers/index.js';
import { getEmployeeData } from './employees.js';

const getEmployeeFillEditModal = async (username) => {
  const employee = await getEmployeeData(username);

  const $templateEmployeeEditItem = $('#template-employee-edit-modal').html();
  const compiledEmployeeData = _.template($templateEmployeeEditItem);
  const employeeHtml = compiledEmployeeData(employee);

  $('#edit-employee-form').append(employeeHtml);

  const $selectElement = $(`#inputEditPosition option[value="${employee.position}"]`);
  $selectElement.attr('selected', true);

  setItemToLocalStorage('pageData', { usernameToEdit: username });
};

const fillEmployees = (employeesToFill) => {
  $('.filled').remove();

  const $templateEmployeesItem = $('#template-employees-item').html();
  const compiledRow = _.template($templateEmployeesItem);
  const { currentOffset } = getItemFromLocalStorage('currentOffset');

  const employeesHtml = getEmployeesWithSetNumber(employeesToFill, compiledRow, currentOffset);

  $('#table-body-employees').append(employeesHtml);

  if (getItemFromLocalStorage('currentUser')) {
    $('.view-profile').removeClass('inactiveLink');
    $('.view-profile').off('click');

    $('.view-profile').on('click', async (e) => {
      $('.edit-form').remove();
      const { id: username } = e.currentTarget.parentElement.parentElement.dataset;
      await getEmployeeFillEditModal(username);
    });
  }
};

export { fillEmployees, getEmployeeFillEditModal };
