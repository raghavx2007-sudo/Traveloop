import Trip from '../models/Trip.js';

/**
 * Helper — verify trip ownership and return the document
 */
const getOwnedTrip = async (tripId, userId) => {
  const trip = await Trip.findOne({ _id: tripId, user_id: userId });
  return trip; // null if not found / not owned
};

/**
 * @route   POST /api/trips/:tripId/stops
 * @access  Private
 */
export const addStop = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { city_name, country, arrival_date, departure_date } = req.body;

    const trip = await getOwnedTrip(tripId, req.user.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    // Position = next after current last stop
    const position = trip.stops.length;

    trip.stops.push({ city_name, country, arrival_date, departure_date, position });
    await trip.save();

    const newStop = trip.stops[trip.stops.length - 1];
    res.status(201).json({ success: true, message: 'Stop added successfully', data: newStop });
  } catch (error) {
    console.error('Add stop error:', error);
    res.status(500).json({ success: false, message: 'Error adding stop', error: error.message });
  }
};

/**
 * @route   PUT /api/trips/:tripId/stops/:stopId
 * @access  Private
 */
export const updateStop = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const { city_name, country, arrival_date, departure_date } = req.body;

    const trip = await getOwnedTrip(tripId, req.user.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const stop = trip.stops.id(stopId);
    if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });

    stop.city_name = city_name;
    stop.country = country;
    stop.arrival_date = arrival_date;
    stop.departure_date = departure_date;

    await trip.save();
    res.json({ success: true, message: 'Stop updated successfully', data: stop });
  } catch (error) {
    console.error('Update stop error:', error);
    res.status(500).json({ success: false, message: 'Error updating stop', error: error.message });
  }
};

/**
 * @route   DELETE /api/trips/:tripId/stops/:stopId
 * @access  Private
 */
export const deleteStop = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;

    const trip = await getOwnedTrip(tripId, req.user.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const stop = trip.stops.id(stopId);
    if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });

    stop.deleteOne();
    await trip.save();

    res.json({ success: true, message: 'Stop deleted successfully' });
  } catch (error) {
    console.error('Delete stop error:', error);
    res.status(500).json({ success: false, message: 'Error deleting stop', error: error.message });
  }
};

/**
 * @route   PUT /api/trips/:tripId/stops/reorder
 * @access  Private
 */
export const reorderStops = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { stops } = req.body; // Array of { id, position }

    const trip = await getOwnedTrip(tripId, req.user.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    // Update positions on each embedded stop
    stops.forEach(({ id, position }) => {
      const stop = trip.stops.id(id);
      if (stop) stop.position = position;
    });

    await trip.save();

    const sorted = [...trip.stops].sort((a, b) => a.position - b.position);
    res.json({ success: true, message: 'Stops reordered successfully', data: sorted });
  } catch (error) {
    console.error('Reorder stops error:', error);
    res.status(500).json({ success: false, message: 'Error reordering stops', error: error.message });
  }
};
