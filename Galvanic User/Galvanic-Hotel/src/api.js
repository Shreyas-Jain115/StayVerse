export const API_BASE_URL = "https://c98a-2401-4900-9006-93ad-194c-d7e4-4fdb-2e6d.ngrok-free.app/user";
export const API_BASE_URL1 = 'https://c98a-2401-4900-9006-93ad-194c-d7e4-4fdb-2e6d.ngrok-free.app/hotel';
export const API_BASE_URL2 = 'https://1jxrkqvp-5001.inc1.devtunnels.ms';
export const getImageHotel = (hotelId) =>
  axios.post(`${API_BASE_URL1}/getImageHotel/${hotelId}`, null, {
    headers: NGROK_HEADERS,
    withCredentials: true,
  });
