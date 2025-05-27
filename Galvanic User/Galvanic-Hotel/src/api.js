export const API_BASE_URL = "https://c77e-2401-4900-1cb9-c525-74be-b667-964e-9fba.ngrok-free.app/user";
export const API_BASE_URL1 = 'https://c77e-2401-4900-1cb9-c525-74be-b667-964e-9fba.ngrok-free.app/hotel';
export const API_BASE_URL2 = 'https://1jxrkqvp-5001.inc1.devtunnels.ms';
export const getImageHotel = (hotelId) =>
  axios.post(`${API_BASE_URL1}/getImageHotel/${hotelId}`, null, {
    headers: NGROK_HEADERS,
    withCredentials: true,
  });
