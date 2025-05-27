export const API_BASE_URL = "https://galvanichotel.loca.lt/user";
export const API_BASE_URL1 = 'https://galvanichotel.loca.lt/hotel';
export const API_BASE_URL2 = 'https://1jxrkqvp-5001.inc1.devtunnels.ms';
export const getImageHotel = (hotelId) =>
  axios.post(`${API_BASE_URL1}/getImageHotel/${hotelId}`, null, {
    headers: NGROK_HEADERS,
    withCredentials: true,
  });