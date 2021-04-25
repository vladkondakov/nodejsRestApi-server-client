import { editEmployeeData } from './employees.js'
import { fillEmployees } from './fillers.js'
import { getPaginatedSortedFilteredEmployees } from '../helpers/index.js'

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
  const { pageEmployees } = await getPaginatedSortedFilteredEmployees()

  await fillEmployees(pageEmployees)

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

	$("#previous-page").on("click", e => {
      $("#previous-page").hasClass("disabled") ? e.preventDefault() : handlePaginationOnPrevClick()
	})

	$("#next-page").on("click", e => {
      $("#next-page").hasClass("disabled") ? e.preventDefault() : handlePaginationOnNextClick()
  })
})