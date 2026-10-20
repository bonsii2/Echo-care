import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { COLORS } from '../constants/colors';
import { SyncBanner } from '../components/SyncBanner';
import { AudioSpeakerButton } from '../components/AudioSpeakerButton';
import { RedFlagAlertModal } from '../components/RedFlagAlertModal';
import { VoiceMicButton } from '../components/VoiceMicButton';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const [showRedFlagModal, setShowRedFlagModal] = useState(false);

  const navigateToVoice = () => {
    navigation.navigate('VoiceTab');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <SyncBanner />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome Header */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextRow}>
            <View>
              <Text style={styles.greetingTitle}>
                {t('home.greeting')} {profile.name}!
              </Text>
              <Text style={styles.welcomeSubtitle}>{t('welcome')}</Text>
            </View>
            <AudioSpeakerButton size={30} color={COLORS.primary} />
          </View>
        </View>

        {/* HERO VOICE FIRST ACTION BANNER */}
        <View style={styles.heroVoiceCard}>
          <Text style={styles.heroTitle}>{t('voice.title')}</Text>
          <Text style={styles.heroSubtitle}>{t('home.heroSubtitle')}</Text>

          <VoiceMicButton
            isRecording={false}
            isProcessing={false}
            isPlayingAudio={false}
            onPress={navigateToVoice}
            size={90}
          />

          <TouchableOpacity style={styles.speakButton} onPress={navigateToVoice}>
            <Ionicons name="mic" size={20} color="#FFFFFF" />
            <Text style={styles.speakButtonText}>{t('home.tapToSpeak')}</Text>
          </TouchableOpacity>
        </View>

        {/* Pregnancy Stage Progress Card */}
        <View style={styles.stageCard}>
          <View style={styles.stageIconCircle}>
            <Ionicons
              name={profile.stage === 'pregnant' ? 'woman' : 'body'}
              size={32}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.stageTextColumn}>
            <Text style={styles.stageLabel}>
              {profile.stage === 'pregnant'
                ? t('home.currentWeek')
                : t('home.postpartumStage')}
            </Text>
            <Text style={styles.stageValue}>
              {profile.stage === 'pregnant'
                ? `Week ${profile.pregnancyWeek} of 40`
                : `Month ${profile.postpartumMonth || 2} of 12`}
            </Text>
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
              <Text style={styles.statusBadgeText}>{t('home.statusGood')}</Text>
            </View>
          </View>
        </View>

        {/* URGENT EMERGENCY RED FLAG TRIGGER */}
        <TouchableOpacity
          style={styles.redFlagAlertButton}
          activeOpacity={0.85}
          onPress={() => setShowRedFlagModal(true)}
        >
          <Ionicons name="warning" size={28} color="#FFFFFF" />
          <View style={styles.redFlagTextColumn}>
            <Text style={styles.redFlagTitle}>{t('home.redFlagAlert')}</Text>
            <Text style={styles.redFlagSubtitle}>Bleeding, Severe Headache, Reduced Kicks</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* COURSES SPOTLIGHT BANNER */}
        <TouchableOpacity
          style={styles.courseBannerCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('CoursesTab')}
        >
          <View style={styles.courseBannerLeft}>
            <View style={styles.courseTagRow}>
              <View style={styles.courseLiveBadge}>
                <Ionicons name="logo-youtube" size={11} color="#FFFFFF" />
                <Text style={styles.courseLiveText}>YOUTUBE COURSES</Text>
              </View>
              <Text style={styles.courseCategoryLabel}>8 Video Lessons</Text>
            </View>
            <Text style={styles.courseBannerTitle}>
              {t('courses.title') || 'Maternal Video Courses'}
            </Text>
            <Text style={styles.courseBannerSubtitle} numberOfLines={2}>
              {t('courses.subtitle') ||
                'Watch & listen to vital advice on childbirth, nutrition & newborn care.'}
            </Text>
            <View style={styles.courseBannerBtn}>
              <Text style={styles.courseBannerBtnText}>Start Learning</Text>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.courseBannerIconCircle}>
            <Ionicons name="school" size={32} color={COLORS.primary} />
          </View>
        </TouchableOpacity>

        {/* QUICK ACCESSIBLE ACTIONS */}
        <Text style={styles.sectionHeader}>{t('home.quickActions')}</Text>
        <View style={styles.quickGrid}>
          {/* Row 1 */}
          <View style={styles.quickRow}>
            {/* Action 1: Symptom Tracker */}
            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => navigation.navigate('TrackerTab')}
            >
              <View style={[styles.gridIconCircle, { backgroundColor: COLORS.secondaryLight }]}>
                <Ionicons name="heart" size={28} color={COLORS.secondary} />
              </View>
              <Text style={styles.gridCardTitle}>{t('home.logSymptom')}</Text>
            </TouchableOpacity>

            {/* Action 2: Video Courses */}
            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => navigation.navigate('CoursesTab')}
            >
              <View style={[styles.gridIconCircle, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="play-circle" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.gridCardTitle}>{t('home.maternalCourses') || 'Video Courses'}</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2 */}
          <View style={styles.quickRow}>
            {/* Action 3: ANC & Reminders */}
            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => navigation.navigate('RemindersTab')}
            >
              <View style={[styles.gridIconCircle, { backgroundColor: COLORS.accentLight }]}>
                <Ionicons name="alarm" size={28} color={COLORS.accent} />
              </View>
              <Text style={styles.gridCardTitle}>{t('home.ancReminders')}</Text>
            </TouchableOpacity>

            {/* Action 4: HEW Contact */}
            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => navigation.navigate('HewTab')}
            >
              <View style={[styles.gridIconCircle, { backgroundColor: '#EDE7F6' }]}>
                <Ionicons name="call" size={28} color="#5E35B1" />
              </View>
              <Text style={styles.gridCardTitle}>{t('home.callHew')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <RedFlagAlertModal
        visible={showRedFlagModal}
        onClose={() => setShowRedFlagModal(false)}
      />
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
    paddingBottom: 30,
  },
  welcomeCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  welcomeTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  heroVoiceCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
    marginTop: 8,
  },
  speakButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  stageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    gap: 16,
  },
  stageIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageTextColumn: {
    flex: 1,
  },
  stageLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  stageValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginVertical: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.success,
  },
  redFlagAlertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.danger,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    gap: 12,
    elevation: 4,
  },
  redFlagTextColumn: {
    flex: 1,
  },
  redFlagTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  redFlagSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
  },
  courseBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD1DC',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  courseBannerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  courseTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  courseLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  courseLiveText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  courseCategoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  courseBannerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  courseBannerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginBottom: 10,
  },
  courseBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    gap: 6,
  },
  courseBannerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  courseBannerIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  quickGrid: {
    gap: 12,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gridIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  gridCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
});

