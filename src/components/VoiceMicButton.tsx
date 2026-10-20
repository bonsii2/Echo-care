import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface VoiceMicButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  isPlayingAudio: boolean;
  onPress: () => void;
  size?: number;
}

export const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({
  isRecording,
  isProcessing,
  isPlayingAudio,
  onPress,
  size = 90,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (isRecording) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.35,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => {
      if (animation) animation.stop();
    };
  }, [isRecording]);

  const getBgColor = () => {
    if (isRecording) return COLORS.micActive;
    if (isProcessing) return COLORS.accent;
    if (isPlayingAudio) return COLORS.secondary;
    return COLORS.primary;
  };

  const getIconName = () => {
    if (isRecording) return 'square';
    if (isProcessing) return 'hourglass-outline';
    if (isPlayingAudio) return 'volume-high';
    return 'mic';
  };

  return (
    <View style={styles.container}>
      {isRecording && (
        <Animated.View
          style={[
            styles.pulseRing,
            {
              width: size * 1.5,
              height: size * 1.5,
              borderRadius: (size * 1.5) / 2,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: getBgColor(),
          },
        ]}
      >
        <Ionicons name={getIconName()} size={size * 0.45} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  pulseRing: {
    position: 'absolute',
    backgroundColor: COLORS.micPulseRing,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
});
