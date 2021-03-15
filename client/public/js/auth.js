const signUp = async () => {
    const $username = $("#sign-up-form #inputUsername").val()
    const $password = $("#sign-up-form #inputPassword").val()
    const $confirmationPassword = $("#sign-up-form #inputConfirmationPassword").val()
    const $name = $("#sign-up-form #inputName").val()
    const $surname = $("#sign-up-form #inputSurname").val()
    const $dateOfBirth = $("#sign-up-form #inputDateOfBirth").val()
    const $salary = $("#sign-up-form #inputSalary").val()
    const $position = $("#sign-up-form #inputPosition").val()

    const reqData = {
        employeeData: {
            username: $username,
            password: $password,
            confirmationPassword: $confirmationPassword,
            name: $name,
            surname: $surname,
            dateOfBirth: $dateOfBirth,
            position: $position,
            salary: $salary
        }
    }

    const url = 'http://localhost:9000/auth/signup'

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqData)
    })
}

const signIn = async () => {
    const $username = $("#sign-in-form #inputUsername").val()
    const $password = $("#sign-in-form #inputPassword").val()

    const reqData = {
        userData: {
            username: $username,
            password: $password
        }
    }

    const url = 'http://localhost:9000/auth/login'

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqData)
    })

    const accessData = await response.json()
    const { accessToken, refreshToken, expiresIn } = accessData

    const minutes = parseInt(expiresIn.slice(0, expiresIn.length - 1))
    const currentDate = new Date()
    const expiresInTime = new Date(currentDate.getTime() + minutes * 60000)
    
    const currentUser = {
        username: $username,
        accessToken,
        refreshToken,
        expiresInTime
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser))
}

const logout = async () => {
    const { refreshToken } = JSON.parse(localStorage.getItem('currentUser'))
    const reqData = { refreshToken }

    const url = 'http://localhost:9000/auth/logout'

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqData)
    }).then((response) => {
        if(response.status === 204) {
            localStorage.removeItem('currentUser')
        }
    }).catch((err) => {
        console.log('Server error', err)
    })  
}

$("#sign-up").on('click', signUp)
$("#sign-in").on('click', signIn)
$("#logout").on('click', logout)