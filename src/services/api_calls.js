/**
 * Service module for interacting with the ReWear API.
 * Provides functions to call all API endpoints for authentication, items, swaps,
 * user management, admin functions, file uploads, and real-time features.
 * 
 * Environment:
 * - BASE_URL: Configured via NEXT_PUBLIC_API_URL (defaults to http://localhost:8000).
 * 
 * Authentication:
 * - Most endpoints require a 'Bearer' token stored in localStorage.
 * - Token format: "Bearer {access_token}"
 * 
 * Features:
 * - Authentication & User Management
 * - Item Listing & Management
 * - Swap System with Real-time Notifications
 * - Search & Filtering
 * - File Upload Support
 * - Admin Panel Functions
 * - WebSocket Integration
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper function to get headers with authorization
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": localStorage.getItem("access_token") ? 
    `Bearer ${localStorage.getItem("access_token")}` : "",
});

// Helper function for form data requests
const getAuthHeadersFormData = () => ({
  "Authorization": localStorage.getItem("access_token") ? 
    `Bearer ${localStorage.getItem("access_token")}` : "",
});

// Helper function for URL encoded requests
const getAuthHeadersUrlEncoded = () => ({
  "Content-Type": "application/x-www-form-urlencoded",
  "Authorization": localStorage.getItem("access_token") ? 
    `Bearer ${localStorage.getItem("access_token")}` : "",
});

/**
 * Helper function to handle API responses
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// =====================================
// HEALTH & STATUS ENDPOINTS
// =====================================

/**
 * Check if the ReWear API is running.
 * @returns {Promise<Object>} Response with API status.
 */
export const checkApiStatus = async () => {
  try {
    const response = await fetch(`${BASE_URL}/`, {
      method: "GET",
    });
    return handleResponse(response);
  } catch (error) {
    console.error("API Status Error:", error);
    throw error;
  }
};

/**
 * Check detailed health of the ReWear API.
 * @returns {Promise<Object>} Response with health status.
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      method: "GET",
    });
    return handleResponse(response);
  } catch (error) {
    console.error("API Health Error:", error);
    throw error;
  }
};

// =====================================
// AUTHENTICATION ENDPOINTS
// =====================================

/**
 * Register a new user account.
 * @param {Object} userData User registration data.
 * @param {string} userData.email User email address (required).
 * @param {string} userData.username Unique username (required).
 * @param {string} userData.password User password (required).
 * @param {string} [userData.first_name] User's first name.
 * @param {string} [userData.last_name] User's last name.
 * @param {string} [userData.bio] User bio.
 * @param {string} [userData.city] User's city.
 * @param {string} [userData.state] User's state.
 * @param {string} [userData.country] User's country.
 * @returns {Promise<Object>} Response with user data.
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Register User Error:", error);
    throw error;
  }
};

/**
 * Login user with OAuth2 compatible form data.
 * @param {Object} credentials Login credentials.
 * @param {string} credentials.username User email or username.
 * @param {string} credentials.password User password.
 * @returns {Promise<Object>} Response with access token.
 */
export const loginUser = async ({ username, password }) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('grant_type', 'password');

    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });
    
    const data = await handleResponse(response);
    
    // Store token in localStorage
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
    }
    
    return data;
  } catch (error) {
    console.error("Login User Error:", error);
    throw error;
  }
};

/**
 * Login user with JSON data (alternative endpoint).
 * @param {Object} credentials Login credentials.
 * @param {string} credentials.email User email.
 * @param {string} credentials.password User password.
 * @returns {Promise<Object>} Response with access token.
 */
export const loginUserJson = async ({ email, password }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/login-json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await handleResponse(response);
    
    // Store token in localStorage
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
    }
    
    return data;
  } catch (error) {
    console.error("Login User JSON Error:", error);
    throw error;
  }
};

/**
 * Get current user profile.
 * @returns {Promise<Object>} Current user data.
 */
export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get Current User Error:", error);
    throw error;
  }
};

/**
 * Update current user profile.
 * @param {Object} updateData Profile update data.
 * @param {string} [updateData.first_name] User's first name.
 * @param {string} [updateData.last_name] User's last name.
 * @param {string} [updateData.bio] User bio.
 * @param {string} [updateData.city] User's city.
 * @param {string} [updateData.state] User's state.
 * @param {string} [updateData.country] User's country.
 * @returns {Promise<Object>} Updated user data.
 */
