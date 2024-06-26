import axios from 'axios';

// Create a new customer
const addCustomer = async (customerData) => {
  try {
    const response = await axios.post('https://packpal-backend.vercel.app/customers', customerData); 
    return response.data; 
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error; 
  }
};

// Fetch all customers
const fetchCustomers = async () => {
  try {
    const response = await axios.get('https://packpal-backend.vercel.app/customers'); 
    return response.data; 
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error; 
  }
};

// Fetch a single customer by ID
const fetchCustomerById = async (customerId) => {
  try {
    const response = await axios.get(`https://packpal-backend.vercel.app/customers/${customerId}`); 
    return response.data; 
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    throw error; 
  }
};

// Update an existing customer by ID
const updateCustomer = async (customerId, updatedCustomerData) => {
  try {
    const response = await axios.put(`https://packpal-backend.vercel.app/customers/${customerId}`, updatedCustomerData); 
    return response.data; 
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error; 
  }
};

// Delete a customer by ID
const deleteCustomer = async (customerId) => {
  try {
    const response = await axios.delete(`https://packpal-backend.vercel.app/customers/${customerId}`); 
    return response.data; 
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error; 
  }
};

export { addCustomer, fetchCustomers, fetchCustomerById, updateCustomer, deleteCustomer };
