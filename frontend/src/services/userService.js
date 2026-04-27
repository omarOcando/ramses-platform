import axios from "axios";

const BASE_URL = "http://localhost:3000/api/users";

export const getAllUsers = async (token) => {
  const res = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateUser = async (id, data, token) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteUser = async (id, token) => {
  const res = await axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
