import Trip from '../models/Trip.js';

/**
 * @route   GET /api/trips/:tripId/checklist
 * @access  Private
 */
export const getChecklistItems = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, user_id: req.user.id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const items = trip.checklist_items;
    const total = items.length;
    const packed = items.filter(i => i.is_packed).length;
    const progress = total > 0 ? Math.round((packed / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        items,
        stats: { total, packed, unpacked: total - packed, progress }
      }
    });
  } catch (error) {
    console.error('Get checklist error:', error);
    res.status(500).json({ success: false, message: 'Error fetching checklist', error: error.message });
  }
};

/**
 * @route   POST /api/trips/:tripId/checklist
 * @access  Private
 */
export const addChecklistItem = async (req, res) => {
  try {
    const { item_name, category } = req.body;

    const trip = await Trip.findOne({ _id: req.params.tripId, user_id: req.user.id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    trip.checklist_items.push({ item_name, category });
    await trip.save();

    const newItem = trip.checklist_items[trip.checklist_items.length - 1];
    res.status(201).json({ success: true, message: 'Item added successfully', data: newItem });
  } catch (error) {
    console.error('Add checklist item error:', error);
    res.status(500).json({ success: false, message: 'Error adding item', error: error.message });
  }
};

/**
 * @route   PUT /api/trips/:tripId/checklist/:itemId
 * @access  Private
 */
export const updateChecklistItem = async (req, res) => {
  try {
    const { tripId, itemId } = req.params;
    const { is_packed, item_name, category } = req.body;

    const trip = await Trip.findOne({ _id: tripId, user_id: req.user.id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const item = trip.checklist_items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    if (is_packed !== undefined) item.is_packed = is_packed;
    if (item_name !== undefined) item.item_name = item_name;
    if (category !== undefined) item.category = category;

    await trip.save();
    res.json({ success: true, message: 'Item updated successfully', data: item });
  } catch (error) {
    console.error('Update checklist item error:', error);
    res.status(500).json({ success: false, message: 'Error updating item', error: error.message });
  }
};

/**
 * @route   DELETE /api/trips/:tripId/checklist/:itemId
 * @access  Private
 */
export const deleteChecklistItem = async (req, res) => {
  try {
    const { tripId, itemId } = req.params;

    const trip = await Trip.findOne({ _id: tripId, user_id: req.user.id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const item = trip.checklist_items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    item.deleteOne();
    await trip.save();

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete checklist item error:', error);
    res.status(500).json({ success: false, message: 'Error deleting item', error: error.message });
  }
};
