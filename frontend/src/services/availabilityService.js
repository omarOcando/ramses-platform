import axios from "axios";

const BASE_URL = "http://localhost:3000/api/availability";

export const getAvailableSlots = async (token) => {
  const response = await axios.get(`${BASE_URL}/available`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getAllSlots = async (token) => {
  const response = await axios.get(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createSlot = async (slotData, token) => {
  const response = await axios.post(BASE_URL, slotData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createSlotRange = async (slotData, token) => {
  const response = await axios.post(`${BASE_URL}/range`, slotData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateSlot = async (id, slotData, token) => {
  const response = await axios.put(`${BASE_URL}/${id}`, slotData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteSlot = async (id, token) => {
  const response = await axios.delete(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};