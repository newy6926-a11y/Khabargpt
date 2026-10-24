import React from 'react';
import { AlertTriangle, ShieldCheck, FileText, Info, Scale, CheckCircle2 } from 'lucide-react';
import { KhabarLogo } from '../components/KhabarLogo';
import { SiteSettings } from '../types';

interface ContentDisclaimerPageProps {
  settings?: SiteSettings;
  onNavigate?: (path: string) => void;
}

export const ContentDisclaimerPage: React.FC<ContentDisclaimerPageProps> = ({ settings, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 font-sans text-slate-800">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <KhabarLogo size="sm" customUrl={settings?.customLogoUrl || '/logo.png'} title={settings?.siteTitle || 'Khabar GPT'} />
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 block">
              कानुनी तथा सम्पादकीय स्पष्टीकरण
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              सामग्री डिस्क्लेमर तथा कानुनी दायित्व (Content Disclaimer)
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          खबर GPT मा प्रकाशित सामग्रीहरूको शैक्षिक उद्देश्य, AI चित्रण नीति, बजार दरहरूको प्रकृति र कानुनी उत्तरदायित्व सम्बन्धी आधिकारिक नीति।
        </p>
      </div>

      {/* Disclaimers List */}
      <div className="space-y-5 text-xs sm:text-sm leading-relaxed">
        {/* 1. Educational & Non-Immunity */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
            <Scale className="w-5 h-5 text-red-600" />
            <h2>१. सूचनामूलक उद्देश्य र कानुनी उत्तरदायित्व (Non-Immunity Clause)</h2>
          </div>
          <p className="text-slate-700">
            खबर GPT कुनै पनि सरकारी निकाय, अदालत वा आधिकारिक नियामक संस्था होइन। यहाँ प्रस्तुत सामग्रीहरू नागरिक सचेतना, समसामयिक छलफल र शैक्षिक प्रयोजनका लागि सार्वजनिक स्रोतहरूबाट अध्ययन गरी तयार पारिएका हुन्।
          </p>
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 font-medium">
            <strong>महत्त्वपूर्ण कानुनी स्पष्टीकरण: </strong> कुनै पनि डिस्क्लेमरले कानुन बमोजिम लाग्ने कानुनी उत्तरदायित्वबाट पूर्ण उन्मुक्ति (Blanket Legal Immunity) दिँदैन भन्ने तथ्यमा हामी पूर्ण सचेत छौँ। त्यसैले, हामी नेपालको प्रचलित कानुन, साइबर सुरक्षा निर्देशिका र अदालतका नजिरहरूको पूर्ण पालना गर्दै जिम्मेवार सूचना सम्प्रेषण गर्दछौँ।
          </div>
        </section>

        {/* 2. AI Visuals Policy */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
            <Info className="w-5 h-5 text-blue-600" />
            <h2>२. AI तथा सांकेतिक चित्रण नीति (AI-Generated Visuals Policy)</h2>
          </div>
          <p className="text-slate-700">
            जहाँ प्रत्यक्ष घटनाको वास्तविक तस्बिर उपलब्ध हुँदैन, त्यहाँ विषयवस्तुलाई बुझाउन कलात्मक, ग्राफिकल वा AI-सिर्जित सांकेतिक तस्बिरहरू प्रयोग गरिएको हुन सक्छ।
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>सांकेतिक तस्बिरहरूलाई वास्तविक फोटोग्राफीको रूपमा भ्रम नपरोस् भनी स्पष्ट क्याप्सन वा सांकेतिक डिस्क्लेमर राखिन्छ।</li>
            <li>कुनै पनि व्यक्तिको चरित्र हत्या गर्ने, नक्कली अडियो/भिडियो (Deepfake) वा समाजमा साम्प्रदायिक तनाव फैलाउने किसिमका दृश्यहरू सिर्जना वा प्रकाशन गर्न पूर्ण निषेध गरिएको छ।</li>
          </ul>
        </section>

        {/* 3. Market Rates Disclaimer */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2>३. सुनचाँदी, नेप्से तथा बजार दरहरूको डिस्क्लेमर (Market Rates)</h2>
          </div>
          <p className="text-slate-700">
            वेबसाइटमा प्रदर्शित सुनचाँदी, इन्धन र सेयर बजारका सूचकांकहरू नेपाल सुनचाँदी व्यवसायी महासंघ, नेपाल आयल निगम र नेपाल स्टक एक्सचेन्जका सार्वजनिक तथ्यांकमा आधारित हुन्छन्।
          </p>
          <p className="text-xs text-slate-600">
            बजारमा स्थानीय स्थान, समय र शुल्कका आधारमा मूल्यमा सामान्य भिन्नता हुन सक्छ। कुनै पनि लगानी वा खरिद-बिक्री सम्बन्धी निर्णय लिनुपूर्व सम्बन्धित आधिकारिक स्रोत वा वित्तीय सल्लाहकारसँग प्रत्यक्ष प्रमाणीकरण गर्नुहोस्।
          </p>
        </section>

        {/* 4. User-Created Posters */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2>४. पोस्टर स्टुडियो प्रयोगकर्ताको दायित्व (User-Generated Posters)</h2>
          </div>
          <p className="text-slate-700">
            हाम्रो ‘पोस्टर स्टुडियो’ मार्फत प्रयोगकर्ताले आफ्नो इच्छाअनुसार व्यक्तिगत कार्ड, शुभकामना वा सूचना सम्पादन गर्न सक्छन्।
          </p>
          <p className="text-xs text-slate-600">
            प्रयोगकर्ताले सम्पादन गरी तयार पारेको पोस्टर खबर GPT को आधिकारिक वक्तव्य होइन। प्रयोगकर्ताद्वारा सम्पादित सामग्रीबाट सिर्जना हुन सक्ने कुनै पनि व्यक्तिगत, कानुनी वा मानहानीजन्य विवादमा प्रयोगकर्ता स्वयं जिम्मेवार हुनेछ।
          </p>
        </section>
      </div>
    </div>
  );
};