export const updateCurrentUser = async (updateData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/me`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Update Current User Error:", error);
    throw error;
  }
};

/**
 * Refresh access token.
 * @returns {Promise<Object>} New access token.
 */
export const refreshToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    
    const data = await handleResponse(response);
    
    // Update token in localStorage
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
    }
    
    return data;
  } catch (error) {
    console.error("Refresh Token Error:", error);
    throw error;
  }
};

/**
 * Logout user (client-side token removal).
 * @returns {Promise<Object>} Logout confirmation.
 */
export const logoutUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    
    const data = await handleResponse(response);
    
    // Remove token from localStorage
    localStorage.removeItem("access_token");
    
    return data;
  } catch (error) {
    console.error("Logout User Error:", error);
    // Still remove token even if API call fails
    localStorage.removeItem("access_token");
    throw error;
  }
};

/**
 * Resend welcome email.
 * @returns {Promise<Object>} Confirmation response.
 */
export const resendWelcomeEmail = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/resend-welcome`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Resend Welcome Email Error:", error);
    throw error;
  }
};

/**
 * Send test welcome email (development only).
 * @param {string} testEmail Email address to send test to.
 * @returns {Promise<Object>} Test result.
 */
export const testWelcomeEmail = async (testEmail) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/test-welcome-email?test_email=${encodeURIComponent(testEmail)}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Test Welcome Email Error:", error);
    throw error;
  }
};

// =====================================
// USER ENDPOINTS
// =====================================

/**
 * Get user dashboard data.
 * @returns {Promise<Object>} User dashboard information.
 */
export const getUserDashboard = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/users/me/dashboard`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get User Dashboard Error:", error);
    throw error;
  }
};

/**
 * Get current user's items.
 * @param {Object} [params] Query parameters.
 * @param {string} [params.status_filter] Filter by item status.
 * @param {number} [params.limit=20] Number of items to return.
 * @param {number} [params.offset=0] Number of items to skip.
 * @returns {Promise<Array>} User's items.
 */
export const getUserItems = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.status_filter) queryParams.append('status_filter', params.status_filter);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const response = await fetch(`${BASE_URL}/api/v1/users/me/items?${queryParams.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get User Items Error:", error);
    throw error;
  }
};

/**
 * Get current user's swaps.
 * @param {Object} [params] Query parameters.
 * @param {string} [params.swap_type] Filter by 'sent' or 'received'.
 * @param {string} [params.status_filter] Filter by swap status.
 * @param {number} [params.limit=20] Number of swaps to return.
 * @param {number} [params.offset=0] Number of swaps to skip.
 * @returns {Promise<Array>} User's swaps.
 */
export const getUserSwaps = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.swap_type) queryParams.append('swap_type', params.swap_type);
    if (params.status_filter) queryParams.append('status_filter', params.status_filter);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const response = await fetch(`${BASE_URL}/api/v1/users/me/swaps?${queryParams.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get User Swaps Error:", error);
    throw error;
  }
};

/**
 * Get current user's point transaction history.
 * @param {Object} [params] Query parameters.
 * @param {string} [params.transaction_type] Filter by transaction type.
 * @param {number} [params.limit=50] Number of transactions to return.
 * @param {number} [params.offset=0] Number of transactions to skip.
 * @returns {Promise<Array>} Point transaction history.
 */
export const getUserPointHistory = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.transaction_type) queryParams.append('transaction_type', params.transaction_type);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const response = await fetch(`${BASE_URL}/api/v1/users/me/points?${queryParams.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get User Point History Error:", error);
    throw error;
  }
};

/**
 * Get public user profile.
 * @param {number} userId User ID.
 * @returns {Promise<Object>} Public user profile.
 */
