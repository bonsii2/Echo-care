import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/colors';

interface VoiceWaveformProps {
  isActive: boolean;
  color?: string;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ isActive, color = COLORS.primary }) => {
  const bar1 = useRef(new Animated.Value(10)).current;
  const bar2 = useRef(new Animated.Value(24)).current;
  const bar3 = useRef(new Animated.Value(36)).current;
  const bar4 = useRef(new Animated.Value(18)).current;
  const bar5 = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    let anim: Animated.CompositeAnimation;
    if (isActive) {
      const animateBar = (val: Animated.Value, min: number, max: number, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(val, { toValue: max, duration: 300 + delay, useNativeDriver: false }),
            Animated.timing(val, { toValue: min, duration: 300 + delay, useNativeDriver: false }),
          ])
        );
      };

      anim = Animated.parallel([
        animateBar(bar1, 8, 32, 0),
        animateBar(bar2, 12, 45, 100),
        animateBar(bar3, 16, 55, 50),
        animateBar(bar4, 10, 38, 150),
        animateBar(bar5, 8, 30, 80),
      ]);
      anim.start();
    } else {
      bar1.setValue(10);
      bar2.setValue(20);
      bar3.setValue(25);
      bar4.setValue(18);
      bar5.setValue(12);
    }

    return () => {
      if (anim) anim.stop();
    };
  }, [isActive]);

  return (
    <View style={styles.container}>
      {[bar1, bar2, bar3, bar4, bar5].map((b, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            { height: b, backgroundColor: color },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    gap: 6,
    marginVertical: 8,
  },
  bar: {
    width: 6,
    borderRadius: 3,
  },
});
