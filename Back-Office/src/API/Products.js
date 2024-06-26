import axios from 'axios';

// Add a new product
const createProduct = async (productData) => {
  try {
    const response = await axios.post('https://packpal-backend.vercel.app/products', productData); 
    return response.data; 
  } catch (error) {
    console.error('Error adding product:', error);
    throw error; 
  }
};

// Fetch all products
const fetchProducts = async () => {
  try {
    const response = await axios.get('https://packpal-backend.vercel.app/products'); 
    return response.data; 
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; 
  }
};

// Fetch a single product by ID
const fetchProductById = async (productId) => {
  try {
    const response = await axios.get(`https://packpal-backend.vercel.app/products/${productId}`); 
    return response.data; 
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error; 
  }
};

// Update an existing product
const updateProduct = async (productId, updatedProductData) => {
  try {
    const response = await axios.put(`https://packpal-backend.vercel.app/products/${productId}`, updatedProductData); 
    return response.data; 
  } catch (error) {
    console.error('Error updating product:', error);
    throw error; 
  }
};

// Delete a product by ID
const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`https://packpal-backend.vercel.app/products/${productId}`); 
    return response.data; 
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error; 
  }
};

export { createProduct, fetchProducts, fetchProductById, updateProduct, deleteProduct };