export const getUserPublicProfile = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/users/${userId}`, {
      method: "GET",
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get User Public Profile Error:", error);
    throw error;
  }
};

/**
 * Get public user's items.
 * @param {number} userId User ID.
 * @param {Object} [params] Query parameters.
 * @param {number} [params.limit=20] Number of items to return.
 * @param {number} [params.offset=0] Number of items to skip.
 * @returns {Promise<Array>} User's public items.
 */
export const getUserPublicItems = async (userId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const response = await fetch(`${BASE_URL}/api/v1/users/${userId}/items?${queryParams.toString()}`, {
      method: "GET",
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get User Public Items Error:", error);
    throw error;
  }
};

// =====================================
// ITEM ENDPOINTS
// =====================================

/**
 * Create a new item listing.
 * @param {Object} itemData Item data.
 * @param {string} itemData.title Item title (required).
 * @param {string} itemData.description Item description (required).
 * @param {string} [itemData.brand] Item brand.
 * @param {string} itemData.size Item size (required).
 * @param {string} itemData.condition Item condition (required).
 * @param {string} [itemData.color] Item color.
 * @param {string} [itemData.material] Item material.
 * @param {Array<string>} [itemData.tags] Item tags.
 * @param {string} [itemData.pickup_location] Pickup location.
 * @param {boolean} [itemData.shipping_available=true] Shipping availability.
 * @param {number} [itemData.original_price] Original price.
 * @param {number} itemData.category_id Category ID (required).
 * @param {number} [itemData.points_value] Points value.
 * @returns {Promise<Object>} Created item data.
 */
export const createItem = async (itemData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/items/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Create Item Error:", error);
    throw error;
  }
};

/**
 * List items with advanced filtering and search.
 * @param {Object} [params] Query parameters.
 * @param {string} [params.q] Search query.
 * @param {number} [params.category_id] Filter by category.
 * @param {string} [params.size] Filter by size.
 * @param {string} [params.condition] Filter by condition.
 * @param {number} [params.min_points] Minimum points value.
 * @param {number} [params.max_points] Maximum points value.
 * @param {string} [params.brand] Filter by brand.
 * @param {string} [params.color] Filter by color.
 * @param {string} [params.material] Filter by material.
 * @param {string} [params.tags] Comma-separated tags.
 * @param {string} [params.location] Filter by location.
 * @param {string} [params.sort_by="created_at"] Sort field.
 * @param {string} [params.sort_order="desc"] Sort order.
 * @param {number} [params.limit=20] Number of items to return.
 * @param {number} [params.offset=0] Number of items to skip.
 * @param {boolean} [params.include_shipping] Include items with shipping.
 * @returns {Promise<Array>} List of items.
 */
export const listItems = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${BASE_URL}/api/v1/items/?${queryParams.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("List Items Error:", error);
    throw error;
  }
};

/**
 * Get trending items.
 * @param {number} [limit=10] Number of trending items.
 * @returns {Promise<Array>} Trending items.
 */
export const getTrendingItems = async (limit = 10) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/items/trending?limit=${limit}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get Trending Items Error:", error);
    throw error;
  }
};

/**
 * Get item details.
 * @param {number} itemId Item ID.
 * @returns {Promise<Object>} Item details.
 */
export const getItem = async (itemId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/items/${itemId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get Item Error:", error);
    throw error;
  }
};

/**
 * Update item (owner only).
 * @param {number} itemId Item ID.
 * @param {Object} updateData Item update data.
 * @returns {Promise<Object>} Updated item data.
 */
export const updateItem = async (itemId, updateData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/items/${itemId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Update Item Error:", error);
    throw error;
  }
};

/**
 * Delete item (owner only).
 * @param {number} itemId Item ID.
 * @returns {Promise<Object>} Deletion confirmation.
 */
export const deleteItem = async (itemId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/items/${itemId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Delete Item Error:", error);
    throw error;
  }
};

/**
 * Get similar items.
 * @param {number} itemId Item ID.
 * @param {number} [limit=5] Number of similar items.
 * @returns {Promise<Array>} Similar items.
 */
export const getSimilarItems = async (itemId, limit = 5) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/items/${itemId}/similar?limit=${limit}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get Similar Items Error:", error);
    throw error;
  }
};

// =====================================
// CATEGORY ENDPOINTS
// =====================================

/**
 * List all categories.
 * @param {Object} [params] Query parameters.
 * @param {boolean} [params.include_inactive=false] Include inactive categories.
 * @param {boolean} [params.with_counts=false] Include item counts.
 * @returns {Promise<Array>} List of categories.
 */
export const listCategories = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.include_inactive) queryParams.append('include_inactive', params.include_inactive.toString());
    if (params.with_counts) queryParams.append('with_counts', params.with_counts.toString());

    const response = await fetch(`${BASE_URL}/api/v1/items/categories/?${queryParams.toString()}`, {
      method: "GET",
    });
    return handleResponse(response);
  } catch (error) {
    console.error("List Categories Error:", error);
    throw error;
  }
};

/**
 * List items in a specific category.
 * @param {number} categoryId Category ID.
 * @param {Object} [params] Query parameters.
 * @param {string} [params.sort_by="created_at"] Sort field.
 * @param {number} [params.limit=20] Number of items to return.
 * @param {number} [params.offset=0] Number of items to skip.
 * @returns {Promise<Array>} Category items.
 */
export const listCategoryItems = async (categoryId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const response = await fetch(`${BASE_URL}/api/v1/items/categories/${categoryId}/items?${queryParams.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("List Category Items Error:", error);
    throw error;
  }
};

// =====================================
// SWAP ENDPOINTS
// =====================================

/**
 * Create a swap request.
 * @param {Object} swapData Swap request data.
 * @param {string} [swapData.requester_message] Message from requester.
 * @param {number} swapData.item_id Target item ID (required).
 * @param {string} swapData.swap_type Swap type (required).
 * @param {number} [swapData.offered_item_id] Offered item ID.
 * @param {number} [swapData.points_offered] Points offered.
 * @returns {Promise<Object>} Created swap data.
 */
export const createSwapRequest = async (swapData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/swaps/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(swapData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Create Swap Request Error:", error);
    throw error;
  }
};

