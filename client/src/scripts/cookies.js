const setCookie = (key, value) => {
  document.cookie = `${key}=${encodeURIComponent(value)}; path=/`;
};




const getCookie = (key) => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(row => row.startsWith(key + '='));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}




const deleteCookie = (key) => {
  document.cookie = `${key}=; Max-Age=0; path=/`;
};







export default {
  setCookie,
  getCookie,
  deleteCookie
};