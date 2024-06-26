import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  ADD_USER,
  UPDATE_USER,
  DELETE_USER,
} from '../Types/Users.js';

export const fetchUsersRequest = () => {
  return {
    type: FETCH_USERS_REQUEST
  };
};

export const fetchUsersSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users
  };
};

export const fetchUsersFailure = (error) => {
  return {
    type: FETCH_USERS_FAILURE,
    payload: error
  };
};

export const addUser = (user) => {
  return {
    type: ADD_USER,
    payload: user
  };
};

export const updateUser = (userId, userData) => {
  return {
    type: UPDATE_USER,
    payload: { userId, userData }
  };
};

export const deleteUser = (userId) => {
  return {
    type: DELETE_USER,
    payload: userId
  };
};