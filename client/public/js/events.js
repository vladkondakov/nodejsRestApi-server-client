import { fillEmployees } from './fillers.js';
import { handlePaginationOnNextClick, handlePaginationOnPrevClick } from './handlers.js';
import {
  getValuesFromEditModal,
  getParamsToSignIn,
  getParamsToSignUp,
} from '../helpers/jquery-helpers.js';
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
  const signUpReqData = getParamsToSignUp();
  const signInReqData = getParamsToSignIn('signUpClick');

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
  const reqData = getParamsToSignIn('signInClick');

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

  try {
    const currentPageEmployees = await getPaginatedSortedFilteredEmployees();
    fillEmployees(currentPageEmployees);
  } catch (e) {
    console.log('%c%s', 'color: red;', e);
  }

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
