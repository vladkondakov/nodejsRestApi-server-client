import { getItemFromLocalStorage, formUrl, addQueryParamsToURL } from '../helpers/index.js'
import { constants } from '../config/constants.js'

const BASE_AUTH_URL = `${constants.BASE_URL}/auth` 

const signUp = async (reqData) => {
  const urlToSignUp = formUrl(BASE_AUTH_URL, 'signup')

  const response = await fetch(urlToSignUp, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqData)
  })
}

const signIn = async (reqData) => {
  const urlToSignIn = formUrl(BASE_AUTH_URL, 'login')

  const response = await fetch(urlToSignIn, {
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
    username: reqData.userData?.username,
    accessToken,
    refreshToken,
    expiresInTime
  }

  localStorage.setItem('currentUser', JSON.stringify(currentUser))
}

const logout = async () => {
  const { refreshToken } = getItemFromLocalStorage('currentUser')
  const reqData = { refreshToken }

  const urlToLogout = formUrl(BASE_AUTH_URL, 'logout')

  fetch(urlToLogout, {
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

$("#sign-up").on('click', async () => {
  const $username = $("#signUpInputUsername").val()
  const $password = $("#signUpInputPassword").val()
  const $confirmationPassword = $("#signUpInputConfirmationPassword").val()
  const $name = $("#signUpInputName").val()
  const $surname = $("#signUpInputSurname").val()
  const $dateOfBirth = $("#signUpInputDateOfBirth").val()
  const $salary = $("#signUpInputSalary").val()
  const $position = $("#signUpInputPosition").val()

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

  await signUp(reqData)
})

$("#sign-in").on('click', async () => {
  const $username = $("#signInInputUsername").val()
  const $password = $("#signInInputPassword").val()

  const reqData = {
    userData: {
      username: $username,
      password: $password
    }
  }

  await signIn(reqData)
})

$("#logout").on('click', logout)