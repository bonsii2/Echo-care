import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LanguageProvider } from './src/context/LanguageContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { SyncProvider } from './src/context/SyncContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ProfileProvider>
          <SyncProvider>
            <StatusBar style="auto" />
            <RootNavigator />
          </SyncProvider>
        </ProfileProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
