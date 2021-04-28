import { getItemFromLocalStorage, formUrl, calcExpiresInTime } from '../helpers/index.js';
import { constants } from '../config/constants.js';

const BASE_AUTH_URL = `${constants.BASE_URL}/auth`;

const signUp = async (reqData) => {
  const urlToSignUp = formUrl(BASE_AUTH_URL, 'signup');

  const response = await fetch(urlToSignUp, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqData),
  });

  if (!response.ok) {
    // console.log('%s%v%c', 'color: red;', response.status, response.statusText);
    const err = new Error(`${response.status}: ${response.statusText}`);
    throw err;
  }
};

const signIn = async (reqData) => {
  const urlToSignIn = formUrl(BASE_AUTH_URL, 'login');
  const response = await fetch(urlToSignIn, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqData),
  });

  if (!response.ok) {
    const err = new Error(`${response.status}: ${response.statusText}`);
    throw err;
  }

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
};

const logout = async () => {
  const { refreshToken } = getItemFromLocalStorage('currentUser');
  const reqData = { refreshToken };

  const urlToLogout = formUrl(BASE_AUTH_URL, 'logout');

  const response = await fetch(urlToLogout, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqData),
  });

  if (response.status === 204) {
    localStorage.removeItem('currentUser');
  }

  if (!response.ok) {
    const err = new Error(`${response.status}: ${response.statusText}`);
    throw err;
  }
};

export { signIn, signUp, logout };
