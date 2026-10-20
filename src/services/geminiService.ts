import { HEALTH_KNOWLEDGE_BASE, HealthTopic } from '../constants/healthData';
import { LanguageCode, VoiceQueryResponse } from '../types';

// Gemini API Key from environment or fallback
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const GeminiAIService = {
  /**
   * Analyze maternal health query using Google Gemini AI, with structured medical fallback.
   */
  async analyzeHealthQuery(
    userQuery: string,
    language: LanguageCode,
    presetTopicId?: string
  ): Promise<VoiceQueryResponse> {
    // Check preset fallback first if matching ID supplied
    if (presetTopicId) {
      const topic = HEALTH_KNOWLEDGE_BASE.find((t: HealthTopic) => t.id === presetTopicId);
      if (topic) {
        return {
          queryText: topic.questionKey[language] || userQuery,
          detectedLanguage: language,
          intent: topic.category,
          audioText: topic.responseKey[language],
          audioDurationSeconds: 8,
          isUrgentRedFlag: topic.isRedFlag,
          medicalCategory: topic.category,
          suggestedAction: topic.suggestedAction[language],
        };
      }
    }

    // Attempt Google Gemini AI API request if key is available
    if (GEMINI_API_KEY) {
      try {
        const languageNames: Record<LanguageCode, string> = {
          om: 'Afaan Oromoo',
          am: 'Amharic',
          ti: 'Tigrinya',
          en: 'English',
        };

        const targetLang = languageNames[language] || 'English';

        const prompt = `You are Echo Care, an AI maternal health assistant in Ethiopia.
The user is a pregnant or postpartum mother asking: "${userQuery}".
Respond concisely and empathetically in ${targetLang}.
If the query indicates dangerous maternal red flags (such as heavy vaginal bleeding, severe headache with blurred vision, high fever, abdominal trauma, or no baby movement), explicitly state it is a RED FLAG EMERGENCY and urge them to seek immediate medical help or contact their local Health Extension Worker (HEW).

Return JSON only in this exact format:
{
  "audioText": "Clear, reassuring response in ${targetLang} (max 3 sentences)",
  "isUrgentRedFlag": true or false,
  "suggestedAction": "Practical advice or next step in ${targetLang}",
  "medicalCategory": "nutrition" | "warning_sign" | "labor_prep" | "vaccination" | "general_care"
}`;

        const response = await fetch(GEMINI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.3,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (rawText) {
            const parsed = JSON.parse(rawText);
            return {
              queryText: userQuery,
              detectedLanguage: language,
              intent: parsed.medicalCategory || 'general_care',
              audioText: parsed.audioText,
              audioDurationSeconds: 8,
              isUrgentRedFlag: Boolean(parsed.isUrgentRedFlag),
              medicalCategory: parsed.medicalCategory || 'general_care',
              suggestedAction: parsed.suggestedAction,
            };
          }
        }
      } catch (e) {
        console.warn('Google Gemini AI call failed, falling back to knowledge base', e);
      }
    }

    // Fallback: Intelligent Knowledge Base matching if offline or API unavailable
    const lowerQuery = userQuery.toLowerCase();

    // Red flag keywords detection across languages
    const isRedFlag =
      lowerQuery.includes('bleed') ||
      lowerQuery.includes('dhiiga') ||
      lowerQuery.includes('ደም') ||
      lowerQuery.includes('ደምና') ||
      lowerQuery.includes('headache') ||
      lowerQuery.includes('mataa') ||
      lowerQuery.includes('ራስ') ||
      lowerQuery.includes('fever') ||
      lowerQuery.includes('ho' + 'aa') ||
      lowerQuery.includes('ትኩሳት') ||
      lowerQuery.includes('pain') ||
      lowerQuery.includes('dhukkubbii');

    const matchedTopic = HEALTH_KNOWLEDGE_BASE.find((t) => {
      const q = t.questionKey[language]?.toLowerCase() || '';
      return (
        lowerQuery.includes(t.id) ||
        lowerQuery.split(' ').some((word) => word.length > 3 && q.includes(word))
      );
    }) || HEALTH_KNOWLEDGE_BASE[0];

    return {
      queryText: userQuery,
      detectedLanguage: language,
      intent: isRedFlag ? 'warning_sign' : matchedTopic.category,
      audioText: isRedFlag
        ? getRedFlagText(language)
        : matchedTopic.responseKey[language],
      audioDurationSeconds: 8,
      isUrgentRedFlag: isRedFlag || matchedTopic.isRedFlag,
      medicalCategory: isRedFlag ? 'warning_sign' : matchedTopic.category,
      suggestedAction: isRedFlag
        ? getRedFlagAction(language)
        : matchedTopic.suggestedAction[language],
    };
  },
};

function getRedFlagText(lang: LanguageCode): string {
  switch (lang) {
    case 'om':
      return 'Mallattoon kun baay\'ee sodaachisaa dha! Dafee gara mana yaalaatti deemi yookiin hojjettuu faayyaa (HEW) qunnamuu qabda.';
    case 'am':
      return 'ይህ ምልክት በጣም አደገኛ ነው! በአስቸኳይ ወደ ጤና ጣቢያ ይሂዱ ወይም የጤና ኤክስቴንሽን ሰራተኛዎን ያነጋግሩ።';
    case 'ti':
      return 'እዚ ምልክት እዚ ኣዝዩ ሓደገኛ እዩ! ብቕልጡፍ ናብ ውሽጢ ጥዕና ጣብያ ኪዱ ወይ ናይ ጥዕና ኤክስቴንሽን ሰራሕተኛ ኣነጋግሩ።';
    default:
      return 'This is an urgent warning sign! Please go to the nearest health center or contact your Health Extension Worker immediately.';
  }
}

function getRedFlagAction(lang: LanguageCode): string {
  switch (lang) {
    case 'om':
      return 'Hojjettuu Fayyaa fi saarvisii emmerjensii bilbilaa.';
    case 'am':
      return 'ለጤና ኤክስቴንሽን ሰራተኛ እና ለአደጋ ጊዜ ጥሪ ያድርጉ።';
    case 'ti':
      return 'ናብ ናይ ጥዕና ኤክስቴንሽን ሰራሕተኛ ወይ ድማ ህጹጽ ቴሌፎን ደውሉ።';
    default:
      return 'Call your Health Extension Worker (HEW) and arrange emergency transport.';
  }
}
