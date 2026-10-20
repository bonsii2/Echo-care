import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { useSync } from '../context/SyncContext';
import { StorageService } from '../services/storage';
import { VoiceService } from '../services/voiceService';
import { HEWReport } from '../types';
import { COLORS } from '../constants/colors';
import { AudioSpeakerButton } from '../components/AudioSpeakerButton';

export const HEWCommunicationScreen: React.FC = () => {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const { status, triggerManualSync } = useSync();

  const [isRecordingNote, setIsRecordingNote] = useState(false);
  const [reports, setReports] = useState<HEWReport[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const data = await StorageService.getHEWReports();
    setReports(data);
  };

  const handleDirectCall = () => {
    if (profile.hewPhone) {
      Linking.openURL(`tel:${profile.hewPhone}`);
    } else {
      Linking.openURL(`tel:952`);
    }
  };

  const handleToggleVoiceNote = async () => {
    if (isRecordingNote) {
      setIsRecordingNote(false);
      // Save voice note report
      const newReport: HEWReport = {
        id: Date.now().toString(),
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        motherName: profile.name,
        location: profile.woredaLocation,
        summary: 'Voice audio message recorded by mother',
        symptoms: ['Voice Note'],
        isEmergency: false,
        status: status.isOnline ? 'sent' : 'pending',
        voiceNoteDuration: 5,
      };
      const updated = await StorageService.saveHEWReport(newReport);
      setReports(updated);

      if (status.isOnline) {
        await triggerManualSync();
      }

      Alert.alert(
        status.isOnline ? 'Voice Message Sent' : 'Queued Offline',
        status.isOnline
          ? `Your voice message has been dispatched to ${profile.hewName}.`
          : 'Saved locally. Message will send automatically when phone connects to mobile network.'
      );
    } else {
      await VoiceService.startRecording();
      setIsRecordingNote(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEW Worker Profile Card */}
        <View style={styles.hewProfileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="medical" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.hewInfoColumn}>
            <Text style={styles.hewTitle}>{t('hew.title')}</Text>
            <Text style={styles.hewName}>{profile.hewName}</Text>
            <Text style={styles.hewSubtext}>
              {profile.woredaLocation} • {profile.hewPhone}
            </Text>
          </View>
          <AudioSpeakerButton size={24} color={COLORS.secondary} />
        </View>

        {/* 1-TAP EMERGENCY SOS CALL BUTTON */}
        <TouchableOpacity style={styles.sosButton} onPress={handleDirectCall}>
          <Ionicons name="call" size={28} color="#FFFFFF" />
          <View style={styles.sosTextCol}>
            <Text style={styles.sosTitle}>{t('home.callHew')}</Text>
            <Text style={styles.sosSub}>Tap to call {profile.hewName} directly</Text>
          </View>
        </TouchableOpacity>

        {/* VOICE NOTE TO HEW RECORDER */}
        <View style={styles.voiceNoteBox}>
          <Text style={styles.boxTitle}>{t('hew.sendVoiceNote')}</Text>
          <Text style={styles.boxSubtitle}>
            Speak your message in your local language if typing is difficult.
          </Text>

          <TouchableOpacity
            style={[
              styles.recordBtn,
              isRecordingNote && styles.recordBtnActive,
            ]}
            onPress={handleToggleVoiceNote}
          >
            <Ionicons
              name={isRecordingNote ? 'square' : 'mic'}
              size={28}
              color="#FFFFFF"
            />
            <Text style={styles.recordBtnText}>
              {isRecordingNote ? 'Stop & Send Note' : t('hew.recordVoiceNote')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* SENT / QUEUED REPORTS */}
        <Text style={styles.sectionTitle}>{t('hew.sentReports')}</Text>
        {reports.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="cloud-upload-outline" size={36} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No messages queued or sent yet.</Text>
          </View>
        ) : (
          reports.map((item) => (
            <View key={item.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <Ionicons name="mic-circle" size={24} color={COLORS.primary} />
                <Text style={styles.reportSummary}>{item.summary}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'sent'
                      ? styles.badgeSent
                      : styles.badgePending,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {item.status === 'sent' ? 'Sent' : 'Offline Queue'}
                  </Text>
                </View>
              </View>
              <Text style={styles.reportTime}>Time: {item.createdAt}</Text>
            </View>
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
    paddingBottom: 30,
  },
  hewProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    gap: 14,
    elevation: 2,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hewInfoColumn: {
    flex: 1,
  },
  hewTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  hewName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  hewSubtext: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.danger,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    gap: 14,
    elevation: 4,
  },
  sosTextCol: {
    flex: 1,
  },
  sosTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sosSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },
  voiceNoteBox: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  boxSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    gap: 10,
  },
  recordBtnActive: {
    backgroundColor: COLORS.danger,
  },
  recordBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  reportCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportSummary: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeSent: {
    backgroundColor: COLORS.successLight,
  },
  badgePending: {
    backgroundColor: COLORS.accentLight,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reportTime: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    marginLeft: 32,
  },
});
