const Entry = require('../models/Entry');
const EntryTag = require('../models/EntryTag');
const User = require('../models/User');
const Emotion = require('../models/Emotion');
const Tag = require('../models/Tag');

class EntryService {
  // Create a new mood entry
  static async createEntry(userId, entryData) {
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate emotion exists
    const emotion = await Emotion.findById(entryData.emotion_id);
    if (!emotion) {
      throw new Error('Invalid emotion selected');
    }

    // Validate tags exist if provided
    if (entryData.tag_ids && Array.isArray(entryData.tag_ids)) {
      for (const tagId of entryData.tag_ids) {
        const tag = await Tag.findById(tagId);
        if (!tag) {
          throw new Error(`Invalid tag ID: ${tagId}`);
        }
      }
    }

    // Validate intensity is between 1 and 10
    if (entryData.intensity < 1 || entryData.intensity > 10) {
      throw new Error('Intensity must be between 1 and 10');
    }

    // Set default date to today if not provided
    const date = entryData.date || new Date().toISOString().split('T')[0];

    // Create the entry
    const newEntry = await Entry.create({
      user_id: userId,
      date: date,
      emotion_id: entryData.emotion_id,
      intensity: entryData.intensity,
      note: entryData.note
    });

    // Create entry-tag associations if tags are provided
    if (entryData.tag_ids && Array.isArray(entryData.tag_ids) && entryData.tag_ids.length > 0) {
      await EntryTag.createMultiple(newEntry.id, entryData.tag_ids);
    }

    return newEntry;
  }

  // Get user's mood entries
  static async getUserEntries(userId, options = {}) {
    const { limit = 10, offset = 0, startDate, endDate } = options;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    let entries;
    if (startDate && endDate) {
      entries = await Entry.findByDateRange(userId, startDate, endDate);
    } else {
      entries = await Entry.findByUserId(userId, limit, offset);
    }

    // Get tag information for each entry
    const entriesWithTags = await Promise.all(entries.map(async (entry) => {
      const tags = await EntryTag.findByEntryId(entry.id);
      return {
        ...entry,
        tags: tags.map(tag => ({
          id: tag.tag_id,
          name: tag.tag_name,
          description: tag.tag_description
        }))
      };
    }));

    return {
      entries: entriesWithTags,
      count: await Entry.getCountByUserId(userId)
    };
  }

  // Get a specific mood entry
  static async getEntryById(entryId, userId) {
    const entry = await Entry.findById(entryId);
    if (!entry) {
      throw new Error('Entry not found');
    }

    // Ensure the entry belongs to the requesting user
    if (entry.user_id !== userId) {
      throw new Error('Access denied: Entry does not belong to user');
    }

    // Get tags for the entry
    const tags = await EntryTag.findByEntryId(entryId);
    
    return {
      ...entry,
      tags: tags.map(tag => ({
        id: tag.tag_id,
        name: tag.tag_name,
        description: tag.tag_description
      }))
    };
  }

  // Update a mood entry
  static async updateEntry(entryId, userId, entryData) {
    const entry = await Entry.findById(entryId);
    if (!entry) {
      throw new Error('Entry not found');
    }

    // Ensure the entry belongs to the requesting user
    if (entry.user_id !== userId) {
      throw new Error('Access denied: Entry does not belong to user');
    }

    // Validate emotion exists if provided
    if (entryData.emotion_id) {
      const emotion = await Emotion.findById(entryData.emotion_id);
      if (!emotion) {
        throw new Error('Invalid emotion selected');
      }
    }

    // Validate tags exist if provided
    if (entryData.tag_ids && Array.isArray(entryData.tag_ids)) {
      for (const tagId of entryData.tag_ids) {
        const tag = await Tag.findById(tagId);
        if (!tag) {
          throw new Error(`Invalid tag ID: ${tagId}`);
        }
      }
    }

    // Validate intensity if provided
    if (entryData.intensity !== undefined) {
      if (entryData.intensity < 1 || entryData.intensity > 10) {
        throw new Error('Intensity must be between 1 and 10');
      }
    }

    // Update the entry
    await entry.update(entryData);

    // Update entry-tag associations if tags are provided
    if (entryData.tag_ids && Array.isArray(entryData.tag_ids)) {
      // First delete existing tags for this entry
      await EntryTag.deleteByEntryId(entryId);
      // Then add new tags
      if (entryData.tag_ids.length > 0) {
        await EntryTag.createMultiple(entryId, entryData.tag_ids);
      }
    }

    // Get updated tags for the entry
    const tags = await EntryTag.findByEntryId(entryId);
    
    return {
      ...entry,
      tags: tags.map(tag => ({
        id: tag.tag_id,
        name: tag.tag_name,
        description: tag.tag_description
      }))
    };
  }

