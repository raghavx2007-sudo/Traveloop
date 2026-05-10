import Trip from '../models/Trip.js';

/**
 * @route   GET /api/trips/:tripId/notes
 * @access  Private
 */
export const getNotes = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, user_id: req.user.id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    // Sort: notes with a date first (desc), then by createdAt desc
    const notes = [...trip.notes].sort((a, b) => {
      const dateA = a.note_date || a.createdAt;
      const dateB = b.note_date || b.createdAt;
      return new Date(dateB) - new Date(dateA);
    });

    res.json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ success: false, message: 'Error fetching notes', error: error.message });
  }
};

/**
 * @route   POST /api/trips/:tripId/notes
 * @access  Private
 */
export const addNote = async (req, res) => {
  try {
    const { note, note_date } = req.body;

    const trip = await Trip.findOne({ _id: req.params.tripId, user_id: req.user.id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    trip.notes.push({ note, note_date: note_date || null });
    await trip.save();

    const newNote = trip.notes[trip.notes.length - 1];
    res.status(201).json({ success: true, message: 'Note added successfully', data: newNote });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ success: false, message: 'Error adding note', error: error.message });
  }
};

/**
 * @route   PUT /api/trips/:tripId/notes/:noteId
 * @access  Private
 */
export const updateNote = async (req, res) => {
  try {
    const { tripId, noteId } = req.params;
    const { note, note_date } = req.body;

    const trip = await Trip.findOne({ _id: tripId, user_id: req.user.id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const noteDoc = trip.notes.id(noteId);
    if (!noteDoc) return res.status(404).json({ success: false, message: 'Note not found' });

    noteDoc.note = note;
    noteDoc.note_date = note_date || null;

    await trip.save();
    res.json({ success: true, message: 'Note updated successfully', data: noteDoc });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ success: false, message: 'Error updating note', error: error.message });
  }
};

/**
 * @route   DELETE /api/trips/:tripId/notes/:noteId
 * @access  Private
 */
export const deleteNote = async (req, res) => {
  try {
    const { tripId, noteId } = req.params;

    const trip = await Trip.findOne({ _id: tripId, user_id: req.user.id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const noteDoc = trip.notes.id(noteId);
    if (!noteDoc) return res.status(404).json({ success: false, message: 'Note not found' });

    noteDoc.deleteOne();
    await trip.save();

    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ success: false, message: 'Error deleting note', error: error.message });
  }
};
