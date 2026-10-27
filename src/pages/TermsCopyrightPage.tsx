import React from 'react';
import { ShieldCheck, AlertCircle, Send, ArrowRight } from 'lucide-react';
import { SiteSettings } from '../types';

interface TermsCopyrightPageProps {
  settings?: SiteSettings;
  onNavigate?: (path: string) => void;
}

export const TermsCopyrightPage: React.FC<TermsCopyrightPageProps> = ({
  settings,
  onNavigate
}) => {
  const displayEmail = settings?.contactEmail && !settings.contactEmail.toLowerCase().includes('khabargpt@gmail.com')
    ? settings.contactEmail
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900">
          प्रतिलिपि अधिकार तथा नियमहरू (Copyright & Terms)
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          वेबसाइटको सामग्री प्रयोग, बौद्धिक सम्पत्ति र कानुनी दायित्व सम्बन्धी सर्तहरू।
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        {/* 1. Ownership */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900">१. सामग्रीको स्वामित्व (Content Ownership)</h2>
          <p>
            खबर GPT (Khabar GPT) द्वारा उत्पादित मूल व्याख्यात्मक लेखहरू, संरचना, ब्रान्ड लोगो, र भिडियो विश्लेषणहरूको बौद्धिक सम्पत्ति तथा प्रतिलिपि अधिकार खबर GPT र यसका आधिकारिक सञ्चालकमा निहित छ।
          </p>
          <p className="text-xs text-slate-500">
            * नेपालको प्रतिलिपि अधिकार ऐन, २०५९ बमोजिम अनधिकृत रूपमा सम्पूर्ण सामग्री साभार गर्न वा व्यावसायिक प्रयोजानमा प्रयोग गर्न निषेध गरिएको छ।
          </p>
        </section>

        {/* 2. Fair Dealing & Attribution Rule */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900">२. उद्धरण र उचित प्रयोग (Fair Dealing & Attribution)</h2>
          <p>
            हाम्रा सामग्रीहरू गैर-व्यावसायिक शैक्षिक तथा जानकारीमूलक प्रयोजनका लागि सङ्क्षिप्त रूपमा उद्धृत गर्न सकिन्छ, तर त्यसो गर्दा <strong>खबर GPT</strong> लाई स्पष्ट रूपमा स्रोतका रूपमा उल्लेख गरी मूल लिङ्क राख्नुपर्नेछ।
          </p>
          <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            <strong>सचेतना: </strong> केवल स्रोत उल्लेख गर्दैमा कुनै पनि तेस्रो पक्षको सम्पूर्ण प्रतिलिपि अधिकार प्राप्त सामग्रीलाई बिना अनुमति पुनःप्रकाशन गर्न कानुनी छुट प्राप्त हुँदैन।
          </p>
        </section>

        {/* 3. Takedown & Copyright Notice */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <h2 className="text-base font-bold text-slate-900">३. प्रतिलिपि अधिकार दाबी प्रक्रिया (Notice and Takedown)</h2>
          <p>
            यदि तपाईंलाई लाग्छ कि हाम्रो वेबसाइटमा प्रस्तुत कुनै सामग्रीले तपाईंको प्रतिलिपि अधिकार वा बौद्धिक सम्पत्तिको उल्लङ्घन गरेको छ भने, कृपया प्रमाण र विवरणसहित हाम्रो आधिकारिक सम्पर्क फाराम
            {displayEmail ? ` वा आधिकारिक इमेल (${displayEmail})` : ''} मार्फत सन्देश पठाउनुहोस्। हामी तथ्य जाँच गरी २४ देखि ४८ घण्टाभित्र आवश्यक छानबिन तथा कानुनी कदम चाल्नेछौँ।
          </p>
          {onNavigate && (
            <div className="pt-1 flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate('/contact')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>सम्पर्क तथा उजुरी फाराम खोल्नुहोस्</span>
              </button>
              <button
                onClick={() => onNavigate('/copyright-and-corrections')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                <span>सच्याइ नीति हेर्नुहोस्</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </section>

        {/* 4. Poster Studio & User Responsibilities */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900">४. पोस्टर स्टुडियो प्रयोगका सर्तहरू (Poster Studio Acceptable Use)</h2>
          <p>
            हाम्रो ‘पोस्टर स्टुडियो’ मा उपलब्ध टेम्प्लेटहरू व्यक्तिगत, शैक्षिक र व्यावसायिक शुभकामना सिर्जनाका लागि निःशुल्क प्रयोग गर्न सकिन्छ। सबै पोस्टरहरूमा आधिकारिक खबर GPT लोगो तथा आधिकारिक फेसबुक ब्याज (KhabarGpt) अंकित हुन्छ।
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li>प्रयोगकर्ताले सिर्जना गरेका पोस्टरहरू खबर GPT को आधिकारिक वक्तव्य वा औपचारिक प्रेस विज्ञप्ति होइनन्।</li>
            <li>कुनै पनि व्यक्तिको मानहानी हुने, नक्कली समाचार फैलाउने, साम्प्रदायिक सद्भाव भड्काउने वा गैरकानुनी सामग्री पोस्टरमा राखी प्रचार गर्न कडा प्रतिबन्ध छ।</li>
            <li>प्रयोगकर्ताद्वारा सम्पादित सामग्रीको सम्पूर्ण नैतिक तथा कानुनी जिम्मेवारी प्रयोगकर्ता स्वयंमा रहनेछ।</li>
          </ul>
        </section>

        {/* 5. Non-Immunity Disclosure */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900">५. कानुनी दायित्व तथा स्पष्टोक्ति (Disclaimer & Liability)</h2>
          <p>
            हामी तथ्यपरक र निष्पक्ष सूचना प्रस्तुत गर्न हरसम्भव सावधानी अपनाउँछौँ। तर कुनै पनि डिस्क्लेमरले कानुन बमोजिम लाग्ने कानुनी उत्तरदायित्वबाट पूर्ण उन्मुक्ति (Blanket Legal Immunity) दिँदैन भन्ने तथ्यमा हामी सचेत छौँ। त्यसैले, हामी नेपालका विद्यमान ऐन, कानुन, र अदालतका नजिरहरूको पूर्ण सम्मान गर्दै जिम्मेवार नागरिकको रूपमा सूचना सम्प्रेषण गर्दछौँ।
          </p>
        </section>
      </div>
    </div>
  );
};
