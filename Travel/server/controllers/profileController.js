import User from '../models/User.js';
import Trip from '../models/Trip.js';
import bcrypt from 'bcryptjs';

/**
 * @route   GET /api/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Aggregate stats from all trips
    const trips = await Trip.find({ user_id: userId }).lean();

    const total_trips = trips.length;

    const allCountries = new Set();
    const allCities = new Set();
    let total_budget = 0;
    let total_spent = 0;

    trips.forEach(trip => {
      (trip.stops || []).forEach(stop => {
        allCountries.add(stop.country);
        allCities.add(stop.city_name);
      });
      (trip.budget_items || []).forEach(item => {
        total_budget += item.estimated_cost || 0;
        total_spent += item.actual_cost || 0;
      });
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profile_image: user.profile_image,
          created_at: user.createdAt,
          notifications: user.notifications,
          privacy: user.privacy,
        },
        stats: {
          total_trips,
          countries_visited: allCountries.size,
          cities_visited: allCities.size,
          total_budget,
          total_spent
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
  }
};

/**
 * @route   PUT /api/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile_image: user.profile_image,
        created_at: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
  }
};

/**
 * @route   POST /api/profile/avatar
 * @access  Private
 */
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const profile_image = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profile_image },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile image updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile_image: user.profile_image,
        created_at: user.createdAt
      }
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({ success: false, message: 'Error uploading profile image', error: error.message });
  }
};

/**
 * @route   PUT /api/profile/password
 * @desc    Change password — requires current password verification
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ success: false, message: 'Both current and new password are required' });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    // Fetch user with password field
    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Verify current password
    const isValid = await bcrypt.compare(current_password, user.password);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(new_password, salt);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Error changing password', error: error.message });
  }
};

/**
 * @route   PUT /api/profile/notifications
 * @desc    Update notification preferences
 * @access  Private
 */
export const updateNotifications = async (req, res) => {
  try {
    const { email_trips, email_reminders, email_community } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'notifications.email_trips':     email_trips     ?? true,
        'notifications.email_reminders': email_reminders ?? true,
        'notifications.email_community': email_community ?? false,
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Notification preferences updated',
      data: user.notifications
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({ success: false, message: 'Error updating notifications', error: error.message });
  }
};

/**
 * @route   PUT /api/profile/privacy
 * @desc    Update privacy settings
 * @access  Private
 */
export const updatePrivacy = async (req, res) => {
  try {
    const { show_profile, show_trips, allow_community } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'privacy.show_profile':    show_profile    ?? 'public',
        'privacy.show_trips':      show_trips      ?? 'public',
        'privacy.allow_community': allow_community ?? true,
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Privacy settings updated',
      data: user.privacy
    });
  } catch (error) {
    console.error('Update privacy error:', error);
    res.status(500).json({ success: false, message: 'Error updating privacy', error: error.message });
  }
};
