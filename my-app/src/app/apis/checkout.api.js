import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/address";



export const saveCheckoutAddress = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, credentials, {
    });
    console.log('Checkout successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Checkout failed:', error);
    throw error.response?.data || error;
  }
};
