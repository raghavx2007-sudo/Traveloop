import Trip from '../models/Trip.js';
import User from '../models/User.js';

/**
 * @route   GET /api/public/trips
 * @desc    List all public trips
 * @access  Public
 */
export const getPublicTrips = async (req, res) => {
  try {
    const { search = '' } = req.query

    const filter = { visibility: 'public' }
    if (search) {
      filter.trip_name = { $regex: search, $options: 'i' }
    }

    const trips = await Trip.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean({ virtuals: true })

    // Attach owner name to each trip
    const userIds = [...new Set(trips.map(t => t.user_id.toString()))]
    const users = await User.find({ _id: { $in: userIds } }).select('name').lean()
    const userMap = {}
    users.forEach(u => { userMap[u._id.toString()] = u.name })

    const result = trips.map(t => ({
      ...t,
      user_name: userMap[t.user_id.toString()] || 'Unknown'
    }))

    res.json({ success: true, count: result.length, data: result })
  } catch (error) {
    console.error('Get public trips error:', error)
    res.status(500).json({ success: false, message: 'Error fetching public trips', error: error.message })
  }
}

/**
 * @route   GET /api/public/trips/:id
 * @access  Public (no auth required)
 */
export const getPublicTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, visibility: 'public' }).lean({ virtuals: true });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or not public' });
    }

    // Get the owner's name (don't expose email)
    const owner = await User.findById(trip.user_id).select('name');

    // Sort stops by position
    const stops = [...(trip.stops || [])].sort((a, b) => a.position - b.position);

    // Budget summary per category (estimated only — hide actual costs for privacy)
    const budgetMap = {};
    (trip.budget_items || []).forEach(item => {
      budgetMap[item.category] = (budgetMap[item.category] || 0) + (item.estimated_cost || 0);
    });
    const budget_summary = Object.entries(budgetMap).map(([category, total]) => ({ category, total }));

    res.json({
      success: true,
      data: {
        ...trip,
        stops,
        budget_summary,
        user_name: owner ? owner.name : 'Unknown'
      }
    });
  } catch (error) {
    console.error('Get public trip error:', error);
    res.status(500).json({ success: false, message: 'Error fetching trip', error: error.message });
  }
};
