# Echo Care — Maternal Health Mobile Application

A voice-first, offline-ready React Native mobile application prototype designed for pregnant and postpartum mothers in rural areas of Ethiopia.

Built with **React Native**, **Expo**, **TypeScript**, **React Navigation**, and **AsyncStorage**.

---

## 🌟 Key Features

1. **Voice-First Interaction (Core UX)**
   - Extra-large animated microphone button with pulsing ripple rings and audio visualizer.
   - Conceptual AI Health Pipeline: `Speech Input → Speech Recognition → Language ID → Health Knowledge NLP → Safe Medical Guidance → Text-to-Speech Audio Playback`.
   - Local language audio playback for health queries and advice.

2. **Multi-Language Architecture (i18n)**
   - **Afaan Oromoo (`om`)**
   - **Amharic (`am`)**
   - **Tigrinya (`ti`)**
   - **English (`en`)**
   - Onboarding language selection saved locally offline.

3. **Maternal Care Tracker & Symptom Logger**
   - Pregnancy week-by-week timeline & postpartum recovery stages.
   - Large visual icon symptom logger (Headache, Fever, Bleeding, Swelling, Movement, Nausea, Fatigue).
   - Instant **Red Flag Alert System** triggering high-risk medical warnings and direct worker contact.

4. **Health Extension Worker (HEW) Link & Emergency SOS**
   - 1-tap SOS call to assigned Health Extension Worker.
   - Voice message recorder to send audio notes to HEW.
   - Offline queueing for message reports.

5. **Offline-First Storage & Network Sync Engine**
   - Persistent offline caching via AsyncStorage.
   - Visual Sync Banner displaying connection status and queued items.
   - Network simulation toggle ("Simulate Offline" / "Go Online") for testing offline workflows.

---

## 🚀 How to Run the Application

### Prerequisites
- Install [Node.js](https://nodejs.org/) (v18 or newer recommended).
- Install the **Expo Go** app on your Android or iOS smartphone from the Google Play Store or Apple App Store.

### Step 1: Install Dependencies
Open your terminal in the project directory (`Echo Care`) and run:
```bash
npm install
```

### Step 2: Start the Expo Development Server
Run the following command:
```bash
npx expo start
```

### Step 3: Open on your Phone with Expo Go
1. A **QR Code** will be displayed in your terminal.
2. Open the **Expo Go** app on your Android phone.
3. Tap **"Scan QR code"** and point your phone's camera at the QR code in your terminal.
4. The application will bundle and launch instantly on your device!

---

## 📱 Project Structure

```
Echo Care/
├── assets/                  # App branding assets
├── src/
│   ├── components/          # VoiceMicButton, VoiceWaveform, AudioSpeakerButton, SyncBanner, RedFlagAlertModal
│   ├── constants/           # COLORS, HEALTH_KNOWLEDGE_BASE
│   ├── context/             # LanguageContext, ProfileContext, SyncContext
│   ├── locales/             # om.json, am.json, ti.json, en.json
│   ├── navigation/          # RootNavigator (Stack & Custom Bottom Tab Bar)
│   ├── screens/             # OnboardingScreen, HomeScreen, VoiceAssistantScreen, MaternalTrackerScreen, RemindersScreen, HEWCommunicationScreen
│   ├── services/            # VoiceService, StorageService, i18n, SyncService
│   └── types/               # TypeScript definitions
├── App.tsx                  # Application entry point with Providers
├── package.json
└── app.json                 # Expo configuration
```