/**
 * List user's swaps.
 * @param {Object} [params] Query parameters.
 * @param {string} [params.swap_type] Filter by 'sent' or 'received'.
 * @param {string} [params.status_filter] Filter by swap status.
 * @param {number} [params.limit=20] Number of swaps to return.
 * @param {number} [params.offset=0] Number of swaps to skip.
 * @returns {Promise<Array>} User's swaps.
 */
export const listUserSwaps = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${BASE_URL}/api/v1/swaps/?${queryParams.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("List User Swaps Error:", error);
    throw error;
  }
};

/**
 * Accept a swap request.
 * @param {number} swapId Swap ID.
 * @param {string} [ownerResponse] Owner's response message.
 * @returns {Promise<Object>} Updated swap data.
 */
export const acceptSwap = async (swapId, ownerResponse = null) => {
  try {
    const url = ownerResponse 
      ? `${BASE_URL}/api/v1/swaps/${swapId}/accept?owner_response=${encodeURIComponent(ownerResponse)}`
      : `${BASE_URL}/api/v1/swaps/${swapId}/accept`;

    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Accept Swap Error:", error);
    throw error;
  }
};

/**
 * Reject a swap request.
 * @param {number} swapId Swap ID.
 * @param {string} [ownerResponse] Owner's response message.
 * @returns {Promise<Object>} Updated swap data.
 */
export const rejectSwap = async (swapId, ownerResponse = null) => {
  try {
    const url = ownerResponse 
      ? `${BASE_URL}/api/v1/swaps/${swapId}/reject?owner_response=${encodeURIComponent(ownerResponse)}`
      : `${BASE_URL}/api/v1/swaps/${swapId}/reject`;

    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Reject Swap Error:", error);
    throw error;
  }
};

/**
 * Complete a swap.
 * @param {number} swapId Swap ID.
 * @returns {Promise<Object>} Updated swap data.
 */
export const completeSwap = async (swapId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/swaps/${swapId}/complete`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Complete Swap Error:", error);
    throw error;
  }
};

/**
 * Get swap details.
 * @param {number} swapId Swap ID.
 * @returns {Promise<Object>} Swap details.
 */
export const getSwap = async (swapId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/swaps/${swapId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get Swap Error:", error);
    throw error;
  }
};

/**
 * Cancel a swap request.
 * @param {number} swapId Swap ID.
 * @returns {Promise<Object>} Updated swap data.
 */
export const cancelSwap = async (swapId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/swaps/${swapId}/cancel`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Cancel Swap Error:", error);
    throw error;
  }
};

/**
 * Get swap statistics.
 * @returns {Promise<Object>} Swap statistics.
 */
export const getSwapStats = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/swaps/stats/summary`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get Swap Stats Error:", error);
    throw error;
  }
};

// =====================================
// ADMIN ENDPOINTS
// =====================================

/**
 * Get admin dashboard.
 * @returns {Promise<Object>} Admin dashboard data.
 */
export const getAdminDashboard = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/admin/dashboard`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get Admin Dashboard Error:", error);
    throw error;
  }
};

/**
 * List all users (admin only).
 * @param {Object} [params] Query parameters.
 * @param {boolean} [params.is_active] Filter by active status.
 * @param {boolean} [params.is_admin] Filter by admin status.
 * @param {string} [params.search] Search in username or email.
 * @param {number} [params.limit=50] Number of users to return.
 * @param {number} [params.offset=0] Number of users to skip.
 * @returns {Promise<Array>} List of users.
 */
export const listAllUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${BASE_URL}/api/v1/admin/users?${queryParams.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("List All Users Error:", error);
    throw error;
  }
};

/**
 * Toggle user active status (admin only).
 * @param {number} userId User ID.
 * @returns {Promise<Object>} Updated user status.
 */
