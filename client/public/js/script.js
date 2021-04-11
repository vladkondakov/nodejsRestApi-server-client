import { getEmployeeData } from './employees.js'
import { getEmployeesWithSetNumber } from '../helpers/employees.js'
import { constants } from '../config/constants.js'

const getPaginatedSortedFilteredEmployees = async () => {

  //move this somewhere
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

  const queryParams = getParamsToGetEmployees()

  const fetchEmployees = async (queryParams) => {
    const urlToGetEmployees = new URL('http://localhost:9000/employees/')
  
    for (const [key, value] of Object.entries(queryParams)) {
      urlToGetEmployees.searchParams.append(`${key}`, `${value}`)
    }

    const employeesData = await fetch(urlToGetEmployees)
    const employeesDataJSON = await employeesData.json()

    return employeesDataJSON
  }

  const employees = await fetchEmployees(queryParams)

  return employees
}

const fillEmployees = async (employeesToFill) => {
	$(".filled").remove()

	const $templateEmployeesItem = $("#template-employees-item").html()
	const compiledRow = _.template($templateEmployeesItem)
  const $offset = +$("#page-number").text()

  const employeesHtml = getEmployeesWithSetNumber(employeesToFill, compiledRow, $offset)
	$("#table-body-employees").append(employeesHtml)

  // put it to the beginning of file
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))

  if (currentUser && currentUser.username) {
    const { username } = currentUser
    const $tdElement = $(`.filled[data-id=${username}]`).find('td.view-profile')

    if ($tdElement.html()) {
      $tdElement.addClass("current-user")
      $tdElement.html('<a id="view-profile" href="#" data-bs-toggle="modal" data-bs-target="#modalEditEmployee">Edit</a>')
      $tdElement.on("click", e => {
        $(`.filled[data-id=${username}]`).find('td.view-profile').hasClass("current-user") ? getEmployeeData() : e.preventDefault()
      })
    } else if ($tdElement.hasClass("current-user")){
      $tdElement.removeClass("current-user")
    }
  }
}

const handlePagination = async () => {
    const { previous, next, pageEmployees } = await getPaginatedSortedFilteredEmployees()

    const $prevPageBtn = $("#previous-page")
    const $nextPageBtn = $("#next-page")
    
    !previous ? $prevPageBtn.addClass("disabled") : $prevPageBtn.removeClass("disabled")
    !next ? $nextPageBtn.addClass("disabled") : $nextPageBtn.removeClass("disabled")

	await fillEmployees(pageEmployees)
}

const handlePaginationOnPrevClick = async () => {
	const prevOffset = +$("#page-number").text() - 1
    $("#page-number").text(prevOffset)
    
    await handlePagination()
}

const handlePaginationOnNextClick = async () => {
	const nextOffset = +$("#page-number").text() + 1
    $("#page-number").text(nextOffset)
    
    await handlePagination()
}

$(document).ready(async () => {
  $("#applyFilter").on("click", async () => {
    const { pageEmployees } = await getPaginatedSortedFilteredEmployees()
    await fillEmployees(pageEmployees)
  })
  
  $("#applySortBySalary").on("click", async () => {
    $("#applySortBySalary").toggleClass("asc")
    $("#applySortBySalary").addClass("applied")
  
    const { pageEmployees } = await getPaginatedSortedFilteredEmployees()
    await fillEmployees(pageEmployees)
  })

	const { pageEmployees } = await getPaginatedSortedFilteredEmployees()

  await fillEmployees(pageEmployees)

	$("#previous-page").on("click", e => {
        $("#previous-page").hasClass("disabled") ? e.preventDefault() : handlePaginationOnPrevClick()
	})
	$("#next-page").on("click", e => {
        $("#next-page").hasClass("disabled") ? e.preventDefault() : handlePaginationOnNextClick()
    })
})