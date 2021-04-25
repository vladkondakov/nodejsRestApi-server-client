import { getPaginatedSortedFilteredEmployees } from '../helpers/index.js';
import { fillEmployees } from './fillers.js';
import { getOffset } from '../helpers/jquery-helpers.js';

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

  await fillEmployees(pageEmployees);
};

const handlePaginationOnPrevClick = async () => {
  const prevOffset = getOffset() - 1;
  $('#page-number').text(prevOffset);

  await handlePagination();
};

const handlePaginationOnNextClick = async () => {
  const nextOffset = getOffset() + 1;
  $('#page-number').text(nextOffset);

  await handlePagination();
};

export { handlePaginationOnPrevClick, handlePaginationOnNextClick };
