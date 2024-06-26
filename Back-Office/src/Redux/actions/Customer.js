import {
  FETCH_CUSTOMERS_REQUEST,
  FETCH_CUSTOMERS_SUCCESS,
  FETCH_CUSTOMERS_FAILURE,
  ADD_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER,
} from '../Types/Customer.js';

export const fetchCustomersRequest = () => {
  return {
    type: FETCH_CUSTOMERS_REQUEST
  };
};

export const fetchCustomersSuccess = (customers) => {
  return {
    type: FETCH_CUSTOMERS_SUCCESS,
    payload: customers
  };
};

export const fetchCustomersFailure = (error) => {
  return {
    type: FETCH_CUSTOMERS_FAILURE,
    payload: error
  };
};

export const addCustomer = (customer) => {
  return {
    type: ADD_CUSTOMER,
    payload: customer
  };
};

export const updateCustomer = (customerId, customerData) => {
  return {
    type: UPDATE_CUSTOMER,
    payload: { customerId, customerData }
  };
};

export const deleteCustomer = (customerId) => {
  return {
    type: DELETE_CUSTOMER,
    payload: customerId
  };
};