export const toggleUserActiveStatus = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/admin/users/${userId}/toggle-active`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Toggle User Active Status Error:", error);
    throw error;
  }
};

/**
 * List all items (admin only).
 * @param {Object} [params] Query parameters.
 * @param {string} [params.status_filter] Filter by item status.
 * @param {number} [params.category_id] Filter by category.
 * @param {string} [params.search] Search in title or description.
 * @param {number} [params.limit=50] Number of items to return.
 * @param {number} [params.offset=0] Number of items to skip.
 * @returns {Promise<Array>} List of items.
 */
export const listAllItems = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${BASE_URL}/api/v1/admin/items?${queryParams.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("List All Items Error:", error);
    throw error;
  }
};

/**
 * Approve item listing (admin only).
 * @param {number} itemId Item ID.
 * @param {string} [adminNotes] Admin notes.
 * @returns {Promise<Object>} Approval confirmation.
 */
export const approveItem = async (itemId, adminNotes = null) => {
  try {
    const url = adminNotes 
      ? `${BASE_URL}/api/v1/admin/items/${itemId}/approve?admin_notes=${encodeURIComponent(adminNotes)}`
      : `${BASE_URL}/api/v1/admin/items/${itemId}/approve`;

    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Approve Item Error:", error);
    throw error;
  }
};

/**
 * Reject item listing (admin only).
 * @param {number} itemId Item ID.
 * @param {string} [rejectionReason="Item does not meet platform guidelines"] Rejection reason.
 * @param {string} [adminNotes] Admin notes.
 * @returns {Promise<Object>} Rejection confirmation.
 */
export const rejectItem = async (itemId, rejectionReason = "Item does not meet platform guidelines", adminNotes = null) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('rejection_reason', rejectionReason);
    if (adminNotes) queryParams.append('admin_notes', adminNotes);

    const response = await fetch(`${BASE_URL}/api/v1/admin/items/${itemId}/reject?${queryParams.toString()}`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Reject Item Error:", error);
    throw error;
  }
};

/**
 * List all swaps (admin only).
 * @param {Object} [params] Query parameters.
 * @param {string} [params.status_filter] Filter by swap status.
 * @param {string} [params.swap_type] Filter by swap type.
 * @param {number} [params.limit=50] Number of swaps to return.
 * @param {number} [params.offset=0] Number of swaps to skip.
 * @returns {Promise<Array>} List of swaps.
 */
export const listAllSwaps = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${BASE_URL}/api/v1/admin/swaps?${queryParams.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("List All Swaps Error:", error);
    throw error;
  }
};

/**
 * Create category (admin only).
 * @param {Object} categoryData Category data.
 * @param {string} categoryData.name Category name (required).
 * @param {string} [categoryData.description] Category description.
 * @param {string} [categoryData.icon_name] Icon name.
 * @param {string} [categoryData.color_code] Color code.
 * @returns {Promise<Object>} Created category.
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/admin/categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Create Category Error:", error);
    throw error;
  }
};

/**
 * Update category (admin only).
 * @param {number} categoryId Category ID.
 * @param {Object} updateData Category update data.
 * @returns {Promise<Object>} Updated category.
 */
export const updateCategory = async (categoryId, updateData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/admin/categories/${categoryId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Update Category Error:", error);
    throw error;
  }
};

/**
 * Get platform analytics (admin only).
 * @returns {Promise<Object>} Platform analytics data.
 */
export const getPlatformAnalytics = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/admin/analytics`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get Platform Analytics Error:", error);
    throw error;
  }
};

// =====================================
// FILE UPLOAD ENDPOINTS
// =====================================

/**
 * Upload a single image.
 * @param {File} file Image file.
 * @returns {Promise<Object>} Upload result with image URL.
 */
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/api/v1/upload/images`, {
      method: "POST",
      headers: getAuthHeadersFormData(),
      body: formData,
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Upload Image Error:", error);
    throw error;
  }
};

/**
 * Upload multiple images at once (max 5).
 * @param {Array<File>} files Array of image files.
 * @returns {Promise<Object>} Upload results with image URLs.
 */
export const uploadMultipleImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${BASE_URL}/api/v1/upload/images/multiple`, {
      method: "POST",
      headers: getAuthHeadersFormData(),
      body: formData,
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Upload Multiple Images Error:", error);
    throw error;
  }
};

/**
 * Upload images for a specific item.
 * @param {number} itemId Item ID.
 * @param {Array<File>} files Array of image files.
 * @param {number} [setPrimary=0] Index of image to set as primary.
 * @returns {Promise<Object>} Upload results with image URLs.
 */
export const uploadItemImages = async (itemId, files, setPrimary = 0) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('set_primary', setPrimary.toString());

    const response = await fetch(`${BASE_URL}/api/v1/upload/items/${itemId}/images`, {
      method: "POST",
      headers: getAuthHeadersFormData(),
      body: formData,
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Upload Item Images Error:", error);
    throw error;
  }
};

/**
 * Remove an image from an item.
 * @param {number} itemId Item ID.
 * @param {string} imageUrl Image URL to remove.
 * @returns {Promise<Object>} Removal confirmation.
 */
