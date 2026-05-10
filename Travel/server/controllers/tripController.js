import Trip from '../models/Trip.js';

/**
 * @route   POST /api/trips
 * @access  Private
 */
export const createTrip = async (req, res) => {
  try {
    const { trip_name, description, start_date, end_date, visibility } = req.body;
    const cover_image = req.file ? `/uploads/${req.file.filename}` : null;

    const trip = await Trip.create({
      user_id: req.user.id,
      trip_name,
      description,
      start_date,
      end_date,
      cover_image,
      visibility: visibility || 'private'
    });

    res.status(201).json({ success: true, message: 'Trip created successfully', data: trip });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ success: false, message: 'Error creating trip', error: error.message });
  }
};

/**
 * @route   GET /api/trips
 * @access  Private
 */
export const getTrips = async (req, res) => {
  try {
    const { sort = 'createdAt', order = 'desc', search = '' } = req.query;

    // Build filter
    const filter = { user_id: req.user.id };
    if (search) {
      filter.$or = [
        { trip_name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Map frontend sort keys to MongoDB field names
    const sortMap = {
      trip_name: 'trip_name',
      start_date: 'start_date',
      end_date: 'end_date',
      created_at: 'createdAt'
    };
    const sortField = sortMap[sort] || 'createdAt';
    const sortOrder = order.toLowerCase() === 'asc' ? 1 : -1;

    const trips = await Trip.find(filter)
      .sort({ [sortField]: sortOrder })
      .lean({ virtuals: true });

    res.json({ success: true, count: trips.length, data: trips });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ success: false, message: 'Error fetching trips', error: error.message });
  }
};

/**
 * @route   GET /api/trips/:id
 * @access  Private
 */
export const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user_id: req.user.id })
      .lean({ virtuals: true });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Sort stops by position
    if (trip.stops) {
      trip.stops.sort((a, b) => a.position - b.position);
    }

    res.json({ success: true, data: trip });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ success: false, message: 'Error fetching trip', error: error.message });
  }
};

/**
 * @route   PUT /api/trips/:id
 * @access  Private
 */
export const updateTrip = async (req, res) => {
  try {
    const { trip_name, description, start_date, end_date, visibility } = req.body;

    const trip = await Trip.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Only update cover_image if a new file was uploaded
    if (req.file) {
      trip.cover_image = `/uploads/${req.file.filename}`;
    }

    trip.trip_name = trip_name;
    trip.description = description;
    trip.start_date = start_date;
    trip.end_date = end_date;
    trip.visibility = visibility || trip.visibility;

    await trip.save();

    res.json({ success: true, message: 'Trip updated successfully', data: trip });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ success: false, message: 'Error updating trip', error: error.message });
  }
};

/**
 * @route   DELETE /api/trips/:id
 * @access  Private
 */
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ success: false, message: 'Error deleting trip', error: error.message });
  }
};

/**
 * @route   GET /api/trips/stats/dashboard
 * @access  Private
 */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // All user trips
    const trips = await Trip.find({ user_id: userId }).lean();

    // Total trips
    const totalTrips = trips.length;

    // Unique countries from all stops
    const allCountries = new Set();
    const allCities = new Map(); // city+country -> count
    trips.forEach(trip => {
      (trip.stops || []).forEach(stop => {
        allCountries.add(stop.country);
        const key = `${stop.city_name}||${stop.country}`;
        allCities.set(key, (allCities.get(key) || 0) + 1);
      });
    });

    // Total estimated budget
    let totalBudget = 0;
    trips.forEach(trip => {
      (trip.budget_items || []).forEach(item => {
        totalBudget += item.estimated_cost || 0;
      });
    });

    // Upcoming trips
    const upcomingTrips = trips.filter(t => new Date(t.start_date) >= now).length;

    // Recent trips (last 5)
    const recentTrips = trips
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(t => ({
        ...t,
        destination_count: (t.stops || []).length,
        activity_count: (t.stops || []).reduce((s, stop) => s + (stop.activities || []).length, 0)
      }));

    // Popular destinations (top 4 by frequency)
    const popularDestinations = Array.from(allCities.entries())
      .map(([key, count]) => {
        const [city_name, country] = key.split('||');
        return { city_name, country, trip_count: count };
      })
      .sort((a, b) => b.trip_count - a.trip_count)
      .slice(0, 4);

    res.json({
      success: true,
      data: {
        stats: {
          totalTrips,
          countriesVisited: allCountries.size,
          totalBudget,
          upcomingTrips
        },
        recentTrips,
        popularDestinations
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard statistics', error: error.message });
  }
};
