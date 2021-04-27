import { fillEmployees } from './fillers.js';
import { handlePaginationOnNextClick, handlePaginationOnPrevClick } from './handlers.js';
import { getValuesFromEditModal } from '../helpers/jquery-helpers.js';
import { editEmployeeData, getPaginatedSortedFilteredEmployees } from './employees.js';
import { signIn, signUp, logout } from './auth.js';

const filterClick = async () => {
  const { pageEmployees } = await getPaginatedSortedFilteredEmployees();
  fillEmployees(pageEmployees);
};

const sortBySalaryClick = async () => {
  $('#applySortBySalary').toggleClass('asc');
  $('#applySortBySalary').addClass('applied');

  const { pageEmployees } = await getPaginatedSortedFilteredEmployees();
  fillEmployees(pageEmployees);
};

const editEmployeeClick = async () => {
  try {
    const valuesFromEditModal = getValuesFromEditModal();
    await editEmployeeData(valuesFromEditModal);

    const employees = await getPaginatedSortedFilteredEmployees();

    fillEmployees(employees);
  } catch (e) {
    console.log('%s%v', 'color: red;', e);
  }
};

const previousPageClick = (e) => {
  if ($('#previous-page').hasClass('disabled')) {
    e.preventDefault();
  } else {
    handlePaginationOnPrevClick();
  }
};

const nextPageClick = (e) => {
  if ($('#next-page').hasClass('disabled')) {
    e.preventDefault();
  } else {
    handlePaginationOnNextClick();
  }
};

const signUpClick = async () => {
  const $username = $('#signUpInputUsername').val();
  const $password = $('#signUpInputPassword').val();
  const $confirmationPassword = $('#signUpInputConfirmationPassword').val();
  const $name = $('#signUpInputName').val();
  const $surname = $('#signUpInputSurname').val();
  const $dateOfBirth = $('#signUpInputDateOfBirth').val();
  const $salary = $('#signUpInputSalary').val();
  const $position = $('#signUpInputPosition').val();

  const signUpReqData = {
    employeeData: {
      username: $username,
      password: $password,
      confirmationPassword: $confirmationPassword,
      name: $name,
      surname: $surname,
      dateOfBirth: $dateOfBirth,
      position: $position,
      salary: $salary,
    },
  };

  const signInReqData = {
    userData: {
      username: $username,
      password: $password,
    },
  };

  try {
    await signUp(signUpReqData);
    await signIn(signInReqData);

    $('#authorization-group').hide();

    const { pageEmployees: currentPageEmployees } = await getPaginatedSortedFilteredEmployees();

    fillEmployees(currentPageEmployees);
  } catch (e) {
    console.log('%c%s', 'color: red;', e);
  }
};

const signInClick = async () => {
  const $username = $('#signInInputUsername').val();
  const $password = $('#signInInputPassword').val();

  const reqData = {
    userData: {
      username: $username,
      password: $password,
    },
  };

  await signIn(reqData);

  const { pageEmployees: currentPageEmployees } = await getPaginatedSortedFilteredEmployees();

  fillEmployees(currentPageEmployees);

  $('#authorization-group').hide();
};

const logoutClick = async () => {
  try {
    await logout();
  } catch (e) {
    console.log('%c%s', 'color: red;', e);
  }

  getPaginatedSortedFilteredEmployees()
    .then((currentPageEmployees) => {
      fillEmployees(currentPageEmployees);
    })
    .catch((e) => {
      console.log('%c%s', 'color: red;', e);
    });

  $('#authorization-group').show();
};

export {
  filterClick,
  sortBySalaryClick,
  editEmployeeClick,
  previousPageClick,
  nextPageClick,
  signUpClick,
  signInClick,
  logoutClick,
};