export const removeItemImage = async (itemId, imageUrl) => {
  try {
    const formData = new URLSearchParams();
    formData.append('image_url', imageUrl);

    const response = await fetch(`${BASE_URL}/api/v1/upload/items/${itemId}/images`, {
      method: "DELETE",
      headers: getAuthHeadersUrlEncoded(),
      body: formData,
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Remove Item Image Error:", error);
    throw error;
  }
};

/**
 * Get/serve uploaded image.
 * @param {string} filename Image filename.
 * @returns {Promise<Blob>} Image blob.
 */
export const getImage = async (filename) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/upload/images/${filename}`, {
      method: "GET",
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.blob();
  } catch (error) {
    console.error("Get Image Error:", error);
    throw error;
  }
};

// =====================================
// WEBSOCKET ENDPOINTS
// =====================================

/**
 * Get test notification page (development only).
 * @returns {Promise<string>} HTML content for test page.
 */
export const getTestNotificationPage = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/ws/test-notifications`, {
      method: "GET",
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.text();
  } catch (error) {
    console.error("Get Test Notification Page Error:", error);
    throw error;
  }
};

/**
 * Send test notification (admin only).
 * @param {number} userId User ID to send notification to.
 * @param {string} message Notification message.
 * @param {string} [notificationType="system_announcement"] Notification type.
 * @returns {Promise<Object>} Send confirmation.
 */
export const sendTestNotification = async (userId, message, notificationType = "system_announcement") => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('user_id', userId.toString());
    queryParams.append('message', message);
    queryParams.append('notification_type', notificationType);

    const response = await fetch(`${BASE_URL}/api/v1/ws/admin/send-test-notification?${queryParams.toString()}`, {
      method: "POST",
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Send Test Notification Error:", error);
    throw error;
  }
};

/**
 * Get WebSocket connection statistics (admin only).
 * @returns {Promise<Object>} WebSocket statistics.
 */
export const getWebSocketStats = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/ws/admin/websocket-stats`, {
      method: "GET",
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get WebSocket Stats Error:", error);
    throw error;
  }
};

// =====================================
// ENHANCED SEARCH ENDPOINTS
// =====================================

/**
 * Advanced search for items with comprehensive filtering.
 * @param {Object} [params] Search parameters.
 * @param {string} [params.q] Search query.
 * @param {number} [params.category_id] Filter by category.
 * @param {string} [params.size] Filter by size.
 * @param {string} [params.condition] Filter by condition.
 * @param {number} [params.min_points] Minimum points value.
 * @param {number} [params.max_points] Maximum points value.
 * @param {string} [params.brand] Filter by brand.
 * @param {string} [params.color] Filter by color.
 * @param {string} [params.material] Filter by material.
 * @param {string} [params.tags] Comma-separated tags.
 * @param {string} [params.location] Filter by pickup location.
 * @param {number} [params.limit=20] Number of items to return.
 * @param {number} [params.offset=0] Number of items to skip.
 * @param {boolean} [params.include_shipping] Include items with shipping.
 * @param {string} [params.sort_by="relevance"] Sort by field.
 * @returns {Promise<Object>} Search results with metadata.
 */
export const advancedSearchItems = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${BASE_URL}/api/v1/search/items?${queryParams.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Advanced Search Items Error:", error);
    throw error;
  }
};

/**
 * Get search suggestions for autocomplete.
 * @param {string} query Partial search query (min 2 characters).
 * @returns {Promise<Array>} Search suggestions.
 */
export const getSearchSuggestions = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/search/suggestions?q=${encodeURIComponent(query)}`, {
      method: "GET",
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get Search Suggestions Error:", error);
    throw error;
  }
};

/**
 * Get popular search terms and trending items.
 * @param {number} [limit=10] Number of popular terms to return.
 * @returns {Promise<Object>} Popular searches and trending items.
 */
export const getPopularSearches = async (limit = 10) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/search/popular?limit=${limit}`, {
      method: "GET",
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get Popular Searches Error:", error);
    throw error;
  }
};

/**
 * Get personalized item recommendations.
 * @param {number} [limit=10] Number of recommendations.
 * @returns {Promise<Array>} Personalized recommendations.
 */
export const getPersonalizedRecommendations = async (limit = 10) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/search/recommendations?limit=${limit}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get Personalized Recommendations Error:", error);
    throw error;
  }
};

/**
 * Get available filter options for search interface.
 * @returns {Promise<Object>} Filter options (sizes, conditions, brands, etc.).
 */
export const getFilterOptions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/search/filters/options`, {
      method: "GET",
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get Filter Options Error:", error);
    throw error;
  }
};

// =====================================
// UTILITY FUNCTIONS
// =====================================

/**
 * Check if user is authenticated.
 * @returns {boolean} True if user has valid token.
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  return !!token;
};

/**
 * Get current user's token.
 * @returns {string|null} Current access token.
 */
export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

/**
 * Clear all stored authentication data.
 */
export const clearAuthData = () => {
  localStorage.removeItem("access_token");
};

/**
 * Build image URL for serving uploaded images.
 * @param {string} filename Image filename.
 * @returns {string} Full image URL.
 */
export const buildImageUrl = (filename) => {
  return `${BASE_URL}/api/v1/upload/images/${filename}`;
};

/**
 * Create WebSocket connection for real-time notifications.
 * @param {string} [path="/ws"] WebSocket path.
 * @returns {WebSocket} WebSocket connection.
 */
