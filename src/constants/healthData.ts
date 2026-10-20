import { LanguageCode } from '../types';

export interface HealthTopic {
  id: string;
  isRedFlag: boolean;
  category: 'warning_sign' | 'nutrition' | 'labor_prep' | 'vaccination' | 'general_care';
  questionKey: Record<LanguageCode, string>;
  responseKey: Record<LanguageCode, string>;
  spokenAudioText: Record<LanguageCode, string>;
  suggestedAction: Record<LanguageCode, string>;
}

export const HEALTH_KNOWLEDGE_BASE: HealthTopic[] = [
  {
    id: 'headache_preeclampsia',
    isRedFlag: true,
    category: 'warning_sign',
    questionKey: {
      om: 'Dhukkubbii mataa ulfa keessatti nagaadhaa?',
      am: 'በእርግዝና ወቅት የራስ ምታት የተለመደ ነው?',
      ti: 'እዋን ጥንሲ ርእሲ ሕማም ልሙድ ድዩ?',
      en: 'Is headache normal during pregnancy?'
    },
    responseKey: {
      om: "Dhukkubbii mataa cimaan, ilaalcha dukkanaa'uu fi dhiita'iinsa fuulaa mallattoo balaa Preeclampsia ta'uu danda'a. Ariitiin gara Hojjettuu Fayyaa (HEW) deemaa.",
      am: 'በጣም ብርቱ የሆነ የራስ ምታት፣ የእይታ መታወክ እና የፊት እብጠት የPreeclampsia (የደም ግፊት) አደጋ ምልክት ሊሆን ይችላል። በአስቸኳይ ወደ ጤና ኤክስቴንሽን ሰራተኛ ይሂዱ።',
      ti: 'ብርቱ ሕማም ርእሲ፣ ምፅልማት ኣዒንትን እብጠት ገፅን ምልክት ሓደጋ ደም ፀቕጢ ሊኸውን ይኽእል እዩ። ብቕልጡፍ ናብ ሰራሕተኛ ጥዕና ኪዲ።',
      en: 'Severe headache combined with blurred vision or facial swelling can be a red-flag sign of Preeclampsia. Please contact your Health Extension Worker immediately.'
    },
    spokenAudioText: {
      om: 'Haadha keenya, dhukkubbii mataa cimaa yoo qabaattan ariitiin hojjettuu fayyaa keessan beeksisaa.',
      am: 'እናታችን፣ ከፍተኛ የራስ ምታት ካለዎት በአስቸኳይ የጤና ሰራተኛዎን ያማክሩ።',
      ti: 'ኣዴና፣ ብርቱ ሕማም ርእሲ እንተሃልዩኪ ብቕልጡፍ ንሰራሕተኛ ጥዕና ሓብሪ።',
      en: 'Mother, severe headache requires immediate consultation with your health extension worker.'
    },
    suggestedAction: {
      om: "Bilbila HEW tuqaa ykn gara kilinikaa deemaa",
      am: 'ወደ ጤና ሰራተኛ ይደውሉ ወይም ወደ ጤና ጣቢያ ይሂዱ',
      ti: 'ደውሊ ናብ ሰራሕተኛ ጥዕና ወይ ናብ ኬላ ጥዕና ኪዲ',
      en: 'Call HEW or visit nearest health post immediately'
    }
  },
  {
    id: 'maternal_nutrition',
    isRedFlag: false,
    category: 'nutrition',
    questionKey: {
      om: 'Nyootrika qulqulluu akkamittan nyaadhaa?',
      am: 'የተመጣጠነ ምግብ እንዴት ይመገባሉ?',
      ti: 'ምጉባል መግቢ ከመይ ክንመገብ ኣለና?',
      en: 'What foods should I eat for nutrition?'
    },
    responseKey: {
      om: "Guyyaa guyyaan nyaata aanaanii, kuduraa, fuduraa, baaqelaa fi qoricha sibiilaa (Iron/Folic Acid) fudhadhaa. Bishaan ga'aa dhugaadha.",
      am: 'በየቀኑ የእንቁላል፣ አትክልት፣ ፍራፍሬ፣ አተር/ሙስር እና የአይረን ኪኒን ይውሰዱ። በቂ ውሃ ይጠጡ።',
      ti: 'በብመዓልቱ ኣሕምልቲ፣ ፍራፍረ፣ ኣተርን መድሃኒት ኣይረንን ውሰዲ። ብቑዕ ማይ ስተዪ።',
      en: 'Eat green leafy vegetables, legumes, eggs, fruits, and take your daily Iron/Folic acid tablets with clean water.'
    },
    spokenAudioText: {
      om: "Fayyaa keessaniif fi da'ima keessaniif qoricha sibiilaa guyyaa guyyaan fudhadhaa.",
      am: 'ለእርስዎ እና ለፅንሱ ጤንነት የአይረን ኪኒን በየቀኑ ይውሰዱ።',
      ti: 'ንጥዕናኽንን ንጥዕና ፅንስኽንን መድሃኒት ኣይረን በብመዓልቱ ውሰዲ።',
      en: 'Take daily iron supplements and eat green vegetables for you and your baby.'
    },
    suggestedAction: {
      om: 'Qoricha Iron guyyaa guyyaan fudhadhaa',
      am: 'የአይረን ኪኒን በየቀኑ ይውሰዱ',
      ti: 'መድሃኒት ኣይረን በብመዓልቱ ውሰዲ',
      en: 'Take daily Iron supplement and drink 8 glasses of water'
    }
  },
  {
    id: 'labor_signs',
    isRedFlag: false,
    category: 'labor_prep',
    questionKey: {
      om: "Mallattoon da'umsaa maali?",
      am: 'የምጥ ምልክቶች ምንድን ናቸው?',
      ti: 'ምልክታት ሕርሲ እንታይ እዮም?',
      en: 'What are the signs of labor?'
    },
    responseKey: {
      om: "Ciniinsuu walitti fufaa, dhangala'aa bishaanii ykn dhiiga xiqqaa arguun mallattoo da'umsaati. Qophii da'umsaa keessan fudhattanii gara kelinikaa deemaa.",
      am: 'የተዘወተረ የምጥ ህመም፣ የሽናት/ውሃ መፈሰስ እና የደምቀላቀለ ፈሳሽ ማየት የምጥ ምልክቶች ናቸው። ወዲያው ወደ ጤና ጣቢያ ይሂዱ።',
      ti: 'ተኸታታሊ ሕማም ሕርሲ፣ ምፍሳስ ማይን ምእላይ ፈሳሲ ደምን ምልክት ሕርሲ እዮም። ብቕልጡፍ ናብ ኬላ ጥዕና ኪዲ።',
      en: 'Regular painful contractions, rupture of membranes (water breaking), or bloody show are signs of labor. Proceed to health post with your birth kit.'
    },
    spokenAudioText: {
      om: 'Mallattoon ciniinsuu yoo jalqabe, gara kelinikaa deemuuf qopha\'aa.',
      am: 'የምጥ ምልክት ሲጀምር ወደ ጤና ጣቢያ ለመሄድ ይዘጋጁ።',
      ti: 'ምልክት ሕርሲ ክጅምር ከሎ ናብ ኬላ ጥዕና ንምኻድ ተዳለዊ።',
      en: 'When labor contractions start, get your emergency birth kit ready and visit the health post.'
    },
    suggestedAction: {
      om: "Uffata da'imaa fi meeshaa qopheeffadhaa",
      am: 'የህፃን ልብስ እና የእናት እቃዎችን ያዘጋጁ',
      ti: 'ክዳን ሕፃንን ናይ ኣዴታት እቃን ኣዳልዊ',
      en: 'Prepare birth plan and alert HEW for facility delivery'
    }
  },
  {
    id: 'bleeding_warning',
    isRedFlag: true,
    category: 'warning_sign',
    questionKey: {
      om: "Dhiigni garbaa yoo dhangala'e maalan godha?",
      am: 'በእርግዝና ወቅት ደም ከተፈሰሰ ምን ይደረጋል?',
      ti: 'እዋን ጥንሲ ደም እንተፈሲሱ እንታይ ይገበር?',
      en: 'What if I experience vaginal bleeding?'
    },
    responseKey: {
      om: 'AKEAKKACHIISA BALAA: Dhiigni kamiyyuu ulfa keessatti balaa guddaadha. Hatattamaan sarara ariifachiisaa HEW bilbilaa!',
      am: 'የአደጋ ማስጠንቀቂያ፡ በእርግዝና ወቅት ማናቸውም የደም መፍሰስ ከፍተኛ አደጋ ነው። በአስቸኳይ ወደ ጤና ኤክስቴንሽን ሰራተኛ ይደውሉ!',
      ti: 'ሓደጋ ማስጠንቀቕታ፡ እዋን ጥንሲ ዝኾነ ፈሳሲ ደም ዓብዪ ሓደጋ እዩ። ብቕልጡፍ ናብ ሰራሕተኛ ጥዕና ደውሊ!',
      en: 'RED FLAG EMERGENCY: Any vaginal bleeding during pregnancy is dangerous. Alert your Health Extension Worker immediately!'
    },
    spokenAudioText: {
      om: 'Hatattamaan hojjettuu fayyaa bira deemaa, dhiigni balaa guddaadha!',
      am: 'በአስቸኳይ ወደ ጤና ሰራተኛ ይሂዱ፣ ደም መፍሰስ ከፍተኛ አደጋ ነው!',
      ti: 'ብቕልጡፍ ናብ ሰራሕተኛ ጥዕና ኪዲ፣ ደም ምፍሳስ ዓብዪ ሓደጋ እዩ!',
      en: 'Seek emergency health worker help immediately, bleeding is a medical emergency!'
    },
    suggestedAction: {
      om: 'Sarara SOS tuquun gabaasa ergaa',
      am: 'የSOS አዝራሩን በመጫን ሪፖርት ይላኩ',
      ti: 'ምልክት SOS ብምፅቓጥ ሪፖርት ላኺ',
      en: 'Tap SOS button to notify HEW immediately'
    }
  }
];
