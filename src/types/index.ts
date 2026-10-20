export type LanguageCode = 'om' | 'am' | 'ti' | 'en';

export interface MotherProfile {
  name: string;
  language: LanguageCode;
  stage: 'pregnant' | 'postpartum';
  pregnancyWeek?: number; // 1 to 40
  postpartumMonth?: number; // 1 to 12
  dueDate?: string;
  woredaLocation: string;
  hewName: string;
  hewPhone: string;
  emergencyContact: string;
  isOnboarded: boolean;
}

export interface VoiceQueryResponse {
  queryText: string;
  detectedLanguage: LanguageCode;
  intent: string;
  audioText: string;
  audioDurationSeconds: number;
  isUrgentRedFlag: boolean;
  medicalCategory: 'nutrition' | 'warning_sign' | 'labor_prep' | 'vaccination' | 'general_care';
  suggestedAction?: string;
}

export interface SymptomLog {
  id: string;
  date: string; // ISO string
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  voiceNoteUri?: string;
  notes?: string;
  isRedFlag: boolean;
  synced: boolean;
}

export interface ReminderItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  category: 'anc_visit' | 'medication' | 'vaccine' | 'nutrition' | 'emergency_prep';
  dueDate: string;
  dueTime: string;
  isCompleted: boolean;
  audioPromptText: Record<LanguageCode, string>;
}

export interface HEWReport {
  id: string;
  createdAt: string;
  motherName: string;
  location: string;
  summary: string;
  symptoms: string[];
  isEmergency: boolean;
  status: 'pending' | 'sent' | 'delivered';
  voiceNoteDuration?: number;
}

export type CourseCategory =
  | 'all'
  | 'prenatal'
  | 'nutrition'
  | 'labor'
  | 'newborn'
  | 'danger_signs'
  | 'postpartum';

export interface MaternalCourse {
  id: string;
  titleKey: string;
  titleFallback: string;
  descriptionKey: string;
  descriptionFallback: string;
  youtubeId: string;
  duration: string;
  category: CourseCategory;
  provider: string;
  thumbnailUrl: string;
  keyTakeaways: string[];
  audioSummary: Record<LanguageCode, string>;
  stageRecommendation?: 'pregnant' | 'postpartum' | 'all';
}

