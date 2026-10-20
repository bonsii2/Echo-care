import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { MaternalCourse } from '../types';
import { COLORS } from '../constants/colors';
import { useLanguage } from '../context/LanguageContext';
import { AudioSpeakerButton } from './AudioSpeakerButton';

interface CourseVideoCardProps {
  course: MaternalCourse;
  isCompleted: boolean;
  onToggleComplete: (courseId: string) => void;
  isPlaying: boolean;
  onPlayPress: () => void;
  onStopPlay: () => void;
}

export const CourseVideoCard: React.FC<CourseVideoCardProps> = ({
  course,
  isCompleted,
  onToggleComplete,
  isPlaying,
  onPlayPress,
  onStopPlay,
}) => {
  const { t, language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const openInYouTube = async () => {
    const webUrl = `https://www.youtube.com/watch?v=${course.youtubeId}`;
    const appUrl = `vnd.youtube://${course.youtubeId}`;

    try {
      const canOpenApp = await Linking.canOpenURL(appUrl);
      if (canOpenApp && Platform.OS !== 'web') {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch {
      await Linking.openURL(webUrl);
    }
  };

  const categoryColorMap: Record<string, { bg: string; text: string }> = {
    prenatal: { bg: COLORS.primaryLight, text: COLORS.primaryDark },
    labor: { bg: COLORS.accentLight, text: COLORS.accent },
    newborn: { bg: COLORS.secondaryLight, text: COLORS.secondary },
    danger_signs: { bg: COLORS.dangerLight, text: COLORS.danger },
    postpartum: { bg: '#EDE7F6', text: '#5E35B1' },
    nutrition: { bg: COLORS.successLight, text: COLORS.success },
    all: { bg: COLORS.divider, text: COLORS.textSecondary },
  };

  const catStyle = categoryColorMap[course.category] || categoryColorMap.all;

  // Localized text or fallback
  const translatedTitle = t(`courses.${course.id}Title` as any) !== `courses.${course.id}Title`
    ? t(`courses.${course.id}Title` as any)
    : course.titleFallback;

  const translatedDesc = t(`courses.${course.id}Desc` as any) !== `courses.${course.id}Desc`
    ? t(`courses.${course.id}Desc` as any)
    : course.descriptionFallback;

  const audioSummaryText = course.audioSummary[language] || course.audioSummary.en;

  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      {/* CARD TOP INFO ROW */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.categoryBadge, { backgroundColor: catStyle.bg }]}>
            <Text style={[styles.categoryBadgeText, { color: catStyle.text }]}>
              {t(`courses.${course.category === 'danger_signs' ? 'dangerSigns' : course.category}` as any) ||
                course.category.toUpperCase()}
            </Text>
          </View>

          <View style={styles.providerRow}>
            <Ionicons name="shield-checkmark" size={13} color={COLORS.secondary} />
            <Text style={styles.providerText} numberOfLines={1}>
              {course.provider}
            </Text>
          </View>
        </View>

        {/* Audio Speaker for voice read-aloud */}
        <View style={styles.headerRight}>
          <AudioSpeakerButton
            textToSpeak={`${translatedTitle}. ${audioSummaryText}`}
            language={language}
            size={22}
            color={COLORS.primary}
          />
        </View>
      </View>

      {/* VIDEO / THUMBNAIL CONTAINER */}
      <View style={styles.mediaContainer}>
        {isPlaying ? (
          <View style={styles.playerWrapper}>
            <YoutubePlayer
              height={220}
              play={true}
              videoId={course.youtubeId}
              onError={() => {
                setVideoError(true);
                Alert.alert(
                  'Video Playback',
                  t('courses.videoError') || 'Could not load embedded video. Open in YouTube app?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open YouTube', onPress: openInYouTube },
                  ]
                );
              }}
              webViewProps={{
                allowsInlineMediaPlayback: true,
                mediaPlaybackRequiresUserAction: false,
              }}
            />
            <TouchableOpacity
              style={styles.closePlayerBar}
              onPress={onStopPlay}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle" size={18} color="#FFFFFF" />
              <Text style={styles.closePlayerText}>
                {t('courses.closeVideo') || 'Close Player'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.thumbnailTouch}
            activeOpacity={0.9}
            onPress={onPlayPress}
          >
            <Image
              source={{ uri: course.thumbnailUrl }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            {/* Play Button Overlay */}
            <View style={styles.playOverlay}>
              <View style={styles.playButtonCircle}>
                <Ionicons name="play" size={28} color="#FFFFFF" style={{ marginLeft: 3 }} />
              </View>
            </View>

            {/* Duration Badge */}
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={12} color="#FFFFFF" />
              <Text style={styles.durationText}>{course.duration}</Text>
            </View>

            {/* YouTube watermark indicator */}
            <View style={styles.youtubeWatermark}>
              <Ionicons name="logo-youtube" size={14} color="#FF0000" />
              <Text style={styles.youtubeWatermarkText}>YouTube</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* CARD CONTENT */}
      <View style={styles.cardBody}>
        <Text style={styles.title}>{translatedTitle}</Text>

        <Text
          style={styles.description}
          numberOfLines={isExpanded ? undefined : 2}
        >
          {translatedDesc}
        </Text>

        {translatedDesc.length > 90 && (
          <TouchableOpacity
            style={styles.expandToggle}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Text style={styles.expandToggleText}>
              {isExpanded ? 'Show Less' : 'Read More...'}
            </Text>
          </TouchableOpacity>
        )}

        {/* KEY MATERNAL ADVICE BULLETS */}
        <View style={styles.takeawaysBox}>
          <View style={styles.takeawaysHeader}>
            <Ionicons name="bulb-outline" size={16} color={COLORS.accent} />
            <Text style={styles.takeawaysTitle}>
              {t('courses.keyAdvice') || 'Key Maternal Takeaways'}
            </Text>
          </View>

          {course.keyTakeaways.map((point, index) => (
            <View key={index} style={styles.takeawayItem}>
              <Ionicons
                name="checkmark-circle-outline"
                size={14}
                color={COLORS.secondary}
                style={{ marginTop: 2 }}
              />
              <Text style={styles.takeawayText}>{point}</Text>
            </View>
          ))}
        </View>

        {/* ACTION BUTTONS ROW */}
        <View style={styles.actionsRow}>
          {/* Watch / Stop embedded video */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.playActionButton,
              isPlaying && styles.stopActionButton,
            ]}
            onPress={isPlaying ? onStopPlay : onPlayPress}
          >
            <Ionicons
              name={isPlaying ? 'stop-circle' : 'play-circle'}
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.actionButtonText}>
              {isPlaying
                ? t('courses.closeVideo') || 'Close'
                : t('courses.watchVideo') || 'Play Video'}
            </Text>
          </TouchableOpacity>

          {/* Connect & Open on YouTube */}
          <TouchableOpacity
            style={[styles.actionButton, styles.youtubeActionButton]}
            onPress={openInYouTube}
          >
            <Ionicons name="logo-youtube" size={18} color="#FF0000" />
            <Text style={styles.youtubeActionText}>
              {t('courses.watchOnYoutube') || 'YouTube'}
            </Text>
            <Ionicons name="open-outline" size={13} color="#D81B60" />
          </TouchableOpacity>

          {/* Completed / Learned Toggle */}
          <TouchableOpacity
            style={[
              styles.completeButton,
              isCompleted && styles.completeButtonActive,
            ]}
            onPress={() => onToggleComplete(course.id)}
          >
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={20}
              color={isCompleted ? '#FFFFFF' : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.completeButtonText,
                isCompleted && styles.completeButtonTextActive,
              ]}
            >
              {isCompleted
                ? t('courses.completed') || 'Learned'
                : t('courses.markLearned') || 'Mark Done'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardCompleted: {
    borderColor: COLORS.successLight,
    borderWidth: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  headerRight: {
    marginLeft: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  providerText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    maxWidth: 160,
  },
  mediaContainer: {
    width: '100%',
    backgroundColor: '#0F172A',
    overflow: 'hidden',
  },
  playerWrapper: {
    width: '100%',
    backgroundColor: '#000000',
  },
  closePlayerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 8,
    gap: 6,
  },
  closePlayerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  thumbnailTouch: {
    width: '100%',
    height: 195,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(216, 27, 96, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  youtubeWatermark: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  youtubeWatermarkText: {
    color: '#0F172A',
    fontSize: 10,
    fontWeight: '800',
  },
  cardBody: {
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 24,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  expandToggle: {
    marginTop: 4,
    marginBottom: 4,
  },
  expandToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  takeawaysBox: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
  },
  takeawaysHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  takeawaysTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 5,
  },
  takeawayText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
  },
  playActionButton: {
    backgroundColor: COLORS.primary,
  },
  stopActionButton: {
    backgroundColor: COLORS.primaryDark,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  youtubeActionButton: {
    backgroundColor: '#FFF0F3',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  youtubeActionText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: COLORS.divider,
    gap: 5,
    marginLeft: 'auto',
  },
  completeButtonActive: {
    backgroundColor: COLORS.success,
  },
  completeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  completeButtonTextActive: {
    color: '#FFFFFF',
  },
});
