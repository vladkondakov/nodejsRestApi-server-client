import { getEmployeesWithSetNumber, getItemFromLocalStorage } from '../helpers/index.js';
import { getEmployeeData } from './employees.js';

const getEmployeeFillModal = async () => {
  const employee = await getEmployeeData();

  const $templateEmployeeEditItem = $('#template-employee-edit-modal').html();
  const compiledEmployeeData = _.template($templateEmployeeEditItem);
  const employeeHtml = compiledEmployeeData(employee);

  $('#edit-employee-form').append(employeeHtml);

  const $selectElement = $(`#inputEditPosition option[value="${employee.position}"]`);
  $selectElement.attr('selected', true);
};

const fillEmployees = async (employeesToFill) => {
  $('.filled').remove();

  const $templateEmployeesItem = $('#template-employees-item').html();
  const compiledRow = _.template($templateEmployeesItem);
  const $offset = +$('#page-number').text();

  const employeesHtml = getEmployeesWithSetNumber(employeesToFill, compiledRow, $offset);

  $('#table-body-employees').append(employeesHtml);

  const currentUser = getItemFromLocalStorage('currentUser');

  if (currentUser && currentUser.username) {
    const { username } = currentUser;
    const $tdElement = $(`.filled[data-id=${username}]`).find('td.view-profile');

    if ($tdElement.html()) {
      $tdElement.addClass('current-user');
      $tdElement.html(
        '<a id="view-profile" href="#" data-bs-toggle="modal" data-bs-target="#modalEditEmployee">Edit</a>'
      );
      $tdElement.on('click', (e) => {
        $(`.filled[data-id=${username}]`).find('td.view-profile').hasClass('current-user')
          ? getEmployeeFillModal()
          : e.preventDefault();
      });
    } else if ($tdElement.hasClass('current-user')) {
      $tdElement.removeClass('current-user');
    }
  }
};

export { fillEmployees };
