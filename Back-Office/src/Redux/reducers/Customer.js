import {
  FETCH_CUSTOMERS_REQUEST,
  FETCH_CUSTOMERS_SUCCESS,
  FETCH_CUSTOMERS_FAILURE,
  ADD_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER,
} from '../Types/Customer.js';

const initialState = {
  users: [], 
  loading: false,
  error: null
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CUSTOMERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_CUSTOMERS_SUCCESS:
      return {
        ...state,
        loading: false,
        customers: action.payload,
        error: null
      };
    case FETCH_CUSTOMERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case ADD_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, action.payload]
      };
    case UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map(customer => customer._id === action.payload.customerId ? { ...customer, ...action.payload.customerData } : customer)
      };
    case DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(customer => customer._id !== action.payload)
      };
    default:
      return state;
  }
};

export default customerReducer;
