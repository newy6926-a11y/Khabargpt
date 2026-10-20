import React, { useState, useEffect } from 'react';
import {
  Eye,
  Type,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Sparkles,
  Sliders,
  Check,
  X,
  RotateCcw,
  Zap,
  HelpCircle
} from 'lucide-react';

export interface AccessibilitySettings {
  fontSizePercent: number; // 90, 100, 115, 130, 150
  themeMode: 'default' | 'sepia' | 'high_contrast' | 'dark';
  dyslexiaFont: boolean;
  reduceMotion: boolean;
  lineSpacing: 'normal' | 'relaxed' | 'loose';
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSizePercent: 100,
  themeMode: 'default',
  dyslexiaFont: false,
  reduceMotion: false,
  lineSpacing: 'normal'
};

const STORAGE_KEY = 'khabar_accessibility_settings';

export function getStoredAccessibilitySettings(): AccessibilitySettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

export function saveAccessibilitySettings(settings: AccessibilitySettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applyAccessibilityToDOM(settings);
  } catch {}
}

export function applyAccessibilityToDOM(settings: AccessibilitySettings): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Font size
  root.style.fontSize = `${settings.fontSizePercent}%`;

  // Themes
  root.classList.remove('theme-sepia', 'theme-high-contrast', 'dark');
  if (settings.themeMode === 'sepia') {
    root.classList.add('theme-sepia');
  } else if (settings.themeMode === 'high_contrast') {
    root.classList.add('theme-high-contrast');
  } else if (settings.themeMode === 'dark') {
    root.classList.add('dark');
  }

  // Dyslexic font
  if (settings.dyslexiaFont) {
    root.classList.add('font-accessible');
  } else {
    root.classList.remove('font-accessible');
  }

  // Reduce motion
  if (settings.reduceMotion) {
    root.classList.add('reduce-motion');
  } else {
    root.classList.remove('reduce-motion');
  }
}

