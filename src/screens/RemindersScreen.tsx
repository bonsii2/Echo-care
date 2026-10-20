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
import { COLORS } from '../constants/colors';
import { AudioSpeakerButton } from '../components/AudioSpeakerButton';
import { VoiceService } from '../services/voiceService';

export const RemindersScreen: React.FC = () => {
  const { t } = useLanguage();

  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const toggleComplete = (id: string) => {
    if (completedItems.includes(id)) {
      setCompletedItems(completedItems.filter((i) => i !== id));
    } else {
      setCompletedItems([...completedItems, id]);
      VoiceService.speakText('Reminder completed', 'en');
    }
  };

  const REMINDERS = [
    {
      id: 'r1',
      title: t('reminders.supplements'),
      time: 'Daily • 8:00 AM',
      category: 'medication',
      icon: 'medkit',
      color: COLORS.primary,
      audioText: 'Take 1 Iron tablet with clean water after eating.',
    },
    {
      id: 'r2',
      title: t('reminders.ancVisits'),
      time: 'Next Visit: Next Tuesday',
      category: 'anc',
      icon: 'calendar',
      color: COLORS.secondary,
      audioText: 'Your 3rd Antenatal Care checkup is scheduled at the Health Post next Tuesday.',
    },
    {
      id: 'r3',
      title: t('reminders.vaccination'),
      time: 'Tetanus TT2 Due in 2 weeks',
      category: 'vaccine',
      icon: 'shield-checkmark',
      color: COLORS.accent,
      audioText: 'Tetanus vaccination protects you and your newborn from infection.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerCard}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>{t('reminders.title')}</Text>
            <AudioSpeakerButton size={28} color={COLORS.primary} />
          </View>
          <Text style={styles.headerSubtitle}>Offline Audio Reminders & Schedules</Text>
        </View>

        <View style={styles.reminderList}>
          {REMINDERS.map((item) => {
            const isDone = completedItems.includes(item.id);
            return (
              <View key={item.id} style={[styles.reminderCard, isDone && styles.reminderCardDone]}>
                <View style={[styles.iconCircle, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon as any} size={28} color={item.color} />
                </View>

                <View style={styles.textColumn}>
                  <Text style={[styles.itemTitle, isDone && styles.itemTitleDone]}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemTime}>{item.time}</Text>

                  <View style={styles.audioPromptRow}>
                    <AudioSpeakerButton textToSpeak={item.audioText} size={20} color={item.color} />
                    <Text style={styles.audioPromptText}>Listen Instruction</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.checkButton, isDone && styles.checkButtonDone]}
                  onPress={() => toggleComplete(item.id)}
                >
                  <Ionicons
                    name={isDone ? 'checkmark-circle' : 'ellipse-outline'}
                    size={32}
                    color={isDone ? COLORS.success : COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
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
    paddingBottom: 30,
  },
  headerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  reminderList: {
    gap: 14,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    gap: 14,
  },
  reminderCardDone: {
    opacity: 0.65,
    backgroundColor: COLORS.background,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  itemTitleDone: {
    textDecorationLine: 'line-through',
  },
  itemTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginVertical: 2,
  },
  audioPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  audioPromptText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  checkButton: {
    padding: 4,
  },
  checkButtonDone: {},
});
