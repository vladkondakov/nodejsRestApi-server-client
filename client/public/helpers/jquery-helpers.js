import { constants } from '../config/constants.js';

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

export { getParamsToGetEmployees, getOffset, getValuesFromEditModal };
