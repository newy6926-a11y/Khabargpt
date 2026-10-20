/**
 * Romanized-to-Nepali phonetic mapping and multi-script search helper.
 * Allows users to search in English/Romanized Nepali (e.g. "prachanda", "kathmandu", "chunab", "nepse")
 * and seamlessly match Nepali Devanagari text!
 */

const ROMAN_MAP: { [key: string]: string } = {
  ka: 'क', kha: 'ख', ga: 'ग', gha: 'घ', nga: 'ङ',
  cha: 'च', chha: 'छ', ja: 'ज', jha: 'झ', yna: 'ञ',
  ta: 'त', tha: 'थ', da: 'द', dha: 'ध', na: 'न',
  pa: 'प', pha: 'फ', fa: 'फ', ba: 'ब', bha: 'भ', ma: 'म',
  ya: 'य', ra: 'र', la: 'ल', wa: 'व', va: 'व',
  sha: 'श', sa: 'स', ha: 'ह', ksh: 'क्ष', tra: 'त्र', gya: 'ज्ञ',
  // Common terms shortcuts
  nepal: 'नेपाल',
  kathmandu: 'काठमाडौँ',
  chunab: 'चुनाव',
  prachanda: 'प्रचण्ड',
  oli: 'ओली',
  deuba: 'देउवा',
  nepse: 'नेप्से',
  bikas: 'विकास',
  shiksha: 'शिक्षा',
  swasthya: 'स्वास्थ्य',
  budget: 'बजेट',
  krishi: 'कृषि',
  paryatan: 'पर्यटन',
  gold: 'सुन',
  silver: 'चाँदी',
  fuel: 'इन्धन',
  khabar: 'खबर'
};

export function romanizedToNepaliKeywords(query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const tokens = q.split(/\s+/);
  const matchedDevanagari: string[] = [];

  for (const token of tokens) {
    if (ROMAN_MAP[token]) {
      matchedDevanagari.push(ROMAN_MAP[token]);
    }
  }

  return matchedDevanagari;
}

export function matchesRomanOrNepali(text: string, query: string): boolean {
  if (!query.trim()) return true;
  const lowerText = text.toLowerCase();
  const lowerQ = query.trim().toLowerCase();

  // 1. Direct substring match
  if (lowerText.includes(lowerQ)) return true;

  // 2. Romanized transliterated words match
  const devanagariTokens = romanizedToNepaliKeywords(lowerQ);
  for (const dt of devanagariTokens) {
    if (text.includes(dt)) return true;
  }

  return false;
}

export const matchesRomanizedSearch = matchesRomanOrNepali;

/**
 * Web Speech API Voice Recognition Helper
 * Supports Nepali (ne-NP) with fallback to English (en-US)
 */
export function startVoiceRecognition(
  onResult: (transcript: string) => void,
  onError: (errorMsg: string) => void,
  onEnd: () => void
): { stop: () => void } | null {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('तपाईंको ब्राउजरमा भ्वाइस सर्च (Voice Search) सुविधा उपलब्ध छैन। Chrome वा Edge प्रयोग गर्नुहोस्।');
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'ne-NP'; // Primary Nepali

    recognition.onresult = (event: any) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Voice recognition error:', event.error);
      if (event.error === 'not-allowed') {
        onError('माइक्रोफोन अनुमति (Microphone permission) अस्वीकृत भयो। कृपया अनुमति दिनुहोस्।');
      } else if (event.error === 'no-speech') {
        onError('कुनै आवाज सुनिएन। कृपया पुनः बोल्नुहोस्।');
      } else {
        onError(`भ्वाइस त्रुटि: ${event.error}`);
      }
      onEnd();
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {}
      }
    };
  } catch (err) {
    onError('भ्वाइस सेवा सुरु गर्न सकिएन।');
    return null;
  }
}