export const createWebSocketConnection = (path = "/ws") => {
  const wsUrl = BASE_URL.replace(/^http/, 'ws') + path;
  const token = getAccessToken();
  
  if (!token) {
    throw new Error("Authentication required for WebSocket connection");
  }
  
  const ws = new WebSocket(`${wsUrl}?token=${encodeURIComponent(token)}`);
  
  ws.onopen = () => {
    console.log("WebSocket connection established");
  };
  
  ws.onclose = (event) => {
    console.log("WebSocket connection closed:", event.code, event.reason);
  };
  
  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
  
  return ws;
};

/**
 * Format error message from API response.
 * @param {Error} error Error object.
 * @returns {string} Formatted error message.
 */
export const formatErrorMessage = (error) => {
  if (error.message) {
    try {
      const parsed = JSON.parse(error.message);
      if (parsed.detail) {
        if (Array.isArray(parsed.detail)) {
          // Handle validation errors
          return parsed.detail.map(err => `${err.loc?.join('.') || 'field'}: ${err.msg}`).join(', ');
        }
        return parsed.detail;
      }
    } catch (e) {
      // Not JSON, return original message
      return error.message;
    }
  }
  return "An unexpected error occurred";
};

/**
 * Validate file for upload (size, type).
 * @param {File} file File to validate.
 * @param {Object} [options] Validation options.
 * @param {number} [options.maxSize=5242880] Max file size in bytes (default 5MB).
 * @param {Array<string>} [options.allowedTypes=['image/jpeg', 'image/png', 'image/webp']] Allowed MIME types.
 * @returns {Object} Validation result with isValid and error.
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  } = options;
  
  if (!file) {
    return { isValid: false, error: "No file provided" };
  }
  
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `File size too large. Maximum allowed: ${(maxSize / 1024 / 1024).toFixed(1)}MB` 
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Debounce function for search inputs.
 * @param {Function} func Function to debounce.
 * @param {number} wait Wait time in milliseconds.
 * @returns {Function} Debounced function.
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Format points value for display.
 * @param {number} points Points value.
 * @returns {string} Formatted points string.
 */
export const formatPoints = (points) => {
  if (points === 1) return "1 point";
  return `${points.toLocaleString()} points`;
};

/**
 * Format date for display.
 * @param {string|Date} date Date to format.
 * @param {Object} [options] Intl.DateTimeFormat options.
 * @returns {string} Formatted date string.
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
};

/**
 * Format relative time (e.g., "2 days ago").
 * @param {string|Date} date Date to format.
 * @returns {string} Relative time string.
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now - target) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2419200) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  
  return formatDate(date);
};

/**
 * Generate slug from string.
 * @param {string} text Text to convert to slug.
 * @returns {string} URL-friendly slug.
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Get swap status badge info.
 * @param {string} status Swap status.
 * @returns {Object} Badge info with color and text.
 */
export const getSwapStatusBadge = (status) => {
  const statusMap = {
    'pending': { color: 'yellow', text: 'Pending' },
    'accepted': { color: 'green', text: 'Accepted' },
    'rejected': { color: 'red', text: 'Rejected' },
    'completed': { color: 'blue', text: 'Completed' },
    'cancelled': { color: 'gray', text: 'Cancelled' },
    'expired': { color: 'orange', text: 'Expired' }
  };
  
  return statusMap[status] || { color: 'gray', text: 'Unknown' };
};

/**
 * Get item condition badge info.
 * @param {string} condition Item condition.
 * @returns {Object} Badge info with color and text.
 */
export const getConditionBadge = (condition) => {
  const conditionMap = {
    'new': { color: 'green', text: 'New' },
    'like_new': { color: 'emerald', text: 'Like New' },
    'good': { color: 'blue', text: 'Good' },
    'fair': { color: 'yellow', text: 'Fair' },
    'poor': { color: 'red', text: 'Poor' }
  };
  
  return conditionMap[condition] || { color: 'gray', text: condition };
};

/**
 * Calculate swap compatibility score.
 * @param {Object} userItem User's item.
 * @param {Object} targetItem Target item for swap.
 * @returns {number} Compatibility score (0-100).
 */
export const calculateSwapCompatibility = (userItem, targetItem) => {
  let score = 0;
  
  // Points value similarity (40% weight)
  const pointsDiff = Math.abs(userItem.points_value - targetItem.points_value);
  const maxPoints = Math.max(userItem.points_value, targetItem.points_value);
  const pointsScore = maxPoints > 0 ? (1 - pointsDiff / maxPoints) * 40 : 40;
  score += pointsScore;
  
  // Category match (30% weight)
  if (userItem.category_id === targetItem.category_id) {
    score += 30;
  }
  
  // Size compatibility (20% weight)
  if (userItem.size === targetItem.size) {
    score += 20;
  }
  
  // Condition compatibility (10% weight)
  const conditionOrder = ['poor', 'fair', 'good', 'like_new', 'new'];
  const userConditionIndex = conditionOrder.indexOf(userItem.condition);
  const targetConditionIndex = conditionOrder.indexOf(targetItem.condition);
  const conditionDiff = Math.abs(userConditionIndex - targetConditionIndex);
  const conditionScore = Math.max(0, (4 - conditionDiff) / 4) * 10;
  score += conditionScore;
  
  return Math.round(Math.max(0, Math.min(100, score)));
};

