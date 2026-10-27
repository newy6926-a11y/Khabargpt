import React, { useState, useEffect } from 'react';
import {
  Settings,
  Languages,
  Moon,
  Sun,
  Layout,
  Type,
  Shield,
  Share2,
  RefreshCw,
  Check,
  Info,
  Smartphone,
  Lock,
  HardDrive
} from 'lucide-react';
import { KhabarLogo } from '../components/KhabarLogo';
import { SiteSettings } from '../types';

interface PersonalizationSettingsPageProps {
  settings?: SiteSettings;
  onNavigate?: (path: string) => void;
}

export interface UserPreferences {
  language: 'np' | 'en';
  appearance: 'light' | 'dark' | 'system';
  defaultPosterAspect: '1:1' | '4:5' | '9:16' | '16:9';
  defaultPosterFont: 'sans' | 'serif' | 'display';
  allowBrandingOnPersonalCards: boolean;
  shareMethod: 'native' | 'copy';
}

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'np',
  appearance: 'light',
  defaultPosterAspect: '1:1',
  defaultPosterFont: 'sans',
  allowBrandingOnPersonalCards: false,
  shareMethod: 'native'
};

const STORAGE_KEY = 'khabar_user_preferences_v1';

export const PersonalizationSettingsPage: React.FC<PersonalizationSettingsPageProps> = ({
  settings,
  onNavigate
}) => {
  const [prefs, setPrefs] = useState<UserPreferences>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
        }
      } catch (err) {
        console.error('Failed to parse preferences:', err);
      }
    }
    return DEFAULT_PREFERENCES;
  });

  const [savedNotification, setSavedNotification] = useState(false);

  // Save changes to localStorage
  const updatePref = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPrefs((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        // Apply appearance to document if changed
        if (key === 'appearance') {
          if (value === 'dark') {
            document.documentElement.classList.add('dark');
          } else if (value === 'light') {
            document.documentElement.classList.remove('dark');
          }
        }
      } catch (err) {
        console.error('Could not save preference:', err);
      }
      return updated;
    });

    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  // Reset to defaults
  const handleReset = () => {
    setPrefs(DEFAULT_PREFERENCES);
    try {
      localStorage.removeItem(STORAGE_KEY);
      document.documentElement.classList.remove('dark');
    } catch {}
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 font-sans">
      {/* 1. Header with Privacy & Identity */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <KhabarLogo size="sm" customUrl={settings?.customLogoUrl || '/logo.png'} title={settings?.siteTitle || 'Khabar GPT'} />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 block">
                प्रयोगकर्ता प्राथमिकताहरू
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                व्यक्तिगत सेटिङ (Personalization Settings)
              </h1>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            title="सुरुवाती अवस्थामा फर्काउनुहोस्"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>डिफल्ट रिसेट (Reset)</span>
          </button>
        </div>

        {/* Local Storage Privacy Disclosure */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <HardDrive className="w-4 h-4 text-emerald-600" />
            <span>डेटा भण्डारण तथा पूर्ण गोपनीयता स्पष्टीकरण (100% On-Device Storage)</span>
          </div>
          <p className="leading-relaxed">
            यस पृष्ठमा तपाईंले रोज्नुभएका सबै प्राथमिकताहरू तपाईंको आफ्नै मोबाइल वा कम्प्युटरको ब्राउजरभित्र (HTML5 LocalStorage) मात्र सुरक्षित रहन्छन्। कुनै पनि व्यक्तिगत प्राथमिकता, पहिचान वा सेटिङ हाम्रो सर्भरमा पठाइँदैन वा सञ्चित गरिँदैन। कुनै खाता (Account) खोल्नु पर्दैन।
          </p>
        </div>
      </div>

      {savedNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>तपाईंको प्राथमिकता सफलतापूर्वक उपकरणमा सुरक्षित भयो!</span>
        </div>
      )}

      {/* 2. Settings Sections */}
      <div className="space-y-6">
        {/* Language Preference */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Languages className="w-4 h-4 text-red-600" />
            <span>१. भाषा प्राथमिकता (Language Preference)</span>
          </div>
          <p className="text-xs text-slate-600">
            वेबसाइटका मुख्य अन्तरक्रियात्मक टूलहरू (क्विज, पोस्टर स्टुडियो) मा प्रयोग हुने प्राथमिक भाषा:
          </p>
          <div className="grid grid-cols-2 gap-3 pt-1">
            {[
              { id: 'np', label: 'नेपाली (Nepali)', sub: 'पूर्वनिर्धारित तथा सिफारिस गरिएको' },
              { id: 'en', label: 'English', sub: 'Secondary International Option' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => updatePref('language', opt.id as 'np' | 'en')}
                className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  prefs.language === opt.id
                    ? 'border-red-600 bg-red-50 text-red-950 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold text-sm">{opt.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Default Poster Dimensions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Layout className="w-4 h-4 text-blue-600" />
            <span>२. पोस्टर स्टुडियो पूर्वनिर्धारित आकार (Default Poster Dimensions)</span>
          </div>
          <p className="text-xs text-slate-600">
            पोस्टर स्टुडियो खोल्दा कुन आकार स्वतः सक्रिय रहनेछ:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {[
              { id: '1:1', label: 'वर्गकार (1:1)', sub: 'Facebook / Instagram' },
              { id: '4:5', label: 'ठाडो (4:5)', sub: 'Mobile Feed' },
              { id: '9:16', label: 'स्टोरी (9:16)', sub: 'WhatsApp Status / Reel' },
              { id: '16:9', label: 'तेर्सो (16:9)', sub: 'Website Banner' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => updatePref('defaultPosterAspect', opt.id as any)}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  prefs.defaultPosterAspect === opt.id
                    ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold">{opt.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Poster Text Style */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Type className="w-4 h-4 text-amber-600" />
            <span>३. पोस्टर फन्ट शैली (Preferred Text Style)</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { id: 'sans', label: 'आधुनिक सान्स (Sans)', desc: 'सफा र डिजिटल' },
              { id: 'serif', label: 'परम्परागत सेरिफ (Serif)', desc: 'शास्त्रीय र औपचारिक' },
              { id: 'display', label: 'बोल्ड डिस्प्ले (Display)', desc: 'उच्च प्रभाव' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => updatePref('defaultPosterFont', f.id as any)}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  prefs.defaultPosterFont === f.id
                    ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold">{f.label}</div>
                <div className="text-[10px] text-slate-500">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Personal Poster Branding Rule - Required by Policy */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 block">
                  ४. पोस्टर स्टुडियो ब्रान्डिङ तथा फेसबुक नाम (अनिवार्य / Required)
                </span>
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                  स्थायी / Required
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                पोस्टर स्टुडियोका सम्पूर्ण डिजाइनहरूमा खबर GPT को आधिकारिक लोगो, फेसबुक ब्याज (<span className="font-semibold text-blue-600">Facebook Logo + KhabarGpt</span>), तथा आधिकारिक वेबसाइट लिङ्क (<span className="font-semibold text-red-600">khabargpt.onrender.com</span>) समावेश गरिन्छ। यसले सामग्रीको आधिकारिकता र पहिचान सुनिश्चित गर्दछ।
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>सक्रिय</span>
            </div>
          </div>
        </div>

        {/* Sharing Preference */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Share2 className="w-4 h-4 text-purple-600" />
            <span>५. शेयरिङ प्राथमिकता (Sharing Preference)</span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            {[
              { id: 'native', label: 'डिभाइस शेयर डाइलग (Web Share)', desc: 'मोबाइलका सम्पूर्ण एपहरूमा सोझै शेयर' },
              { id: 'copy', label: 'सिधा लिङ्क कपी (Direct Copy)', desc: 'क्लिपबोर्डमा सुरक्षित कपी' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => updatePref('shareMethod', opt.id as any)}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  prefs.shareMethod === opt.id
                    ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold">{opt.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
