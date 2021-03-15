export default async function getEmployeeData () {
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
    console.log(employee)
}