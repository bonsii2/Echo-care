import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { LANGUAGES } from '../services/i18n';
import { LanguageCode } from '../types';
import { COLORS } from '../constants/colors';
import { AudioSpeakerButton } from '../components/AudioSpeakerButton';

export const OnboardingScreen: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { updateProfile } = useProfile();

  const [step, setStep] = useState<'language' | 'profile'>('language');
  const [name, setName] = useState('');
  const [stage, setStage] = useState<'pregnant' | 'postpartum'>('pregnant');
  const [pregnancyWeek, setPregnancyWeek] = useState('24');
  const [woredaLocation, setWoredaLocation] = useState('Jimma Zone');
  const [hewName, setHewName] = useState('Chaltu Bekele');
  const [hewPhone, setHewPhone] = useState('+251911223344');

  const handleLanguageSelect = async (code: LanguageCode) => {
    await setLanguage(code);
  };

  const handleCompleteOnboarding = async () => {
    await updateProfile({
      name: name.trim() || 'Mother',
      language,
      stage,
      pregnancyWeek: parseInt(pregnancyWeek) || 24,
      woredaLocation,
      hewName,
      hewPhone,
      isOnboarded: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Branding */}
        <View style={styles.brandHeader}>
          <View style={styles.iconCircle}>
            <Ionicons name="fitness" size={42} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>{t('appName')}</Text>
          <Text style={styles.appTagline}>{t('appTagline')}</Text>
        </View>

        {step === 'language' ? (
          <View style={styles.stepCard}>
            <View style={styles.stepTitleRow}>
              <Text style={styles.stepTitle}>{t('onboarding.selectLanguage')}</Text>
              <AudioSpeakerButton size={24} color={COLORS.primary} />
            </View>

            <View style={styles.languageList}>
              {LANGUAGES.map((item) => {
                const isSelected = language === item.code;
                return (
                  <TouchableOpacity
                    key={item.code}
                    activeOpacity={0.8}
                    style={[
                      styles.langCard,
                      isSelected && styles.langCardSelected,
                    ]}
                    onPress={() => handleLanguageSelect(item.code)}
                  >
                    <Text style={styles.flag}>{item.flag}</Text>
                    <View style={styles.langTextColumn}>
                      <Text
                        style={[
                          styles.langNative,
                          isSelected && styles.langNativeSelected,
                        ]}
                      >
                        {item.nativeName}
                      </Text>
                      <Text style={styles.langName}>{item.name}</Text>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={28}
                        color={COLORS.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setStep('profile')}
            >
              <Text style={styles.primaryButtonText}>{t('onboarding.continue')}</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>{t('onboarding.title')}</Text>

            {/* Mother's Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t('onboarding.enterName')}</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Chaltu / Aster"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            {/* Stage Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t('onboarding.selectStage')}</Text>
              <View style={styles.stageToggleRow}>
                <TouchableOpacity
                  style={[
                    styles.stageChip,
                    stage === 'pregnant' && styles.stageChipSelected,
                  ]}
                  onPress={() => setStage('pregnant')}
                >
                  <Ionicons
                    name="woman"
                    size={22}
                    color={stage === 'pregnant' ? '#FFFFFF' : COLORS.textPrimary}
                  />
                  <Text
                    style={[
                      styles.stageChipText,
                      stage === 'pregnant' && styles.stageChipTextSelected,
                    ]}
                  >
                    {t('onboarding.pregnant')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.stageChip,
                    stage === 'postpartum' && styles.stageChipSelected,
                  ]}
                  onPress={() => setStage('postpartum')}
                >
                  <Ionicons
                    name="body"
                    size={22}
                    color={stage === 'postpartum' ? '#FFFFFF' : COLORS.textPrimary}
                  />
                  <Text
                    style={[
                      styles.stageChipText,
                      stage === 'postpartum' && styles.stageChipTextSelected,
                    ]}
                  >
                    {t('onboarding.postpartum')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Week or Month */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {stage === 'pregnant'
                  ? t('onboarding.pregnancyWeek')
                  : t('onboarding.postpartumMonth')}
              </Text>
              <TextInput
                style={styles.input}
                value={pregnancyWeek}
                onChangeText={setPregnancyWeek}
                keyboardType="numeric"
              />
            </View>

            {/* Woreda Location */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t('onboarding.selectWoreda')}</Text>
              <TextInput
                style={styles.input}
                value={woredaLocation}
                onChangeText={setWoredaLocation}
              />
            </View>

            {/* HEW Info */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t('onboarding.hewName')}</Text>
              <TextInput
                style={styles.input}
                value={hewName}
                onChangeText={setHewName}
              />
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleCompleteOnboarding}
            >
              <Text style={styles.primaryButtonText}>{t('onboarding.getStarted')}</Text>
              <Ionicons name="checkmark-done" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
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
    padding: 20,
    paddingBottom: 40,
  },
  brandHeader: {
    alignItems: 'center',
    marginVertical: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primary,
  },
  appTagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  stepCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  languageList: {
    gap: 12,
    marginBottom: 20,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  langCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  flag: {
    fontSize: 28,
    marginRight: 14,
  },
  langTextColumn: {
    flex: 1,
  },
  langNative: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  langNativeSelected: {
    color: COLORS.primary,
  },
  langName: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  stageToggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stageChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    gap: 8,
  },
  stageChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stageChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  stageChipTextSelected: {
    color: '#FFFFFF',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
