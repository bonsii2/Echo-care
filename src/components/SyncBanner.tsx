import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSync } from '../context/SyncContext';
import { useLanguage } from '../context/LanguageContext';
import { COLORS } from '../constants/colors';

export const SyncBanner: React.FC = () => {
  const { status, toggleNetworkStatus, triggerManualSync } = useSync();
  const { t } = useLanguage();

  const pendingCount = status.pendingLogsCount + status.pendingReportsCount;

  return (
    <View style={[styles.container, { backgroundColor: status.isOnline ? COLORS.secondaryLight : COLORS.accentLight }]}>
      <View style={styles.leftInfo}>
        <Ionicons
          name={status.isOnline ? 'wifi' : 'wifi-outline'}
          size={20}
          color={status.isOnline ? COLORS.secondary : COLORS.warning}
        />
        <View style={styles.textColumn}>
          <Text style={[styles.statusTitle, { color: status.isOnline ? COLORS.secondary : COLORS.warning }]}>
            {status.isOnline ? t('home.syncReady') : t('home.pendingSync')}
          </Text>
          {pendingCount > 0 && (
            <Text style={styles.pendingSubtext}>
              {pendingCount} items waiting to sync
            </Text>
          )}
        </View>
      </View>

      <View style={styles.rightActions}>
        {status.isOnline && pendingCount > 0 && (
          <TouchableOpacity style={styles.syncBtn} onPress={triggerManualSync}>
            <Ionicons name="sync" size={16} color="#FFFFFF" />
            <Text style={styles.syncBtnText}>Sync</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.toggleBtn} onPress={toggleNetworkStatus}>
          <Text style={styles.toggleText}>
            {status.isOnline ? 'Simulate Offline' : 'Go Online'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textColumn: {
    flexDirection: 'column',
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  pendingSubtext: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  syncBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
