import axios from 'axios';

// Fetch all orders
const fetchOrders = async () => {
  try {
    const response = await axios.get('https://packpal-backend.vercel.app/orders');
    return response.data; 
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error; 
  }
};

// Fetch a single order by ID
const fetchOrderById = async (orderId) => {
  try {
    const response = await axios.get(`https://packpal-backend.vercel.app/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    throw error; 
  }
};

// Create a new order
const createOrder = async (orderData) => {
  try {
    const response = await axios.post('https://packpal-backend.vercel.app/orders', orderData); 
    return response.data; 
  } catch (error) {
    console.error('Error creating order:', error);
    throw error; 
  }
};

// Update an existing order
const updateOrder = async (orderId, updatedOrderData) => {
  try {
    const response = await axios.put(`https://packpal-backend.vercel.app/orders/${orderId}`, updatedOrderData); 
    return response.data; 
  } catch (error) {
    console.error('Error updating order:', error);
    throw error; 
  }
};

// Delete an order by ID
const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`https://packpal-backend.vercel.app/orders/${orderId}`);
    return response.data; 
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error; 
  }
};

export { fetchOrders, fetchOrderById, createOrder, updateOrder, deleteOrder };
