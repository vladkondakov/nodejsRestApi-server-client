import {
  getEmployeesWithSetNumber,
  getItemFromLocalStorage,
  setItemToLocalStorage,
} from '../helpers/index.js';
import { getEmployeeData, deleteEmployee } from './employees.js';
import { getOffset } from '../helpers/jquery-helpers.js';

const getEmployeeFillEditModal = async (username) => {
  const employee = await getEmployeeData(username);

  const $templateEmployeeEditItem = $('#template-employee-edit-modal').html();
  const compiledEmployeeData = _.template($templateEmployeeEditItem);
  const employeeHtml = compiledEmployeeData(employee);

  $('#edit-employee-form').append(employeeHtml);

  const $selectElement = $(`#inputEditPosition option[value="${employee.position}"]`);
  $selectElement.attr('selected', true);

  setItemToLocalStorage('pageData', { usernameToEdit: username });
  // localStorage.setItem('pageData', { usernameToEdit: username });
};

const fillEmployees = (employeesToFill) => {
  $('.filled').remove();

  const $templateEmployeesItem = $('#template-employees-item').html();
  const compiledRow = _.template($templateEmployeesItem);
  const $offset = getOffset();

  const employeesHtml = getEmployeesWithSetNumber(employeesToFill, compiledRow, $offset);

  $('#table-body-employees').append(employeesHtml);

  if (getItemFromLocalStorage('currentUser')) {
    $('.view-profile').off('click');
    $('.delete-profile').off('click');

    $('.view-profile').on('click', async (e) => {
      $('.edit-form').remove();
      const { id: username } = e.currentTarget.parentElement.dataset;
      await getEmployeeFillEditModal(username);
    });

    $('.delete-profile').on('click', async (e) => {
      const { id: username } = e.currentTarget.parentElement.dataset;
      await deleteEmployee(username);
    });
  }
};

export { fillEmployees, getEmployeeFillEditModal };

// const fillEmployees = (employeesToFill) => {
//   $('.filled').remove();

//   const $templateEmployeesItem = $('#template-employees-item').html();
//   const compiledRow = _.template($templateEmployeesItem);
//   const $offset = getOffset();

//   const employeesHtml = getEmployeesWithSetNumber(employeesToFill, compiledRow, $offset);

//   $('#table-body-employees').append(employeesHtml);

//   const currentUser = getItemFromLocalStorage('currentUser');

//   // убрать выделение пользователя, добавить редактирование/удаление для каждого
//   if (currentUser && currentUser.username) {
//     const { username } = currentUser;
//     const $tdElement = $(`.filled[data-id=${username}]`).find('td.view-profile');

//     if ($tdElement.html()) {
//       $tdElement.addClass('current-user');
//       $tdElement.html(
//         '<a class="view-profile" href="#" data-bs-toggle="modal" data-bs-target="#modalEditEmployee">Edit</a>/<a id="delete-profile" href="#">Logout</a>'
//       );

//       $tdElement.on('click', (e) => {
//         console.log(e);
//         const viewProfileEl = $(`.filled[data-id=${username}]`).find('td.view-profile');

//         if (viewProfileEl.hasClass('current-user')) {
//           getEmployeeFillEditModal();
//         } else {
//           e.preventDefault();
//         }
//       });
//     } else if ($tdElement.hasClass('current-user')) {
//       $tdElement.removeClass('current-user');
//     }
//   }
// };
