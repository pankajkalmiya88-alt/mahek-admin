import { api } from '@/http/api';

/**
 * Fetches a list of SEO service pages using the provided query string.
 *
 * @param {string} [queryString] - Optional query string beginning with `?`.
 */
export const getProductsList = async (queryString = '') => api.get(`products/${queryString}`);

/**
 * Create a new product.
 *
 * @param {any} payload - Product data payload.
 *
 * @returns {Promise<any>} - Returns the API response promise.
 */
export const createProduct = async (payload: any) => api.post(`products/add-product`, payload);


/**
 * Delete a product based on their unique ID.
 * This function sends a DELETE request to remove
 * a specific product record from the backend.
 *
 * @param {string} id - Unique ID of the product to be deleted.
 *
 * @returns {Promise<any>} - Returns the API response promise.
 */
export const deleteProductBasedOnId = async (id: string) => api.delete(`candidates/admin/products/${id}/delete/`);


/**
 * Update an existing product.
 *
 * @param {string} id - Unique ID of the product to be updated.
 * @param {any} payload - Product data payload.
 *
 * @returns {Promise<any>} - Returns the API response promise.
 */
export const updateProduct = async (id: string, payload: any) => api.put(`candidates/admin/products/${id}/update/`, payload);

/**
 * Get a product by ID.
 *
 * @param {string} id - Unique ID of the product.
 *
 * @returns {Promise<any>} - Returns the API response promise.
 */
export const getProductById = async (id: string) => api.get(`candidates/admin/products/${id}/`);