import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { AudioSpeakerButton } from './AudioSpeakerButton';

interface RedFlagAlertModalProps {
  visible: boolean;
  onClose: () => void;
  symptomName?: string;
  customMessage?: string;
}

export const RedFlagAlertModal: React.FC<RedFlagAlertModalProps> = ({
  visible,
  onClose,
  symptomName,
  customMessage,
}) => {
  const { t } = useLanguage();
  const { profile } = useProfile();

  const handleCallHew = () => {
    if (profile.hewPhone) {
      Linking.openURL(`tel:${profile.hewPhone}`);
    } else {
      Linking.openURL(`tel:952`); // Emergency health triage number
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerIcon}>
            <Ionicons name="alert-circle" size={54} color={COLORS.danger} />
          </View>

          <Text style={styles.title}>{t('home.redFlagAlert')}</Text>

          {symptomName && <Text style={styles.symptomBadge}>{symptomName}</Text>}

          <Text style={styles.warningMessage}>
            {customMessage || t('voice.urgentWarning')}
          </Text>

          <View style={styles.audioRow}>
            <AudioSpeakerButton size={32} color={COLORS.danger} />
            <Text style={styles.audioHint}>Hear warning in your language</Text>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.callButton} onPress={handleCallHew}>
              <Ionicons name="call" size={24} color="#FFFFFF" />
              <Text style={styles.callButtonText}>
                {t('home.callHew')}: {profile.hewName || 'HEW'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dismissButton} onPress={onClose}>
              <Text style={styles.dismissText}>Close Alert</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: 8,
  },
  symptomBadge: {
    backgroundColor: COLORS.dangerLight,
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  warningMessage: {
    fontSize: 15,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
    marginBottom: 20,
  },
  audioHint: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.danger,
  },
  actionContainer: {
    width: '100%',
    gap: 12,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    elevation: 4,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dismissButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  dismissText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
