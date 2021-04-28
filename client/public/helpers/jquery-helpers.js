import { constants } from '../config/constants.js';
import { getItemFromLocalStorage } from './index.js';

const disableViewProfile = () => {
  const { username } = getItemFromLocalStorage('currentUser');
  const $viewProfileEl = $(`.filled[data-id=${username}]`).find('td.view-profile');
  $viewProfileEl.removeClass('current-user');
};

const getOffset = () => +$('#page-number').text();

const getParamsToGetEmployees = () => {
  const $name = $('#filterNameInput').val().toLowerCase();
  const $surname = $('#filterSurnameInput').val().toLowerCase();

  const getOrder = () => {
    if (!$('#applySortBySalary').hasClass('applied')) {
      return '';
    }
    if ($('#applySortBySalary').hasClass('asc')) {
      return 'asc';
    }
    return 'desc';
  };

  const $order = getOrder();
  const $offset = getOffset();

  return {
    name: $name,
    surname: $surname,
    order: $order,
    offset: $offset,
    limit: constants.LIMIT,
  };
};

const getParamsToSignUp = () => {
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

  return signUpReqData;
};

const getParamsToSignIn = (eventName) => {
  if (eventName === 'signUpClick') {
    const $username = $('#signUpInputUsername').val();
    const $password = $('#signUpInputPassword').val();

    const signInReqData = {
      userData: {
        username: $username,
        password: $password,
      },
    };

    return signInReqData;
  }

  const $username = $('#signInInputUsername').val();
  const $password = $('#signInInputPassword').val();

  const signInReqData = {
    userData: {
      username: $username,
      password: $password,
    },
  };

  return signInReqData;
};

const getValuesFromEditModal = () => {
  const $name = $('#inputEditName').val();
  const $surname = $('#inputEditSurname').val();
  const $dateOfBirth = $('#inputEditDateOfBirth').val();
  const $salary = $('#inputEditSalary').val();
  const $position = $('#inputEditPosition').val();

  const valuesFromEditModal = {
    name: $name,
    surname: $surname,
    dateOfBirth: $dateOfBirth,
    salary: $salary,
    position: $position,
  };

  return valuesFromEditModal;
};

export {
  getParamsToGetEmployees,
  getOffset,
  getValuesFromEditModal,
  disableViewProfile,
  getParamsToSignIn,
  getParamsToSignUp,
};
