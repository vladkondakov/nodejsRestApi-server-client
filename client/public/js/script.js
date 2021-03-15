import getEmployeeData from './employees.js'

const limit = 5

$("#applyFilter").on("click", async () => {
	const { pageEmployees } = await getPaginatedSortedEmployees()
	await fillEmployees(pageEmployees)
})

$("#applySortBySalary").on("click", async () => {
	$("#applySortBySalary").toggleClass("asc")
    $("#applySortBySalary").addClass("applied")

	const { pageEmployees } = await getPaginatedSortedEmployees()
	await fillEmployees(pageEmployees)
})

const getPaginatedSortedEmployees = async () => {
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

	const employeesData = await fetch(
		`http://localhost:9000/employees?offset=${$offset}&limit=${limit}&order=${$order}&name=${$name}&surname=${$surname}`
	)

	const employeesDataJSON = await employeesData.json()
	return employeesDataJSON
}

const fillEmployees = async (employeesToFill) => {
	$(".filled").remove()

	const $templateEmployeesItem = $("#template-employees-item").html()
	const compiledRow = _.template($templateEmployeesItem)

    const $offset = +$("#page-number").text()

	const employeesHtml = employeesToFill.map((employee, index) => {
		const number = ($offset - 1) * limit + index + 1
		employee.number = number
		return compiledRow(employee)
	})

	$("#table-body-employees").append(employeesHtml)

    const currentUser = JSON.parse(localStorage.getItem('currentUser'))

    if (currentUser) {
        const { username } = currentUser
    
        const $tdElement = $(`.filled[data-id=${username}]`).find('td.view-profile')

        if ($tdElement.html()) {
            $tdElement.addClass("current-user")
            $tdElement.html('<a id="view-profile" href="#">Edit</a>')
            $tdElement.on("click", e => {
                $(`.filled[data-id=${username}]`).find('td.view-profile').hasClass("current-user") ? getEmployeeData() : e.preventDefault()
            })
        } else if ($tdElement.hasClass("current-user")){
            $tdElement.removeClass("current-user")
        }
    }
}

const handlePagination = async () => {
    const { previous, next, pageEmployees } = await getPaginatedSortedEmployees()

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
	const { pageEmployees } = await getPaginatedSortedEmployees()

    await fillEmployees(pageEmployees)

	$("#previous-page").on("click", e => {
        $("#previous-page").hasClass("disabled") ? e.preventDefault() : handlePaginationOnPrevClick()
	})
	$("#next-page").on("click", e => {
        $("#next-page").hasClass("disabled") ? e.preventDefault() : handlePaginationOnNextClick()
    })
})