interface AccessibilityToolbarProps {
  isOpen: boolean;
  onClose: () => void;
  // Optional active article text for Text-to-Speech
  speechText?: string;
  speechTitle?: string;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  isOpen,
  onClose,
  speechText,
  speechTitle
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(getStoredAccessibilitySettings());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  useEffect(() => {
    applyAccessibilityToDOM(settings);
  }, []);

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, val: AccessibilitySettings[K]) => {
    const next = { ...settings, [key]: val };
    setSettings(next);
    saveAccessibilitySettings(next);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    saveAccessibilitySettings(DEFAULT_SETTINGS);
    stopSpeech();
  };

  // Text-To-Speech (वाचक) Implementation
  const startSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('तपाईंको ब्राउजरमा बोली वाचन (Speech Synthesis) समर्थित छैन।');
      return;
    }

    window.speechSynthesis.cancel();

    const textToRead = speechText || speechTitle || 'खबर GPT मा तपाईंलाई स्वागत छ। नेपालका समसामयिक विषय, विश्लेषणात्मक तथ्य र एक्सप्लेनरहरू यहाँ पढ्न र सुन्न सक्नुहुन्छ।';
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    // Try finding a Nepali (ne-NP) or Hindi (hi-IN) voice
    const voices = window.speechSynthesis.getVoices();
    const nepaliVoice = voices.find((v) => v.lang.startsWith('ne')) || voices.find((v) => v.lang.startsWith('hi'));
    if (nepaliVoice) {
      utterance.voice = nepaliVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const pauseSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isSpeaking && !isPaused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      } else if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
    }
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 my-auto animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                पहुँचयोग्यता & वाचक (Accessibility Toolkit)
              </h3>
              <p className="text-[11px] text-slate-500">
                सबैका लागि सहज पठन, ठूला अक्षर, आँखा-मैत्री थिम तथा आवाज वाचक
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="बन्द गर्नुहोस्"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Text to Speech / नेपाली आवाज वाचक */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-4 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-300">
                नेपाली आवाज वाचक (Voice Reader)
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              {speechText ? 'यो लेख सुन्नुहोस्' : 'वेबसाइट परिचय सुन्नुहोस्'}
            </span>
          </div>

          <p className="text-xs text-slate-200 line-clamp-2 italic">
            "{speechTitle || 'खबर GPT: नेपालका समसामयिक विषय, विश्लेषणात्मक तथ्य र एक्सप्लेनरहरू'}"
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
            <div className="flex items-center gap-2">
              {!isSpeaking ? (
                <button
                  onClick={startSpeech}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>सुन्नुहोस् (Listen)</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={pauseSpeech}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>{isPaused ? 'पुनः सुरु' : 'पज (Pause)'}</span>
                  </button>
                  <button
                    onClick={stopSpeech}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>रोक्नुहोस्</span>
                  </button>
                </>
              )}
            </div>

            {/* Speed selection */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-400">गति:</span>
              {[0.8, 1.0, 1.25].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setSpeechRate(rate)}
                  className={`px-2 py-0.5 rounded-lg font-mono font-bold cursor-pointer transition-colors ${
                    speechRate === rate ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Font Size Scaling */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-slate-600" />
              <span>अक्षरको आकार (Text Size):</span>
            </span>
            <span className="font-mono text-slate-500 font-bold">{settings.fontSizePercent}%</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            {[
              { label: 'A-', percent: 90, desc: 'सानो' },
              { label: 'A', percent: 100, desc: 'सामान्य' },
              { label: 'A+', percent: 115, desc: 'ठूलो' },
              { label: 'A++', percent: 130, desc: 'अझ ठूलो' },
              { label: 'A+++', percent: 150, desc: 'अधिकतम' }
            ].map((btn) => (
              <button
                key={btn.percent}
                onClick={() => updateSetting('fontSizePercent', btn.percent)}
                className={`py-2 px-1 rounded-xl text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
                  settings.fontSizePercent === btn.percent
                    ? 'bg-red-600 text-white font-extrabold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70 font-semibold'
                }`}
              >
                <span>{btn.label}</span>
                <span className={`text-[9px] ${settings.fontSizePercent === btn.percent ? 'text-red-100' : 'text-slate-400'}`}>
                  {btn.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Theme & Contrast Modes */}
        <div className="space-y-2">
          <span className="font-bold text-xs text-slate-800 block">
            दृश्य थिम & कन्ट्रास्ट (Reading Theme & Contrast):
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {/* Default Light */}
            <button
              onClick={() => updateSetting('themeMode', 'default')}
              className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                settings.themeMode === 'default'
                  ? 'border-red-600 bg-red-50/50 text-red-900 ring-2 ring-red-200 font-bold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <span className="text-[11px]">उज्यालो (Light)</span>
            </button>

            {/* Sepia Eye-Care */}
            <button
              onClick={() => updateSetting('themeMode', 'sepia')}
              className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                settings.themeMode === 'sepia'
                  ? 'border-amber-700 bg-amber-100 text-amber-950 ring-2 ring-amber-300 font-bold'
                  : 'border-amber-200 bg-[#fbf0d9] text-amber-900 hover:opacity-90'
              }`}
            >
              <Sparkles className="w-5 h-5 text-amber-700" />
              <span className="text-[11px]">सेपिया कागज (Sepia)</span>
            </button>

            {/* High Contrast */}
            <button
              onClick={() => updateSetting('themeMode', 'high_contrast')}
              className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                settings.themeMode === 'high_contrast'
                  ? 'border-white bg-black text-white ring-2 ring-yellow-400 font-bold'
                  : 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-black'
              }`}
            >
              <Eye className="w-5 h-5 text-yellow-400" />
              <span className="text-[11px]">उच्च कन्ट्रास्ट</span>
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => updateSetting('themeMode', 'dark')}
              className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                settings.themeMode === 'dark'
                  ? 'border-blue-600 bg-slate-800 text-white ring-2 ring-blue-400 font-bold'
                  : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Moon className="w-5 h-5 text-blue-400" />
              <span className="text-[11px]">डार्क मोड (Dark)</span>
            </button>
          </div>
        </div>

        {/* 4. Motion & Dyslexic Friendly Toggles */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <span className="text-xs font-semibold text-slate-800">
              एनिमेशन र हलचल घटाउनुहोस् (Reduce Motion)
            </span>
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(e) => updateSetting('reduceMotion', e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <span className="text-xs font-semibold text-slate-800">
              स्पष्ट र खुला अक्षर शैली (High Legibility Font)
            </span>
            <input
              type="checkbox"
              checked={settings.dyslexiaFont}
              onChange={(e) => updateSetting('dyslexiaFont', e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded cursor-pointer"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>डिफल्टमा रिसेट</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer shadow-xs"
          >
            लागु गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};
