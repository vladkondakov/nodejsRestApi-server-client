import {
  getItemFromLocalStorage,
  formUrl,
  getPaginatedSortedFilteredEmployees,
  calcExpiresInTime,
} from '../helpers/index.js';
import { constants } from '../config/constants.js';
import { fillEmployees } from './fillers.js';

const BASE_AUTH_URL = `${constants.BASE_URL}/auth`;

const signUp = async (reqData) => {
  try {
    const urlToSignUp = formUrl(BASE_AUTH_URL, 'signup');

    const response = await fetch(urlToSignUp, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqData),
    });
  } catch (e) {
    console.log(e);
  }
};

const signIn = async (reqData) => {
  const urlToSignIn = formUrl(BASE_AUTH_URL, 'login');

  try {
    const response = await fetch(urlToSignIn, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqData),
    });

    const accessData = await response.json();
    const { accessToken, refreshToken, expiresIn: tokenLifeTime } = accessData;
    const expiresInTime = calcExpiresInTime(tokenLifeTime);

    const currentUser = {
      username: reqData.userData?.username,
      accessToken,
      refreshToken,
      expiresInTime,
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  } catch (e) {
    console.log(e);
  }
};

const logout = async () => {
  const { refreshToken } = getItemFromLocalStorage('currentUser');
  const reqData = { refreshToken };

  const urlToLogout = formUrl(BASE_AUTH_URL, 'logout');

  fetch(urlToLogout, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqData),
  })
    .then((response) => {
      if (response.status === 204) {
        localStorage.removeItem('currentUser');
      }
    })
    .catch((err) => {
      console.log('Server error', err);
    });
};

$('#sign-up').on('click', async () => {
  const $username = $('#signUpInputUsername').val();
  const $password = $('#signUpInputPassword').val();
  const $confirmationPassword = $('#signUpInputConfirmationPassword').val();
  const $name = $('#signUpInputName').val();
  const $surname = $('#signUpInputSurname').val();
  const $dateOfBirth = $('#signUpInputDateOfBirth').val();
  const $salary = $('#signUpInputSalary').val();
  const $position = $('#signUpInputPosition').val();

  const signUpReqData = {
    employeeData: {
      username: $username,
      password: $password,
      confirmationPassword: $confirmationPassword,
      name: $name,
      surname: $surname,
      dateOfBirth: $dateOfBirth,
      position: $position,
      salary: $salary,
    },
  };

  const signInReqData = {
    userData: {
      username: $username,
      password: $password,
    },
  };

  try {
    await signUp(signUpReqData);
    await signIn(signInReqData);
  } catch (e) {
    console.log('%s%v', 'color: red;', e);
  }

  $('#authorization-group').hide();

  const { pageEmployees: currentPageEmployees } = await getPaginatedSortedFilteredEmployees();

  fillEmployees(currentPageEmployees);
});

$('#sign-in').on('click', async () => {
  const $username = $('#signInInputUsername').val();
  const $password = $('#signInInputPassword').val();

  const reqData = {
    userData: {
      username: $username,
      password: $password,
    },
  };

  await signIn(reqData);

  const { pageEmployees: currentPageEmployees } = await getPaginatedSortedFilteredEmployees();

  fillEmployees(currentPageEmployees);

  $('#authorization-group').hide();
});

$('#logout').on('click', async () => {
  try {
    await logout();
  } catch (e) {
    console.log('%c%s', 'color: red;', e);
  }

  getPaginatedSortedFilteredEmployees()
    .then((currentPageEmployees) => {
      fillEmployees(currentPageEmployees);
    })
    .catch((e) => {
      console.log('%c%s', 'color: red;', e);
    });

  $('#authorization-group').show();
});
