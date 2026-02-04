import { useTokenStore } from '@/store/store';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config) => {
    const token = useTokenStore.getState().token;
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
});