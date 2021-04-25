import { constants } from '../config/constants.js'

const getParamsToGetEmployees = () => {
  const $name = $("#filterNameInput").val().toLowerCase()
  const $surname = $("#filterSurnameInput").val().toLowerCase()

  const getOrder = () => {
    if (!$("#applySortBySalary").hasClass("applied")){
      return ""
    }
    if ($("#applySortBySalary").hasClass("asc")) {
      return "asc"
    }
    return "desc"
  }

  const $order = getOrder()
  const $offset = +$("#page-number").text()

  return {
    name: $name,
    surname: $surname,
    order: $order,
    offset: $offset,
    limit: constants.LIMIT
  }
}

export { getParamsToGetEmployees }