/**
 * Build query string from object.
 * @param {Object} params Parameters object.
 * @returns {string} Query string.
 */
export const buildQueryString = (params) => {
  const filtered = Object.entries(params).filter(([key, value]) => 
    value !== undefined && value !== null && value !== ''
  );
  return new URLSearchParams(filtered).toString();
};

/**
 * Parse query string to object.
 * @param {string} queryString Query string (without ?).
 * @returns {Object} Parsed parameters object.
 */
export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    // Try to convert numbers
    if (!isNaN(value) && !isNaN(parseFloat(value))) {
      result[key] = parseFloat(value);
    }
    // Try to convert booleans
    else if (value === 'true' || value === 'false') {
      result[key] = value === 'true';
    }
    // Keep as string
    else {
      result[key] = value;
    }
  }
  
  return result;
};

// =====================================
// CONSTANTS & ENUMS
// =====================================

export const SWAP_TYPES = {
  ITEM: 'item',
  POINTS: 'points',
  MIXED: 'mixed'
};

export const SWAP_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
};

export const ITEM_CONDITIONS = {
  NEW: 'new',
  LIKE_NEW: 'like_new',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor'
};

export const ITEM_STATUSES = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  AVAILABLE: 'available',
  IN_SWAP: 'in_swap',
  SWAPPED: 'swapped',
  INACTIVE: 'inactive'
};

export const NOTIFICATION_TYPES = {
  SWAP_REQUEST: 'swap_request',
  SWAP_ACCEPTED: 'swap_accepted',
  SWAP_REJECTED: 'swap_rejected',
  SWAP_COMPLETED: 'swap_completed',
  ITEM_APPROVED: 'item_approved',
  ITEM_REJECTED: 'item_rejected',
  SYSTEM_ANNOUNCEMENT: 'system_announcement',
  POINTS_EARNED: 'points_earned',
  WELCOME: 'welcome'
};

export const SORT_OPTIONS = {
  RELEVANCE: 'relevance',
  NEWEST: 'created_at',
  POINTS_ASC: 'points_asc',
  POINTS_DESC: 'points_desc',
  TITLE: 'title'
};

export const DEFAULT_PAGINATION = {
  LIMIT: 20,
  OFFSET: 0,
  MAX_LIMIT: 100
};

// Export all functions as default for convenience
export default {
  // Health & Status
  checkApiStatus,
  checkApiHealth,
  
  // Authentication
  registerUser,
  loginUser,
  loginUserJson,
  getCurrentUser,
  updateCurrentUser,
  refreshToken,
  logoutUser,
  resendWelcomeEmail,
  testWelcomeEmail,
  
  // Users
  getUserDashboard,
  getUserItems,
  getUserSwaps,
  getUserPointHistory,
  getUserPublicProfile,
  getUserPublicItems,
  
  // Items
  createItem,
  listItems,
  getTrendingItems,
  getItem,
  updateItem,
  deleteItem,
  getSimilarItems,
  
  // Categories
  listCategories,
  listCategoryItems,
  
  // Swaps
  createSwapRequest,
  listUserSwaps,
  acceptSwap,
  rejectSwap,
  completeSwap,
  getSwap,
  cancelSwap,
  getSwapStats,
  
  // Admin
  getAdminDashboard,
  listAllUsers,
  toggleUserActiveStatus,
  listAllItems,
  approveItem,
  rejectItem,
  listAllSwaps,
  createCategory,
  updateCategory,
  getPlatformAnalytics,
  
  // File Upload
  uploadImage,
  uploadMultipleImages,
  uploadItemImages,
  removeItemImage,
  getImage,
  
  // WebSocket
  getTestNotificationPage,
  sendTestNotification,
  getWebSocketStats,
  
  // Enhanced Search
  advancedSearchItems,
  getSearchSuggestions,
  getPopularSearches,
  getPersonalizedRecommendations,
  getFilterOptions,
  
  // Utilities
  isAuthenticated,
  getAccessToken,
  clearAuthData,
  buildImageUrl,
  createWebSocketConnection,
  formatErrorMessage,
  validateFile,
  debounce,
  formatPoints,
  formatDate,
  formatRelativeTime,
  generateSlug,
  getSwapStatusBadge,
  getConditionBadge,
  calculateSwapCompatibility,
  buildQueryString,
  parseQueryString
};