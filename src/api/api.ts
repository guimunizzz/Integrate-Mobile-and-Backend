import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.87.169.95:8000',
});

export default api;