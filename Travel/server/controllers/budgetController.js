import Trip from '../models/Trip.js';

/**
 * @route   GET /api/trips/:tripId/budget
 * @access  Private
 */
export const getBudgetItems = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, user_id: req.user.id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const items = trip.budget_items;

    // Calculate totals per category
    const categoryMap = {};
    items.forEach(item => {
      if (!categoryMap[item.category]) {
        categoryMap[item.category] = { estimated_total: 0, actual_total: 0 };
      }
      categoryMap[item.category].estimated_total += item.estimated_cost || 0;
      categoryMap[item.category].actual_total += item.actual_cost || 0;
    });

    const totals = Object.entries(categoryMap).map(([category, vals]) => ({
      category,
      ...vals
    }));

    // Overall totals
    const total_estimated = items.reduce((s, i) => s + (i.estimated_cost || 0), 0);
    const total_actual = items.reduce((s, i) => s + (i.actual_cost || 0), 0);

    res.json({
      success: true,
      data: {
        items,
        totals,
        overall: { total_estimated, total_actual }
      }
    });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ success: false, message: 'Error fetching budget', error: error.message });
  }
};

/**
 * @route   POST /api/trips/:tripId/budget
 * @access  Private
 */
export const addBudgetItem = async (req, res) => {
  try {
    const { category, item_name, estimated_cost, actual_cost, notes } = req.body;

    const trip = await Trip.findOne({ _id: req.params.tripId, user_id: req.user.id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    trip.budget_items.push({ category, item_name, estimated_cost, actual_cost, notes });
    await trip.save();

    const newItem = trip.budget_items[trip.budget_items.length - 1];
    res.status(201).json({ success: true, message: 'Budget item added successfully', data: newItem });
  } catch (error) {
    console.error('Add budget item error:', error);
    res.status(500).json({ success: false, message: 'Error adding budget item', error: error.message });
  }
};

/**
 * @route   PUT /api/trips/:tripId/budget/:itemId
 * @access  Private
 */
export const updateBudgetItem = async (req, res) => {
  try {
    const { tripId, itemId } = req.params;
    const { category, item_name, estimated_cost, actual_cost, notes } = req.body;

    const trip = await Trip.findOne({ _id: tripId, user_id: req.user.id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const item = trip.budget_items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Budget item not found' });

    item.category = category;
    item.item_name = item_name;
    item.estimated_cost = estimated_cost;
    item.actual_cost = actual_cost;
    item.notes = notes;

    await trip.save();
    res.json({ success: true, message: 'Budget item updated successfully', data: item });
  } catch (error) {
    console.error('Update budget item error:', error);
    res.status(500).json({ success: false, message: 'Error updating budget item', error: error.message });
  }
};

/**
 * @route   DELETE /api/trips/:tripId/budget/:itemId
 * @access  Private
 */
export const deleteBudgetItem = async (req, res) => {
  try {
    const { tripId, itemId } = req.params;

    const trip = await Trip.findOne({ _id: tripId, user_id: req.user.id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const item = trip.budget_items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Budget item not found' });

    item.deleteOne();
    await trip.save();

    res.json({ success: true, message: 'Budget item deleted successfully' });
  } catch (error) {
    console.error('Delete budget item error:', error);
    res.status(500).json({ success: false, message: 'Error deleting budget item', error: error.message });
  }
};
