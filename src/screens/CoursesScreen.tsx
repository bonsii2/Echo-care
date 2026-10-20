import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { MATERNAL_COURSES } from '../constants/coursesData';
import { CourseCategory, MaternalCourse } from '../types';
import { CourseVideoCard } from '../components/CourseVideoCard';
import { AudioSpeakerButton } from '../components/AudioSpeakerButton';
import { SyncBanner } from '../components/SyncBanner';

const STORAGE_KEY_COMPLETED = '@echo_care_completed_courses';

export const CoursesScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile } = useProfile();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>('all');
  const [completedCourseIds, setCompletedCourseIds] = useState<string[]>([]);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [isLoadingStorage, setIsLoadingStorage] = useState(true);

  // Load completed courses from AsyncStorage
  useEffect(() => {
    const loadCompleted = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY_COMPLETED);
        if (stored) {
          setCompletedCourseIds(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load completed courses', err);
      } finally {
        setIsLoadingStorage(false);
      }
    };
    loadCompleted();
  }, []);

  // Toggle completion
  const handleToggleComplete = async (courseId: string) => {
    try {
      let updated: string[];
      if (completedCourseIds.includes(courseId)) {
        updated = completedCourseIds.filter((id) => id !== courseId);
      } else {
        updated = [...completedCourseIds, courseId];
      }
      setCompletedCourseIds(updated);
      await AsyncStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save completed course', err);
    }
  };

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return MATERNAL_COURSES.filter((course) => {
      // Category filter
      if (selectedCategory !== 'all' && course.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const title = course.titleFallback.toLowerCase();
        const desc = course.descriptionFallback.toLowerCase();
        const takeaways = course.keyTakeaways.join(' ').toLowerCase();
        const provider = course.provider.toLowerCase();

        return (
          title.includes(query) ||
          desc.includes(query) ||
          takeaways.includes(query) ||
          provider.includes(query)
        );
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  const totalCourses = MATERNAL_COURSES.length;
  const completedCount = completedCourseIds.length;
  const progressPercent = Math.min(
    100,
    Math.round((completedCount / totalCourses) * 100)
  );

  const categories: { key: CourseCategory; labelKey: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'all', labelKey: 'courses.allCategories', icon: 'grid-outline' },
    { key: 'prenatal', labelKey: 'courses.prenatal', icon: 'woman-outline' },
    { key: 'labor', labelKey: 'courses.labor', icon: 'fitness-outline' },
    { key: 'newborn', labelKey: 'courses.newborn', icon: 'happy-outline' },
    { key: 'danger_signs', labelKey: 'courses.dangerSigns', icon: 'warning-outline' },
    { key: 'postpartum', labelKey: 'courses.postpartum', icon: 'heart-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <SyncBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View style={styles.headerCard}>
          <View style={styles.headerTextRow}>
            <View style={styles.headerTitleColumn}>
              <Text style={styles.screenTitle}>{t('courses.title') || 'Maternal Courses'}</Text>
              <Text style={styles.screenSubtitle}>
                {t('courses.subtitle') ||
                  'Essential video guides & knowledge for a safe pregnancy and newborn care'}
              </Text>
            </View>
            <AudioSpeakerButton
              textToSpeak={`${t('courses.title')}. ${t('courses.subtitle')}`}
              language={language}
              size={28}
              color={COLORS.primary}
            />
          </View>

          {/* LEARNING PROGRESS BAR */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeaderRow}>
              <View style={styles.progressLabelRow}>
                <Ionicons name="school" size={18} color={COLORS.primary} />
                <Text style={styles.progressLabel}>
                  {t('courses.progressLabel') || 'Learning Progress'}
                </Text>
              </View>
              <Text style={styles.progressNumbers}>
                {completedCount} / {totalCourses}{' '}
                <Text style={styles.progressPercentText}>({progressPercent}%)</Text>
              </Text>
            </View>

            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.max(progressPercent, 4)}%` },
                ]}
              />
            </View>

            <Text style={styles.progressEncouragement}>
              {completedCount === 0
                ? 'Start your first course to build vital knowledge for you and your baby!'
                : completedCount === totalCourses
                ? '🌟 Amazing! You have completed all maternal health courses!'
                : `Keep going! ${totalCourses - completedCount} more lessons to complete.`}
            </Text>
          </View>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={
              t('courses.searchPlaceholder') || 'Search courses, nutrition, labor signs...'
            }
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* CATEGORY FILTER CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat.key)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={cat.icon}
                  size={16}
                  color={isSelected ? '#FFFFFF' : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && styles.categoryChipTextActive,
                  ]}
                >
                  {t(cat.labelKey as any) || cat.key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* COURSE LIST */}
        {filteredCourses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="videocam-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>
              {t('courses.emptySearch') || 'No courses found matching your search'}
            </Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              <Text style={styles.resetButtonText}>View All Courses</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredCourses.map((course) => (
            <CourseVideoCard
              key={course.id}
              course={course}
              isCompleted={completedCourseIds.includes(course.id)}
              onToggleComplete={handleToggleComplete}
              isPlaying={activePlayingId === course.id}
              onPlayPress={() => setActivePlayingId(course.id)}
              onStopPlay={() => setActivePlayingId(null)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  headerTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headerTitleColumn: {
    flex: 1,
    paddingRight: 12,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  progressCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: 14,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  progressNumbers: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  progressPercentText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(216, 27, 96, 0.15)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressEncouragement: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  clearSearchBtn: {
    padding: 4,
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  resetButtonText: {
    color: COLORS.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
});
