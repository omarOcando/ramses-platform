import axios from "axios";

const API_URL = "http://localhost:3000/api/availability/available";

export const getAvailableSlots = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};