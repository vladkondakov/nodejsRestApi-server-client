import { getEmployeeData, getEmployeesData, editEmployeeData } from './employees.js'
import { getEmployeesWithSetNumber, getItemFromLocalStorage } from '../helpers/index.js'
import { constants } from '../config/constants.js'

const getEmployeeFillModal = async () => {
  const employee = await getEmployeeData()

  const $templateEmployeeEditItem = $("#template-employee-edit-modal").html()
	const compiledEmployeeData = _.template($templateEmployeeEditItem)
	const employeeHtml = compiledEmployeeData(employee)

  $("#edit-employee-form").append(employeeHtml)

  const $selectElement = $(`#inputEditPosition option[value="${employee.position}"]`)
  $selectElement.attr("selected", true)
}

const getPaginatedSortedFilteredEmployees = async () => {
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
  const employees = await getEmployeesData(queryParams)

  return employees
}

const fillEmployees = async (employeesToFill) => {
	$(".filled").remove()

	const $templateEmployeesItem = $("#template-employees-item").html()
	const compiledRow = _.template($templateEmployeesItem)
  const $offset = +$("#page-number").text()

  const employeesHtml = getEmployeesWithSetNumber(employeesToFill, compiledRow, $offset)
	
  $("#table-body-employees").append(employeesHtml)

  const currentUser = getItemFromLocalStorage('currentUser')

  if (currentUser && currentUser.username) {
    const { username } = currentUser
    const $tdElement = $(`.filled[data-id=${username}]`).find('td.view-profile')

    if ($tdElement.html()) {
      $tdElement.addClass("current-user")
      $tdElement.html('<a id="view-profile" href="#" data-bs-toggle="modal" data-bs-target="#modalEditEmployee">Edit</a>')
      $tdElement.on("click", e => {
        $(`.filled[data-id=${username}]`).find('td.view-profile').hasClass("current-user") ? getEmployeeFillModal() : e.preventDefault()
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

  $("#edit-employee").on('click', async () => {
    const $name = $("#inputEditName").val()
    const $surname = $("#inputEditSurname").val()
    const $dateOfBirth = $("#inputEditDateOfBirth").val()
    const $salary = $("#inputEditSalary").val()
    const $position = $("#inputEditPosition").val()
  
    const valuesFromEditModal = {
      name: $name,
      surname: $surname,
      dateOfBirth: $dateOfBirth,
      salary: $salary,
      position: $position
    }
  
    await editEmployeeData(valuesFromEditModal)
  })
})