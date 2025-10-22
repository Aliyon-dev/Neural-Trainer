import { useState, useEffect, useCallback } from 'react';
import { Mood } from '@neural-trainer/shared';
import { saveMood, getMoods, deleteMood, getWeeklyMoods, getTodayMoods } from '../lib/storage';

export const useMoods = (userId: string) => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);

  // Load moods from localStorage
  const loadMoods = useCallback(() => {
    try {
      const userMoods = getMoods(userId);
      setMoods(userMoods);
    } catch (error) {
      console.error('Error loading moods:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Add a new mood
  const addMood = useCallback((moodData: Omit<Mood, 'id' | 'userId' | 'timestamp'>) => {
    try {
      const newMood = saveMood(userId, moodData);
      setMoods(prev => [...prev, newMood]);
      return newMood;
    } catch (error) {
      console.error('Error adding mood:', error);
      throw error;
    }
  }, [userId]);

  // Delete a mood
  const removeMood = useCallback((moodId: string) => {
    try {
      const success = deleteMood(userId, moodId);
      if (success) {
        setMoods(prev => prev.filter(mood => mood.id !== moodId));
      }
      return success;
    } catch (error) {
      console.error('Error deleting mood:', error);
      return false;
    }
  }, [userId]);

  // Get weekly moods
  const weeklyMoods = getWeeklyMoods(userId);
  
  // Get today's moods
  const todayMoods = getTodayMoods(userId);

  // Calculate statistics
  const stats = {
    total: moods.length,
    weekly: weeklyMoods.length,
    today: todayMoods.length,
    averageIntensity: moods.length > 0 
      ? moods.reduce((sum, mood) => sum + mood.intensity, 0) / moods.length 
      : 0,
    weeklyAverageIntensity: weeklyMoods.length > 0 
      ? weeklyMoods.reduce((sum, mood) => sum + mood.intensity, 0) / weeklyMoods.length 
      : 0,
    todayAverageIntensity: todayMoods.length > 0 
      ? todayMoods.reduce((sum, mood) => sum + mood.intensity, 0) / todayMoods.length 
      : 0,
  };

  // Get mood distribution
  const moodDistribution = moods.reduce((acc, mood) => {
    acc[mood.emoji] = (acc[mood.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostFrequentMood = Object.entries(moodDistribution).reduce(
    (max, [emoji, count]) => (count as number) > max.count ? { emoji, count: count as number } : max,
    { emoji: '😐', count: 0 }
  );

  // Get mood trends (last 7 days)
  const getMoodTrends = () => {
    const trends = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayMoods = moods.filter(mood => {
        const moodDate = new Date(mood.timestamp);
        return moodDate >= date && moodDate < nextDate;
      });
      
      const averageIntensity = dayMoods.length > 0 
        ? dayMoods.reduce((sum, mood) => sum + mood.intensity, 0) / dayMoods.length 
        : 0;
      
      trends.push({
        date: date.toISOString().split('T')[0],
        count: dayMoods.length,
        averageIntensity,
        moods: dayMoods,
      });
    }
    
    return trends;
  };

  const trends = getMoodTrends();

  // Load moods on mount and when userId changes
  useEffect(() => {
    loadMoods();
  }, [loadMoods]);

  return {
    moods,
    loading,
    addMood,
    removeMood,
    weeklyMoods,
    todayMoods,
    stats,
    moodDistribution,
    mostFrequentMood: mostFrequentMood.emoji,
    trends,
  };
};
