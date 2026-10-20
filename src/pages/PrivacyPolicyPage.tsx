import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-bold uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
          <Shield className="w-4 h-4 text-slate-600" />
          <span>डाटा सुरक्षा & पारदर्शि नीति</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900">
          गोपनीयता नीति (Privacy Notice)
        </h1>
        <p className="text-xs text-slate-500 font-mono">अन्तिम परिमार्जन: २०२६ अक्टोबर</p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900">१. सामान्य जानकारी</h2>
          <p>
            खबर GPT (Khabar GPT) आफ्ना पाठकहरूको व्यक्तिगत गोपनीयताको उच्च सम्मान गर्दछ। हामी अनावश्यक व्यक्तिगत विवरणहरू सङ्कलन गर्दैनौँ र प्रयोगकर्ताहरूको डाटा तेस्रो पक्षलाई बिक्री गर्दैनौँ।
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900">२. सङ्कलन गरिने विवरणहरू</h2>
          <p>
            <strong>सम्पर्क फाराम: </strong> यदि तपाईंले सम्पर्क फाराम मार्फत सन्देश पठाउनुभयो भने, तपाईंले उपलब्ध गराउनुभएको नाम, इमेल, विषय र सन्देश तपाईंको सोधपुछको जवाफ दिन मात्र प्रयोग गरिन्छ।
          </p>
          <p>
            <strong>सर्भर र ट्राफिक लग (Hosting Logs): </strong> वेबसाइटको सुरक्षा, डीडीओएस (DDoS) आक्रमणबाट बचावट, र प्रणालीको भरपर्दोपनका लागि सामान्य सर्भर लगहरू (जस्तै आईपी ठेगाना, ब्राउजरको प्रकार, अनुरोध मिति र समय) सीमित अवधिका लागि सर्भर स्तरमा सुरक्षित रहन सक्छन्।
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900">३. कुकिज र लोकल स्टोरेज (Cookies & LocalStorage)</h2>
          <p>
            हाम्रो सार्वजनिक वेबसाइटले अनावश्यक ट्र्याकिङ वा विज्ञापन कुकिज प्रयोग गर्दैन। वेबसाइटमा व्यवस्थापक लगइन सत्र (Admin Session) सुरक्षित राख्नका लागि केवल आवश्यक टोकन (Authentication Token) ब्राउजरको सुरक्षित स्टोरेजमा राखिन्छ।
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900">४. तेस्रो पक्ष इम्बेड र बाह्य लिङ्कहरू (Third-Party Embeds)</h2>
          <p>
            हाम्रो वेबसाइटमा आधिकारिक फेसबुक (Facebook) भिडियो वा पोस्टका लिङ्कहरू समावेश हुन सक्छन्। जब तपाईं फेसबुकको आधिकारिक पृष्ठ खोल्नुहुन्छ, मेटा (Meta) को आफ्नै गोपनीयता नीति लागू हुन्छ।
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900">५. सम्पर्क र गुनासो</h2>
          <p>
            गोपनीयता सम्बन्धी कुनै पनि जिज्ञासा वा आफ्नो विवरण हटाउन अनुरोध गर्न चाहनुहुन्छ भने हाम्रो सम्पर्क पृष्ठ वा आधिकारिक इमेल <strong>contact@khabargpt.com</strong> मा सम्पर्क गर्न सक्नुहुन्छ।
          </p>
        </section>
      </div>
    </div>
  );
};
