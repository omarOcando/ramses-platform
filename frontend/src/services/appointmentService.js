import axios from "axios";

const API_URL = "http://localhost:3000/api/appointments";

export const createAppointment = async (availabilityId, token) => {
  const response = await axios.post(
    API_URL,
    { availabilityId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getMyAppointments = async (token) => {
  const response = await axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const cancelAppointment = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateAppointmentStatus = async (id, status, token) => {
  const response = await axios.patch(
    `${API_URL}/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getAllAppointments = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const markAttendance = async (id, attendanceStatus, token) => {
  const response = await axios.patch(
    `${API_URL}/${id}/attendance`,
    { attendanceStatus },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const markPaidSession = async (id, paidAmount, token) => {
  const response = await axios.patch(
    `${API_URL}/${id}/payment`,
    { paidAmount },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getRevenueStats = async (filter, token) => {
  const response = await axios.get(
    `${API_URL}/revenue?filter=${filter}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const convertToPaidSession = async (id, token) => {
  const response = await axios.patch(
    `${API_URL}/${id}/convert-to-paid`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};