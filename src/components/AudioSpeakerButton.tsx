import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { VoiceService } from '../services/voiceService';
import { LanguageCode } from '../types';

interface AudioSpeakerButtonProps {
  textToSpeak?: string;
  language?: LanguageCode;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
  size?: number;
  color?: string;
}

export const AudioSpeakerButton: React.FC<AudioSpeakerButtonProps> = ({
  textToSpeak,
  language = 'en',
  onPlayStart,
  onPlayEnd,
  size = 28,
  color = COLORS.secondary,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePress = async () => {
    if (isPlaying) {
      await VoiceService.stopAudio();
      setIsPlaying(false);
      if (onPlayEnd) onPlayEnd();
    } else {
      const text = textToSpeak || 'Echo Care maternal health assistant.';
      setIsPlaying(true);
      if (onPlayStart) onPlayStart();

      await VoiceService.speakText(
        text,
        language,
        () => setIsPlaying(true),
        () => {
          setIsPlaying(false);
          if (onPlayEnd) onPlayEnd();
        }
      );
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      accessibilityLabel="Read text out loud"
      accessibilityRole="button"
      style={[
        styles.button,
        {
          width: size + 16,
          height: size + 16,
          borderRadius: (size + 16) / 2,
          backgroundColor: isPlaying ? COLORS.secondaryLight : 'rgba(0, 168, 150, 0.1)',
        },
      ]}
    >
      <Ionicons
        name={isPlaying ? 'volume-high' : 'volume-medium-outline'}
        size={size}
        color={isPlaying ? COLORS.secondary : color}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
});
