import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  ADD_USER,
  UPDATE_USER,
  DELETE_USER,
} from '../Types/Users.js';

const initialState = {
  users: [], 
  loading: false,
  error: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        error: null
      };
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case ADD_USER:
      return {
        ...state,
        users: [...state.users, action.payload]
      };
    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user => user._id === action.payload.userId ? { ...user, ...action.payload.userData } : user)
      };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload)
      };
    default:
      return state;
  }
};

export default userReducer;
