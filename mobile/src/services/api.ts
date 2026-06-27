import axios, { AxiosError } from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[] }>) => {
    const msg = error.response?.data?.message;
    const readable = Array.isArray(msg) ? msg[0] : msg ?? error.message ?? 'Erro inesperado';
    return Promise.reject(new Error(readable));
  },
);

export default api;
