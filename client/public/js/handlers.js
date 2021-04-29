import { getPaginatedSortedFilteredEmployees } from './employees.js';
import { fillEmployees } from './fillers.js';
import { setItemToLocalStorage, getItemFromLocalStorage } from '../helpers/index.js';

const handlePagination = async () => {
  const { previous, next, pageEmployees } = await getPaginatedSortedFilteredEmployees();

  const $prevPageBtn = $('#previous-page');
  const $nextPageBtn = $('#next-page');

  if (!previous) {
    $prevPageBtn.addClass('disabled');
  } else {
    $prevPageBtn.removeClass('disabled');
  }

  if (!next) {
    $nextPageBtn.addClass('disabled');
  } else {
    $nextPageBtn.removeClass('disabled');
  }

  fillEmployees(pageEmployees);
};

const handlePaginationOnPrevClick = async () => {
  const { currentOffset } = getItemFromLocalStorage('currentOffset');
  const prevOffset = currentOffset - 1;
  setItemToLocalStorage('currentOffset', prevOffset);

  $('#page-number').text(prevOffset);

  await handlePagination();
};

const handlePaginationOnNextClick = async () => {
  const { currentOffset } = getItemFromLocalStorage('currentOffset');
  const nextOffset = currentOffset + 1;
  setItemToLocalStorage('currentOffset', nextOffset);

  $('#page-number').text(nextOffset);

  await handlePagination();
};

export { handlePaginationOnPrevClick, handlePaginationOnNextClick };
