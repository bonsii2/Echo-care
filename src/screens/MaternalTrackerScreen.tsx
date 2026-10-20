import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { useSync } from '../context/SyncContext';
import { StorageService } from '../services/storage';
import { SymptomLog } from '../types';
import { COLORS } from '../constants/colors';
import { AudioSpeakerButton } from '../components/AudioSpeakerButton';
import { RedFlagAlertModal } from '../components/RedFlagAlertModal';

export const MaternalTrackerScreen: React.FC = () => {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const { status, triggerManualSync } = useSync();

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [logs, setLogs] = useState<SymptomLog[]>([]);
  const [showRedFlagModal, setShowRedFlagModal] = useState(false);
  const [redFlagMessage, setRedFlagMessage] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const data = await StorageService.getSymptomLogs();
    setLogs(data);
  };

  const SYMPTOM_OPTIONS = [
    { id: 'headache', icon: 'headset-outline', name: t('tracker.headache'), isRedFlag: true },
    { id: 'bleeding', icon: 'water-outline', name: t('tracker.bleeding'), isRedFlag: true },
    { id: 'fever', icon: 'thermometer-outline', name: t('tracker.fever'), isRedFlag: true },
    { id: 'swelling', icon: 'body-outline', name: t('tracker.swelling'), isRedFlag: true },
    { id: 'movement', icon: 'pulse-outline', name: t('tracker.movement'), isRedFlag: true },
    { id: 'nausea', icon: 'restaurant-outline', name: t('tracker.nausea'), isRedFlag: false },
    { id: 'fatigue', icon: 'bed-outline', name: t('tracker.fatigue'), isRedFlag: false },
  ];

  const toggleSymptom = (id: string, isRedFlag: boolean, name: string) => {
    let next: string[];
    if (selectedSymptoms.includes(id)) {
      next = selectedSymptoms.filter((s) => s !== id);
    } else {
      next = [...selectedSymptoms, id];
      if (isRedFlag) {
        setRedFlagMessage(`${name}: Immediate health worker consultation recommended!`);
        setShowRedFlagModal(true);
      }
    }
    setSelectedSymptoms(next);
  };

  const handleSaveLog = async () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('Select Symptom', 'Please tap at least one symptom to log.');
      return;
    }

    const hasRedFlag = selectedSymptoms.some((id) =>
      SYMPTOM_OPTIONS.find((opt) => opt.id === id)?.isRedFlag
    );

    const newLog: SymptomLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      symptoms: selectedSymptoms,
      severity: hasRedFlag ? 'severe' : 'mild',
      isRedFlag: hasRedFlag,
      synced: status.isOnline,
    };

    const updated = await StorageService.saveSymptomLog(newLog);
    setLogs(updated);
    setSelectedSymptoms([]);

    if (status.isOnline) {
      await triggerManualSync();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tracker Header */}
        <View style={styles.headerCard}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>{t('tracker.title')}</Text>
            <AudioSpeakerButton size={28} color={COLORS.primary} />
          </View>
          <Text style={styles.headerSubtitle}>
            {profile.stage === 'pregnant'
              ? `Week ${profile.pregnancyWeek} Timeline`
              : `Postpartum Month ${profile.postpartumMonth || 1}`}
          </Text>
        </View>

        {/* Visual Symptom Logger Grid */}
        <Text style={styles.sectionTitle}>{t('tracker.logSymptomTitle')}</Text>
        <View style={styles.symptomGrid}>
          {SYMPTOM_OPTIONS.map((item) => {
            const isSelected = selectedSymptoms.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={[
                  styles.symptomTile,
                  isSelected && styles.symptomTileSelected,
                  item.isRedFlag && styles.symptomTileRedFlag,
                ]}
                onPress={() => toggleSymptom(item.id, item.isRedFlag, item.name)}
              >
                {item.isRedFlag && (
                  <View style={styles.redBadge}>
                    <Text style={styles.redBadgeText}>!</Text>
                  </View>
                )}
                <Ionicons
                  name={item.icon as any}
                  size={32}
                  color={
                    isSelected
                      ? '#FFFFFF'
                      : item.isRedFlag
                      ? COLORS.danger
                      : COLORS.primary
                  }
                />
                <Text
                  style={[
                    styles.symptomTileText,
                    isSelected && styles.symptomTileTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Save Log Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            selectedSymptoms.length === 0 && styles.saveButtonDisabled,
          ]}
          disabled={selectedSymptoms.length === 0}
          onPress={handleSaveLog}
        >
          <Ionicons name="save" size={22} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>{t('tracker.saveLog')}</Text>
        </TouchableOpacity>

        {/* Recent Symptom History List */}
        <Text style={styles.sectionTitle}>Symptom History & Logs</Text>
        {logs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="document-text-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No symptoms logged yet today.</Text>
          </View>
        ) : (
          logs.map((log) => (
            <View key={log.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDate}>{log.date}</Text>
                <View
                  style={[
                    styles.syncPill,
                    log.synced ? styles.syncPillDone : styles.syncPillPending,
                  ]}
                >
                  <Text style={styles.syncPillText}>
                    {log.synced ? 'Synced' : 'Pending Sync'}
                  </Text>
                </View>
              </View>
              <Text style={styles.historySymptoms}>
                Logged: {log.symptoms.join(', ')}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <RedFlagAlertModal
        visible={showRedFlagModal}
        onClose={() => setShowRedFlagModal(false)}
        customMessage={redFlagMessage}
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
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  symptomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  symptomTile: {
    width: '47%',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    gap: 8,
    elevation: 2,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  symptomTileRedFlag: {
    borderColor: COLORS.dangerLight,
  },
  symptomTileSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  redBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  symptomTileText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  symptomTileTextSelected: {
    color: '#FFFFFF',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginBottom: 24,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
  historyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  syncPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  syncPillDone: {
    backgroundColor: COLORS.successLight,
  },
  syncPillPending: {
    backgroundColor: COLORS.accentLight,
  },
  syncPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  historySymptoms: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
