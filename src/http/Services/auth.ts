import { api } from '@/http/api';

// Logs in a user by sending email and code to the '/auth/login' API.  
// Returns a Promise with the server response containing user data or token.
export const login = async (data: { email_id: string, code: string }) => api.post('admin/login/', data);