import React from 'react';
import { KhabarLogo } from '../components/KhabarLogo';
import { Shield, Target, Eye, AlertCircle, CheckCircle, Facebook, ExternalLink } from 'lucide-react';
import { SiteSettings } from '../types';

interface AboutPageProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
      {/* Brand Header */}
      <div className="text-center space-y-4 border-b border-slate-200 pb-8">
        <div className="flex justify-center">
          <KhabarLogo
            size="lg"
            customUrl={settings.customLogoUrl || '/logo.png'}
            title={settings.siteTitle || 'Khabar GPT'}
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-sans text-slate-900">
          हाम्रोबारे (About Khabar GPT)
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          नेपालका समसामयिक विषय, सार्वजनिक सरोकारका जानकारी र जटिल विषयलाई सरल भाषामा बुझाउने स्वतन्त्र सूचना पृष्ठ।
        </p>
      </div>

      {/* Critical Legal Disclaimer Box */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 text-xs sm:text-sm text-amber-950 space-y-3">
        <div className="flex items-center gap-2 font-bold text-amber-900 text-base">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>महत्त्वपूर्ण कानुनी तथा संस्थागत स्पष्टीकरण</span>
        </div>
        <p className="leading-relaxed">
          <strong>खबर GPT हाल नेपाल सरकारको सूचना तथा प्रसारण विभाग वा प्रेस काउन्सिल नेपालमा दर्ता भएको अनलाइन सञ्चारमाध्यम (प्रेस वा समाचार एजेन्सी) होइन।</strong>
        </p>
        <p className="leading-relaxed text-amber-900">
          यो सामाजिक सञ्जाल (Facebook) तथा यस स्वतन्त्र वेबसाइट मार्फत सार्वजनिक सरोकारका सूचना, सरकारी निर्देशनहरू, र जटिल नीतिगत विषयहरूलाई नागरिकका लागि सरल भाषामा व्याख्या गर्ने एक डिजिटल सूचना पहल (Digital Information Initiative) मात्र हो। हामी कुनै पनि आधिकारिक प्रेस परिचयपत्र, सरकारी मान्यता वा दर्ता भएको पत्रकारिता संस्था भएको दाबी गर्दैनौँ।
        </p>
      </div>

      {/* Objectives */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-red-600" />
          <span>हाम्रा मुख्य उद्देश्यहरू (Main Objectives)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              १. सरल र तथ्यमा आधारित सूचना
            </span>
            <p className="text-slate-600">
              नेपालका जटिल प्रशासनिक, कानुनी, र आर्थिक विषयहरूलाई सर्वसाधारणले सहजै बुझ्न सक्ने सरल नेपाली भाषामा प्रस्तुत गर्नु।
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              २. आधिकारिक फेसबुक पेजको सशक्तिकरण
            </span>
            <p className="text-slate-600">
              हाम्रो आधिकारिक फेसबुक पेजमा प्रकाशित भिडियो, Reels, र ग्राफिक्स सामग्रीहरूलाई व्यवस्थित रूपमा एकै ठाउँमा उपलब्ध गराउनु।
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              ३. पारदर्शिता र जवाफदेहिता
            </span>
            <p className="text-slate-600">
              कुनै पनि गल्ती वा कमजोरी देखिएमा पाठकलाई झुक्याउन नभई खुला रूपमा सच्याइ अभिलेख (Corrections Log) मार्फत स्वीकार गर्नु।
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              ४. शून्य-भ्रम (Zero-Misinformation)
            </span>
            <p className="text-slate-600">
              अप्रमाणित हल्ला, क्लिकबेट, वा अतिरञ्जित शीर्षकहरूबाट मुक्त रही विश्वसनीय सूचना मात्र प्रकाशन गर्नु।
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Authority */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 text-xs sm:text-sm text-slate-700">
        <h3 className="font-bold text-slate-900 text-base">
          सञ्चालन तथा सम्पादकीय अधिकार (Editorial Authority)
        </h3>
        <p className="leading-relaxed">
          खबर GPT ब्रान्ड, वेबसाइट, फेसबुक पेज, र सम्पूर्ण प्रकाशित सामग्रीमाथि यसको आधिकारिक सञ्चालक/मालिक (Owner) को पूर्ण नियन्त्रण तथा अन्तिम निर्णय अधिकार रहनेछ।
        </p>
        <p className="leading-relaxed">
          हामी स्वचालित रूपमा इन्टरनेटबाट बिना प्रमाणीकरण सामग्री तानेर प्रकाशन गर्दैनौँ। प्रत्येक लेख र भिडियो मालिकद्वारा समीक्षा र स्वीकृतिपछि मात्र सार्वजनिक गरिन्छ।
        </p>
      </section>

      {/* Connect */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <a
          href={settings.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 transition-colors"
        >
          <Facebook className="w-4 h-4" />
          <span>हाम्रो फेसबुक पेज हेर्नुहोस्</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={() => onNavigate('/contact')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
        >
          सम्पर्क वा प्रतिक्रिया पठाउनुहोस्
        </button>
      </div>
    </div>
  );
};
