import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { COLORS } from '../constants/colors';

import { OnboardingScreen } from '../screens/OnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { VoiceAssistantScreen } from '../screens/VoiceAssistantScreen';
import { MaternalTrackerScreen } from '../screens/MaternalTrackerScreen';
import { RemindersScreen } from '../screens/RemindersScreen';
import { HEWCommunicationScreen } from '../screens/HEWCommunicationScreen';
import { CoursesScreen } from '../screens/CoursesScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabNavigator = () => {
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: COLORS.card,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CoursesTab') {
            iconName = focused ? 'play-circle' : 'play-circle-outline';
          } else if (route.name === 'VoiceTab') {
            iconName = focused ? 'mic' : 'mic-outline';
          } else if (route.name === 'TrackerTab') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'RemindersTab') {
            iconName = focused ? 'alarm' : 'alarm-outline';
          } else if (route.name === 'HewTab') {
            iconName = focused ? 'medical' : 'medical-outline';
          }

          if (route.name === 'VoiceTab') {
            return (
              <View
                style={[
                  styles.voiceTabCircle,
                  focused && styles.voiceTabCircleActive,
                ]}
              >
                <Ionicons name="mic" size={24} color="#FFFFFF" />
              </View>
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="CoursesTab"
        component={CoursesScreen}
        options={{ tabBarLabel: t('courses.tabLabel') || 'Courses' }}
      />
      <Tab.Screen
        name="VoiceTab"
        component={VoiceAssistantScreen}
        options={{ tabBarLabel: 'Voice AI' }}
      />
      <Tab.Screen
        name="TrackerTab"
        component={MaternalTrackerScreen}
        options={{ tabBarLabel: 'Tracker' }}
      />
      <Tab.Screen
        name="RemindersTab"
        component={RemindersScreen}
        options={{ tabBarLabel: 'Reminders' }}
      />
      <Tab.Screen
        name="HewTab"
        component={HEWCommunicationScreen}
        options={{ tabBarLabel: 'HEW / SOS' }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!profile.isOnboarded ? (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Courses"
              component={CoursesScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  voiceTabCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  voiceTabCircleActive: {
    backgroundColor: COLORS.primaryDark,
    transform: [{ scale: 1.1 }],
  },
});

