import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotherProfile, SymptomLog, HEWReport, LanguageCode } from '../types';

const KEYS = {
  PROFILE: '@echo_care_profile',
  LANGUAGE: '@echo_care_language',
  SYMPTOM_LOGS: '@echo_care_symptom_logs',
  HEW_REPORTS: '@echo_care_hew_reports',
  OFFLINE_QUEUE: '@echo_care_offline_queue',
};

export const defaultProfile: MotherProfile = {
  name: 'Mother',
  language: 'om',
  stage: 'pregnant',
  pregnancyWeek: 24,
  woredaLocation: 'Jimma Zone, Oromia',
  hewName: "Chaltu Bekele (HEW)",
  hewPhone: "+251911223344",
  emergencyContact: "+251900112233",
  isOnboarded: false,
};

export const StorageService = {
  // Language Persistence
  async saveLanguage(lang: LanguageCode): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
    } catch (e) {
      console.error('Failed to save language', e);
    }
  },

  async getLanguage(): Promise<LanguageCode> {
    try {
      const val = await AsyncStorage.getItem(KEYS.LANGUAGE);
      return (val as LanguageCode) || 'om';
    } catch {
      return 'om';
    }
  },

  // Mother Profile Persistence
  async saveProfile(profile: MotherProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  },

  async getProfile(): Promise<MotherProfile> {
    try {
      const val = await AsyncStorage.getItem(KEYS.PROFILE);
      return val ? JSON.parse(val) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  },

  // Symptom Logs Persistence
  async saveSymptomLog(log: SymptomLog): Promise<SymptomLog[]> {
    try {
      const existing = await this.getSymptomLogs();
      const updated = [log, ...existing];
      await AsyncStorage.setItem(KEYS.SYMPTOM_LOGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save symptom log', e);
      return [];
    }
  },

  async getSymptomLogs(): Promise<SymptomLog[]> {
    try {
      const val = await AsyncStorage.getItem(KEYS.SYMPTOM_LOGS);
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  },

  // HEW Reports Queue
  async saveHEWReport(report: HEWReport): Promise<HEWReport[]> {
    try {
      const existing = await this.getHEWReports();
      const updated = [report, ...existing];
      await AsyncStorage.setItem(KEYS.HEW_REPORTS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save HEW report', e);
      return [];
    }
  },

  async getHEWReports(): Promise<HEWReport[]> {
    try {
      const val = await AsyncStorage.getItem(KEYS.HEW_REPORTS);
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage', e);
    }
  }
};
