import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const TermsCopyrightPage: React.FC = () => {
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
            * नेपालको प्रतिलिपि अधिकार ऐन, २०५९ बमोजिम अनधिकृत रूपमा सम्पूर्ण सामग्री साभार गर्न वा व्यावसायिक प्रयोजनमा प्रयोग गर्न निषेध गरिएको छ।
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
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900">३. प्रतिलिपि अधिकार दाबी प्रक्रिया (Notice and Takedown)</h2>
          <p>
            यदि तपाईंलाई लाग्छ कि हाम्रो वेबसाइटमा प्रस्तुत कुनै सामग्रीले तपाईंको प्रतिलिपि अधिकार वा बौद्धिक सम्पत्तिको उल्लङ्घन गरेको छ भने, कृपया प्रमाण र विवरणसहित हाम्रो सम्पर्क फाराम वा <strong>contact@khabargpt.com</strong> मा सन्देश पठाउनुहोस्। हामी तथ्य जाँच गरी २४ देखि ४८ घण्टाभित्र आवश्यक कानुनी कदम चाल्नेछौँ।
          </p>
        </section>

        {/* 4. Non-Immunity Disclosure */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900">४. कानुनी दायित्व तथा स्पष्टोक्ति (Disclaimer & Liability)</h2>
          <p>
            हामी तथ्यपरक र निष्पक्ष सूचना प्रस्तुत गर्न हरसम्भव सावधानी अपनाउँछौँ। तर कुनै पनि डिस्क्लेमरले कानुन बमोजिम लाग्ने कानुनी उत्तरदायित्वबाट पूर्ण उन्मुक्ति (Immunity) दिँदैन भन्ने तथ्यमा हामी सचेत छौँ। त्यसैले, हामी नेपालका विद्यमान ऐन, कानुन, र अदालतका नजिरहरूको पूर्ण सम्मान गर्दै जिम्मेवार नागरिकको रूपमा सूचना सम्प्रेषण गर्दछौँ।
          </p>
        </section>
      </div>
    </div>
  );
};
