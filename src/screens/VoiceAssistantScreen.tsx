import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { COLORS } from '../constants/colors';
import { VoiceMicButton } from '../components/VoiceMicButton';
import { VoiceWaveform } from '../components/VoiceWaveform';
import { AudioSpeakerButton } from '../components/AudioSpeakerButton';
import { RedFlagAlertModal } from '../components/RedFlagAlertModal';
import { VoiceService } from '../services/voiceService';
import { HEALTH_KNOWLEDGE_BASE } from '../constants/healthData';
import { LanguageCode, VoiceQueryResponse } from '../types';
import { LANGUAGES } from '../services/i18n';

export const VoiceAssistantScreen: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  // Text input state for text option
  const [typedQuery, setTypedQuery] = useState('');
  
  // List of generated response cards
  const [responseCards, setResponseCards] = useState<VoiceQueryResponse[]>([]);
  const [showRedFlagModal, setShowRedFlagModal] = useState(false);
  const [latestRedFlagMessage, setLatestRedFlagMessage] = useState<string>('');

  // Recording timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Handle Voice Mic Start/Stop
  const handleStartMic = async () => {
    if (isRecording) {
      await handleProcessQuery();
      return;
    }

    if (isPlayingAudio) {
      await VoiceService.stopAudio();
      setIsPlayingAudio(false);
    }

    const granted = await VoiceService.requestPermissions();
    if (granted) {
      const started = await VoiceService.startRecording();
      if (started) {
        setIsRecording(true);
      }
    }
  };

  // Process Query via Voice, Typed Text, or Preset Question
  const handleProcessQuery = async (presetTopicId?: string, textOverride?: string) => {
    setIsRecording(false);
    setIsProcessing(true);

    const textToProcess = textOverride || typedQuery.trim();

    const res = await VoiceService.stopRecordingAndProcess(
      language,
      presetTopicId,
      textToProcess
    );

    setIsProcessing(false);
    setTypedQuery('');

    // Prepend new response card
    setResponseCards((prev) => [res, ...prev]);

    if (res.isUrgentRedFlag) {
      setLatestRedFlagMessage(res.audioText);
      setShowRedFlagModal(true);
    }

    // Automatically read response text out loud for accessibility
    setIsPlayingAudio(true);
    await VoiceService.speakText(
      res.audioText,
      language,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  const handleCancelRecording = async () => {
    setIsRecording(false);
    setRecordSeconds(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Top Header: Title & Language Switcher */}
      <View style={styles.topHeader}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="sparkles" size={26} color={COLORS.primary} />
          <Text style={styles.headerTitle}>{t('voice.title')}</Text>
          <View style={styles.googleAiBadge}>
            <Ionicons name="logo-google" size={12} color="#FFFFFF" />
            <Text style={styles.googleAiBadgeText}>Google AI</Text>
          </View>
        </View>

        {/* Language Pill Switcher */}
        <View style={styles.langPillContainer}>
          {LANGUAGES.map((item) => (
            <TouchableOpacity
              key={item.code}
              style={[
                styles.langPill,
                language === item.code && styles.langPillActive,
              ]}
              onPress={() => setLanguage(item.code)}
            >
              <Text
                style={[
                  styles.langPillText,
                  language === item.code && styles.langPillTextActive,
                ]}
              >
                {item.code.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Main Voice Mic Hub */}
          <View style={styles.micCard}>
            <Text style={styles.statusBannerText}>
              {isRecording
                ? `${t('voice.listening')} (${recordSeconds}s)`
                : isProcessing
                ? t('voice.processing')
                : isPlayingAudio
                ? t('voice.speaking')
                : t('welcome')}
            </Text>

            {/* Waveform Visualizer */}
            <VoiceWaveform
              isActive={isRecording || isPlayingAudio}
              color={isRecording ? COLORS.danger : COLORS.primary}
            />

            {/* Big Mic Button */}
            <VoiceMicButton
              isRecording={isRecording}
              isProcessing={isProcessing}
              isPlayingAudio={isPlayingAudio}
              onPress={handleStartMic}
              size={96}
            />

            {/* Recording Controls */}
            {isRecording ? (
              <View style={styles.recordingControlsRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelRecording}
                >
                  <Ionicons name="close-circle" size={20} color={COLORS.danger} />
                  <Text style={styles.cancelButtonText}>{t('voice.cancel')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.stopButton}
                  onPress={() => handleProcessQuery()}
                >
                  <Ionicons name="stop-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.stopButtonText}>{t('voice.stop')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.tapPromptText}>{t('home.tapToSpeak')}</Text>
            )}
          </View>

          {/* Text Input Card (Option for typing text) */}
          <View style={styles.textInputCard}>
            <View style={styles.inputHeaderRow}>
              <Ionicons name="create-outline" size={20} color={COLORS.primary} />
              <Text style={styles.inputHeaderTitle}>Or Type Your Health Question</Text>
            </View>
            <View style={styles.inputActionRow}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask about symptoms, nutrition, labor signs..."
                placeholderTextColor={COLORS.textMuted}
                value={typedQuery}
                onChangeText={setTypedQuery}
                onSubmitEditing={() => typedQuery.trim() && handleProcessQuery()}
                returnKeyType="search"
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !typedQuery.trim() && styles.sendButtonDisabled,
                ]}
                disabled={!typedQuery.trim() || isProcessing}
                onPress={() => handleProcessQuery()}
              >
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Pipeline Status Indicator */}
          {(isRecording || isProcessing) && (
            <View style={styles.pipelineBox}>
              <Text style={styles.pipelineTitle}>Google AI Processing Pipeline</Text>
              <View style={styles.pipelineFlowRow}>
                <View style={styles.pipelineNode}>
                  <Ionicons name="mic" size={16} color={COLORS.primary} />
                  <Text style={styles.pipelineNodeText}>Voice / Text</Text>
                </View>
                <Text style={styles.arrow}>→</Text>
                <View style={styles.pipelineNode}>
                  <Ionicons name="logo-google" size={16} color={COLORS.secondary} />
                  <Text style={styles.pipelineNodeText}>Gemini AI</Text>
                </View>
                <Text style={styles.arrow}>→</Text>
                <View style={styles.pipelineNode}>
                  <Ionicons name="card" size={16} color={COLORS.accent} />
                  <Text style={styles.pipelineNodeText}>Card Result</Text>
                </View>
                <Text style={styles.arrow}>→</Text>
                <View style={styles.pipelineNode}>
                  <Ionicons name="volume-high" size={16} color={COLORS.success} />
                  <Text style={styles.pipelineNodeText}>Read Aloud</Text>
                </View>
              </View>
            </View>
          )}

          {/* AI Result Cards List */}
          {responseCards.length > 0 && (
            <View style={styles.cardsSection}>
              <Text style={styles.sectionHeaderTitle}>AI Response Cards</Text>

              {responseCards.map((card, index) => (
                <View
                  key={index}
                  style={[
                    styles.resultCard,
                    card.isUrgentRedFlag && styles.resultCardRedFlag,
                  ]}
                >
                  {/* Card Header */}
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.cardBadge}>
                      <Ionicons name="sparkles" size={14} color={COLORS.primary} />
                      <Text style={styles.cardBadgeText}>Google AI Response</Text>
                    </View>

                    {card.isUrgentRedFlag && (
                      <View style={styles.redFlagBadge}>
                        <Ionicons name="alert-circle" size={14} color="#FFFFFF" />
                        <Text style={styles.redFlagBadgeText}>Urgent Red Flag</Text>
                      </View>
                    )}
                  </View>

                  {/* User Query text in Card */}
                  <View style={styles.queryBox}>
                    <Ionicons name="chatbubble" size={16} color={COLORS.primary} />
                    <Text style={styles.queryBoxText}>"{card.queryText}"</Text>
                  </View>

                  {/* Response Text & Interactive Speaker Icon inside Card */}
                  <View style={styles.responseTextCardContent}>
                    <Text style={styles.cardResponseText}>{card.audioText}</Text>

                    {/* INTERACTIVE SPEAKER BUTTON INSIDE THE CARD */}
                    <View style={styles.cardSpeakerRow}>
                      <View style={styles.listenLabelRow}>
                        <Ionicons name="volume-medium" size={16} color={COLORS.secondary} />
                        <Text style={styles.listenLabelText}>Tap to listen out loud</Text>
                      </View>
                      <AudioSpeakerButton
                        textToSpeak={card.audioText}
                        language={language}
                        size={32}
                        color={COLORS.secondary}
                      />
                    </View>
                  </View>

                  {/* Action Guidance in Card */}
                  {card.suggestedAction && (
                    <View style={styles.actionAdviceBox}>
                      <Ionicons name="medical" size={18} color={COLORS.accent} />
                      <Text style={styles.actionAdviceText}>
                        {card.suggestedAction}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Predefined Sample Health Voice/Text Questions */}
          <Text style={styles.sampleHeader}>{t('voice.tryAsking')}</Text>
          <View style={styles.sampleQuestionsList}>
            {HEALTH_KNOWLEDGE_BASE.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.questionChip,
                  topic.isRedFlag && styles.questionChipRedFlag,
                ]}
                onPress={() => handleProcessQuery(topic.id)}
              >
                <Ionicons
                  name={topic.isRedFlag ? 'alert-circle' : 'chatbox-outline'}
                  size={20}
                  color={topic.isRedFlag ? COLORS.danger : COLORS.primary}
                />
                <Text style={styles.questionChipText}>
                  {topic.questionKey[language]}
                </Text>
                <Ionicons name="sparkles" size={16} color={COLORS.secondary} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <RedFlagAlertModal
        visible={showRedFlagModal}
        onClose={() => setShowRedFlagModal(false)}
        customMessage={latestRedFlagMessage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  topHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  googleAiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  googleAiBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  langPillContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  langPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  langPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  langPillTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  micCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statusBannerText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  tapPromptText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 8,
  },
  recordingControlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: COLORS.dangerLight,
    gap: 6,
  },
  cancelButtonText: {
    color: COLORS.danger,
    fontWeight: '700',
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: COLORS.danger,
    gap: 6,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  textInputCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  inputHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  inputHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  inputActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  pipelineBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  pipelineTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  pipelineFlowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pipelineNode: {
    alignItems: 'center',
    gap: 2,
  },
  pipelineNodeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  arrow: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: 'bold',
  },
  cardsSection: {
    marginBottom: 20,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  resultCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.secondary,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  resultCardRedFlag: {
    borderLeftColor: COLORS.danger,
    backgroundColor: '#FFF5F5',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  cardBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  redFlagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.danger,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  redFlagBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  queryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  queryBoxText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontStyle: 'italic',
    flex: 1,
  },
  responseTextCardContent: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardResponseText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 23,
    marginBottom: 10,
    fontWeight: '500',
  },
  cardSpeakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 4,
  },
  listenLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listenLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  actionAdviceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    padding: 12,
    borderRadius: 14,
    gap: 8,
  },
  actionAdviceText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  sampleHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  sampleQuestionsList: {
    gap: 10,
  },
  questionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 16,
    gap: 12,
    elevation: 1,
  },
  questionChipRedFlag: {
    borderWidth: 1,
    borderColor: COLORS.dangerLight,
  },
  questionChipText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