  // Delete a mood entry
  static async deleteEntry(entryId, userId) {
    const entry = await Entry.findById(entryId);
    if (!entry) {
      throw new Error('Entry not found');
    }

    // Ensure the entry belongs to the requesting user
    if (entry.user_id !== userId) {
      throw new Error('Access denied: Entry does not belong to user');
    }

    // Delete entry-tag associations first
    await EntryTag.deleteByEntryId(entryId);

    // Delete the entry
    const result = await entry.delete();
    if (!result) {
      throw new Error('Failed to delete entry');
    }

    return { message: 'Entry deleted successfully' };
  }

  // Get mood trends for a user
  static async getMoodTrends(userId, period = 'month', startDate, endDate) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Set default date range if not provided
    if (!startDate || !endDate) {
      const now = new Date();
      if (period === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      } else { // default to month
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString().split('T')[0];
      }
      endDate = now.toISOString().split('T')[0];
    }

    // Get entries for the date range
    const entries = await Entry.findByDateRange(userId, startDate, endDate);

    // Calculate daily averages
    const dailyData = {};
    entries.forEach(entry => {
      const dateStr = entry.date.split('T')[0]; // Ensure date is in YYYY-MM-DD format
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { totalIntensity: 0, count: 0, entries: [] };
      }
      dailyData[dateStr].totalIntensity += entry.intensity;
      dailyData[dateStr].count++;
      dailyData[dateStr].entries.push(entry);
    });

    // Convert to array and calculate averages
    const dailyAverages = Object.entries(dailyData).map(([date, data]) => ({
      date,
      average_intensity: parseFloat((data.totalIntensity / data.count).toFixed(2)),
      entry_count: data.count
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate overall average
    const totalIntensity = entries.reduce((sum, entry) => sum + entry.intensity, 0);
    const averageIntensity = entries.length > 0 ? parseFloat((totalIntensity / entries.length).toFixed(2)) : 0;

    return {
      period,
      startDate,
      endDate,
      average_intensity: averageIntensity,
      daily_data: dailyAverages
    };
  }

  // Get calendar data for a user
  static async getCalendarData(userId, year, month) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate year and month
    if (!year || !month || month < 1 || month > 12) {
      throw new Error('Valid year and month (1-12) are required');
    }

    // Get entries for the specified month
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0); // Last day of the month
    endDate.setDate(endDate.getDate());
    const endDateStr = endDate.toISOString().split('T')[0];

    const entries = await Entry.findByDateRange(userId, startDate, endDateStr);

    // Group entries by day
    const entriesByDay = {};
    entries.forEach(entry => {
      const day = new Date(entry.date).getDate();
      if (!entriesByDay[day]) {
        entriesByDay[day] = [];
      }
      entriesByDay[day].push(entry);
    });

    // Calculate average intensity for each day
    const daysWithEntries = Object.entries(entriesByDay).map(([day, dayEntries]) => {
      const totalIntensity = dayEntries.reduce((sum, entry) => sum + entry.intensity, 0);
      const averageIntensity = parseFloat((totalIntensity / dayEntries.length).toFixed(2));
      
      return {
        day: parseInt(day),
        entry_count: dayEntries.length,
        average_intensity: averageIntensity
      };
    });

    return {
      year: parseInt(year),
      month: parseInt(month),
      days_with_entries: daysWithEntries
    };
  }
}

module.exports = EntryService;