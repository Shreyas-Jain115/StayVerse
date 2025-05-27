import axios from 'axios';

export const API_BASE_URL = 'https://a505-2401-4900-1cb9-c525-74be-b667-964e-9fba.ngrok-free.app/hotel';

export const API_BASE_URL1 = 'https://a505-2401-4900-1cb9-c525-74be-b667-964e-9fba.ngrok-free.app/user';
const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true"
};

export const registerHotel = (data) =>
  axios.post(`${API_BASE_URL}/register`, data, {
    headers: NGROK_HEADERS,
    withCredentials: true
  });

export const login = (data) =>
  axios.post(`${API_BASE_URL}/login`, data, {
    headers: NGROK_HEADERS,
    withCredentials: true
  });

export const addRoom = (data) =>
  axios.post(`${API_BASE_URL}/addRoom`, data, {
    headers: NGROK_HEADERS,
    withCredentials: true
  });

export const editRoom = (data) =>
  axios.put(`${API_BASE_URL}/changeRoom`, data, {
    headers: {
      ...NGROK_HEADERS,
      'Content-Type': 'application/json',
    },
    withCredentials: true
  });

export const addImage = (roomId, data) =>
  axios.post(`${API_BASE_URL}/addImage/${roomId}`, data, {
    headers: NGROK_HEADERS,
    withCredentials: true
  });



export const getRoomDetails = (roomId) =>
  axios.get(`${API_BASE_URL}/room/${roomId}`, {
    headers: NGROK_HEADERS,
    withCredentials: true
  });

  ///addImageHotel/{hotelId}


export const addImageHotel = (hotelId, data) =>
  axios.post(`${API_BASE_URL}/addImageHotel/${hotelId}`, data, {
    headers: NGROK_HEADERS,
    withCredentials: true
  });

export const removeImage = (id) =>
  axios.delete(`${API_BASE_URL}/removeImage`, {
    headers: NGROK_HEADERS,
    params: { id },
    withCredentials: true
  });

export const getImageHotel = (hotelId) =>
  axios.post(`${API_BASE_URL}/getImageHotel/${hotelId}`, null, {
    headers: NGROK_HEADERS,
    withCredentials: true,
  });