import Activity from '../models/Activity.js';
import Trip from '../models/Trip.js';

/**
 * @route   GET /api/activities
 * @access  Private
 */
export const getActivities = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const activities = await Activity.find(filter).sort({ name: 1 });
    res.json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ success: false, message: 'Error fetching activities', error: error.message });
  }
};

/**
 * @route   POST /api/activities
 * @desc    Create a new activity in the catalog
 * @access  Private
 */
export const createActivity = async (req, res) => {
  try {
    const { name, category, avg_cost, duration, description } = req.body;
    const activity = await Activity.create({ name, category, avg_cost, duration, description });
    res.status(201).json({ success: true, message: 'Activity created successfully', data: activity });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ success: false, message: 'Error creating activity', error: error.message });
  }
};

/**
 * @route   DELETE /api/activities/:id
 * @desc    Delete an activity from the catalog
 * @access  Private
 */
export const deleteActivity = async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ success: false, message: 'Error deleting activity', error: error.message });
  }
};

/**
 * @route   POST /api/trips/:tripId/stops/:stopId/activities
 * @access  Private
 */
export const addActivityToTrip = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const { activity_id, selected_date, selected_time, custom_cost, notes } = req.body;

    const trip = await Trip.findOne({ _id: tripId, user_id: req.user.id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const stop = trip.stops.id(stopId);
    if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });

    // Fetch activity details to snapshot into the trip
    const activity = await Activity.findById(activity_id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    stop.activities.push({
      activity_id: activity._id,
      name: activity.name,
      category: activity.category,
      avg_cost: activity.avg_cost,
      duration: activity.duration,
      description: activity.description,
      selected_date,
      selected_time,
      custom_cost: custom_cost || null,
      notes: notes || ''
    });

    await trip.save();

    const addedActivity = stop.activities[stop.activities.length - 1];
    res.status(201).json({ success: true, message: 'Activity added successfully', data: addedActivity });
  } catch (error) {
    console.error('Add activity error:', error);
    res.status(500).json({ success: false, message: 'Error adding activity', error: error.message });
  }
};

/**
 * @route   DELETE /api/trips/:tripId/stops/:stopId/activities/:activityId
 * @access  Private
 */
export const removeActivityFromTrip = async (req, res) => {
  try {
    const { tripId, stopId, activityId } = req.params;

    const trip = await Trip.findOne({ _id: tripId, user_id: req.user.id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const stop = trip.stops.id(stopId);
    if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });

    const tripActivity = stop.activities.id(activityId);
    if (!tripActivity) return res.status(404).json({ success: false, message: 'Activity not found' });

    tripActivity.deleteOne();
    await trip.save();

    res.json({ success: true, message: 'Activity removed successfully' });
  } catch (error) {
    console.error('Remove activity error:', error);
    res.status(500).json({ success: false, message: 'Error removing activity', error: error.message });
  }
};
