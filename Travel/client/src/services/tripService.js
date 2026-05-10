import api from './api';

/**
 * Trip Service
 * Handles all trip-related API calls
 */

// Create new trip
export const createTrip = async (tripData) => {
  const formData = new FormData();
  
  formData.append('trip_name', tripData.trip_name);
  formData.append('description', tripData.description || '');
  formData.append('start_date', tripData.start_date);
  formData.append('end_date', tripData.end_date);
  formData.append('visibility', tripData.visibility || 'private');
  
  if (tripData.cover_image) {
    formData.append('cover_image', tripData.cover_image);
  }

  const response = await api.post('/trips', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

// Get all trips
export const getTrips = async (params = {}) => {
  const response = await api.get('/trips', { params });
  return response.data;
};

// Get single trip
export const getTrip = async (id) => {
  const response = await api.get(`/trips/${id}`);
  return response.data;
};

// Update trip
export const updateTrip = async (id, tripData) => {
  const formData = new FormData();
  
  formData.append('trip_name', tripData.trip_name);
  formData.append('description', tripData.description || '');
  formData.append('start_date', tripData.start_date);
  formData.append('end_date', tripData.end_date);
  formData.append('visibility', tripData.visibility || 'private');
  
  if (tripData.cover_image && typeof tripData.cover_image !== 'string') {
    formData.append('cover_image', tripData.cover_image);
  }

  const response = await api.put(`/trips/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

// Delete trip
export const deleteTrip = async (id) => {
  const response = await api.delete(`/trips/${id}`);
  return response.data;
};

// Get dashboard stats
export const getDashboardStats = async () => {
  const response = await api.get('/trips/stats/dashboard');
  return response.data;
};

// Add stop to trip
export const addStop = async (tripId, stopData) => {
  const response = await api.post(`/trips/${tripId}/stops`, stopData);
  return response.data;
};

// Update stop
export const updateStop = async (tripId, stopId, stopData) => {
  const response = await api.put(`/trips/${tripId}/stops/${stopId}`, stopData);
  return response.data;
};

// Delete stop
export const deleteStop = async (tripId, stopId) => {
  const response = await api.delete(`/trips/${tripId}/stops/${stopId}`);
  return response.data;
};

// Reorder stops
export const reorderStops = async (tripId, stops) => {
  const response = await api.put(`/trips/${tripId}/stops/reorder`, { stops });
  return response.data;
};

// Get all activities
export const getActivities = async (params = {}) => {
  const response = await api.get('/activities', { params });
  return response.data;
};

// Add activity to trip stop
export const addActivityToTrip = async (tripId, stopId, activityData) => {
  const response = await api.post(`/trips/${tripId}/stops/${stopId}/activities`, activityData);
  return response.data;
};

// Remove activity from trip stop
export const removeActivityFromTrip = async (tripId, stopId, activityId) => {
  const response = await api.delete(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`);
  return response.data;
};

// Get budget items
export const getBudgetItems = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/budget`);
  return response.data;
};

// Add budget item
export const addBudgetItem = async (tripId, budgetData) => {
  const response = await api.post(`/trips/${tripId}/budget`, budgetData);
  return response.data;
};

// Update budget item
export const updateBudgetItem = async (tripId, itemId, budgetData) => {
  const response = await api.put(`/trips/${tripId}/budget/${itemId}`, budgetData);
  return response.data;
};

// Delete budget item
export const deleteBudgetItem = async (tripId, itemId) => {
  const response = await api.delete(`/trips/${tripId}/budget/${itemId}`);
  return response.data;
};

// Get checklist items
export const getChecklistItems = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/checklist`);
  return response.data;
};

// Add checklist item
export const addChecklistItem = async (tripId, itemData) => {
  const response = await api.post(`/trips/${tripId}/checklist`, itemData);
  return response.data;
};

// Update checklist item
export const updateChecklistItem = async (tripId, itemId, itemData) => {
  const response = await api.put(`/trips/${tripId}/checklist/${itemId}`, itemData);
  return response.data;
};

// Delete checklist item
export const deleteChecklistItem = async (tripId, itemId) => {
  const response = await api.delete(`/trips/${tripId}/checklist/${itemId}`);
  return response.data;
};

// Get notes
export const getNotes = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/notes`);
  return response.data;
};

// Add note
export const addNote = async (tripId, noteData) => {
  const response = await api.post(`/trips/${tripId}/notes`, noteData);
  return response.data;
};

// Update note
export const updateNote = async (tripId, noteId, noteData) => {
  const response = await api.put(`/trips/${tripId}/notes/${noteId}`, noteData);
  return response.data;
};

// Delete note
export const deleteNote = async (tripId, noteId) => {
  const response = await api.delete(`/trips/${tripId}/notes/${noteId}`);
  return response.data;
};
