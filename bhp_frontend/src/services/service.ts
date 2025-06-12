import axios from "axios"
import type { Payload } from "../types/Payload";

const baseUrl = import.meta.env.VITE_BASE_URL

const api = axios.create({
  baseURL: baseUrl, // from .env
  timeout: 10000, // optional: 10s timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

const getLocations = async () => {
  try {
    const response = await api.get('/get_location_names');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

const estimateHousePrice = async (data: Payload) => {
  if (!data.total_sqft || !data.bhk || !data.bath || !data.location) {
    return;
  }

  const formData = new FormData();
  formData.append("total_sqft", data.total_sqft);
  formData.append("bhk", data.bhk);
  formData.append("bath", data.bath);
  formData.append("location", data.location);

  try {
    const response = await api.post("/predict_home_price", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important!
      },
    });
    return response.data.estimated_price
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

export {
  getLocations,
  estimateHousePrice
}