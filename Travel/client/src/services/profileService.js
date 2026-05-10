import api from './api';

/**
 * Profile Service
 * Handles all profile-related API calls
 */

// Get user profile with statistics
export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

// Update user profile
export const updateProfile = async (profileData) => {
  const response = await api.put('/profile', profileData);
  return response.data;
};

// Upload profile avatar
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await api.post('/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

// Get public trip
export const getPublicTrip = async (id) => {
  const response = await api.get(`/public/trips/${id}`);
  return response.data;
};

// Change password
export const changePassword = async (data) => {
  const response = await api.put('/profile/password', data);
  return response.data;
};

// Update notification preferences
export const updateNotifications = async (data) => {
  const response = await api.put('/profile/notifications', data);
  return response.data;
};

// Update privacy settings
export const updatePrivacy = async (data) => {
  const response = await api.put('/profile/privacy', data);
  return response.data;
};
