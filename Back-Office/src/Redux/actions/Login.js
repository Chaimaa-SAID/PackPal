import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, FETCH_USER_SUCCESS } from '../Types/Login';

export const loginSuccess = (token) => {
  return {
    type: LOGIN_SUCCESS,
    payload: token
  };
};

export const loginFailure = (error) => {
  return {
    type: LOGIN_FAILURE,
    payload: error
  };
};

export const logout = () => {
  return {
    type: LOGOUT
  };
};
export const fetchUserSuccess = (userData) => {
  return {
    type: FETCH_USER_SUCCESS,
    payload: userData
  };
};