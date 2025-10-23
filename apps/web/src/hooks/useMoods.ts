import { useState, useEffect, useCallback, useMemo } from 'react';
import { Mood } from '@neural-trainer/shared';
import { addMood, getMoods, deleteMood, subscribeToMoods } from '../lib/firestore';

export const useMoods = (userId: string) => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);

  // Load moods from Firestore
  const loadMoods = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getMoods(userId);
      if (result.success) {
        setMoods(result.data || []);
      } else {
        console.error('Error loading moods:', result.error);
      }
    } catch (error) {
      console.error('Error loading moods:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Add a new mood
  const addMoodToFirestore = useCallback(async (moodData: Omit<Mood, 'id' | 'userId' | 'timestamp'>) => {
    try {
      const mood = {
        ...moodData,
        userId,
        timestamp: new Date().toISOString(),
      };
      const result = await addMood(userId, mood);
      if (result.success) {
        return { ...mood, id: result.id };
      } else {
        throw new Error('Failed to add mood');
      }
    } catch (error) {
      console.error('Error adding mood:', error);
      throw error;
    }
  }, [userId]);

  // Delete a mood
  const removeMood = useCallback(async (moodId: string) => {
    try {
      const result = await deleteMood(userId, moodId);
      return result.success;
    } catch (error) {
      console.error('Error deleting mood:', error);
      return false;
    }
  }, [userId]);

  // Get weekly moods
  const weeklyMoods = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return moods.filter(m => new Date(m.timestamp) >= weekAgo);
  }, [moods]);
  
  // Get today's moods
  const todayMoods = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return moods.filter(m => {
      const date = new Date(m.timestamp);
      return date >= today && date < tomorrow;
    });
  }, [moods]);

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

  // Set up real-time listener
  useEffect(() => {
    if (!userId) return;
    
    const unsubscribe = subscribeToMoods(userId, (moods) => {
      setMoods(moods);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return {
    moods,
    loading,
    addMood: addMoodToFirestore,
    removeMood,
    weeklyMoods,
    todayMoods,
    stats,
    moodDistribution,
    mostFrequentMood: mostFrequentMood.emoji,
    trends,
  };
};
