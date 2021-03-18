const getEmployeeData = async () => {
    const { accessToken, username } = JSON.parse(localStorage.getItem('currentUser'))
    const url = `http://localhost:9000/employees/${username}`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })

    const employeeData = await response.json()
    const employee = employeeData.embeddedItems

    const $templateEmployeeEditItem = $("#template-employee-edit-modal").html()
	const compiledEmployeeData = _.template($templateEmployeeEditItem)

	const employeeHtml = compiledEmployeeData(employee)

    $("#edit-employee-form").append(employeeHtml)

    const $selectElement = $(`#inputEditPosition option[value="${employee.position}"]`)
    $selectElement.attr("selected", true)
}

const editEmployeeData = async () => {
    const { accessToken, username } = JSON.parse(localStorage.getItem('currentUser'))
    const url = `http://localhost:9000/employees/${username}`

    const $name = $("#inputEditName").val()
    const $surname = $("#inputEditSurname").val()
    const $dateOfBirth = $("#inputEditDateOfBirth").val()
    const $salary = $("#inputEditSalary").val()
    const $position = $("#inputEditPosition").val()

    const reqData = {
        name: $name,
        surname: $surname,
        dateOfBirth: $dateOfBirth,
        salary: $salary,
        position: $position
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqData)
    })
}

$("#edit-employee").on('click', editEmployeeData)

export { getEmployeeData, editEmployeeData }