import axios from 'axios';

// Axiosインスタンスを作成
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/', // ベースURL
  withCredentials: true,                 // Cookieを送信するためのオプション
});

export default apiClient;
