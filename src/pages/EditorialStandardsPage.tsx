import React from 'react';
import { ShieldCheck, Check, AlertCircle, FileText, Eye, Cpu } from 'lucide-react';

export const EditorialStandardsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span>विश्वसनीयता & आचारसंहिता</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900">
          सम्पादकीय मापदण्ड तथा नीति (Editorial Standards)
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          खबर GPT मा सामग्री तयार, समीक्षा र प्रकाशन गर्दा पालना गरिने आधारभूत सिद्धान्तहरू।
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        {/* 1. Fact Checking */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>१. तथ्यपरक शुद्धता (Factual Accuracy & Verification)</span>
          </h2>
          <p>
            हामी कुनै पनि जानकारी सार्वजनिक गर्नुअघि त्यसको मूल स्रोत (सरकारी राजपत्र, मन्त्रालयको सूचना, नेपाल राष्ट्र बैंकको तथ्याङ्क, वा सम्बन्धित आधिकारिक संस्थाको विज्ञप्ति) बाट अनिवार्य रूपमा प्रमाणीकरण गर्छौँ।
          </p>
        </section>

        {/* 2. Allegations vs Confirmed Facts */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>२. अभियोग र प्रमाणित तथ्यबीच स्पष्ट भिन्नता (Allegations vs Facts)</span>
          </h2>
          <p>
            अदालत वा आधिकारिक अनुसन्धान निकायबाट अन्तिम फैसला नभएसम्म कसैलाई पनि दोषी करार गरिँदैन। आरोप वा अनुसन्धानको चरणमा रहेका विषयहरूलाई स्पष्ट रूपमा "आरोप" वा "दाबी" भनी किटान गरिन्छ।
          </p>
        </section>

        {/* 3. Responsible AI Disclosure */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>३. एआई (AI) र प्रविधिको जिम्मेवार प्रयोग (Responsible AI Disclosure)</span>
          </h2>
          <p>
            नाममा 'GPT' रहे तापनि खबर GPT का सामग्रीहरू स्वचालित बोट वा बिना-समीक्षा कम्प्युटरले उत्पादन गर्दैनन्। एआई प्रविधिहरू अनुसन्धान, भाषा परिमार्जन, र सारांशीकरणमा सहायक उपकरणका रूपमा मात्र प्रयोग हुन सक्छन्। हरेक सामग्रीको सम्पादन, तथ्य परीक्षण, र प्रकाशनको अन्तिम निर्णय मानव सम्पादक (मानव सञ्चालक) द्वारा गरिन्छ।
          </p>
        </section>

        {/* 4. Privacy & Dignity */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>४. व्यक्तिगत गोपनीयता र प्रतिष्ठा (Privacy & Fair Dealing)</span>
          </h2>
          <p>
            नेपालको वैयक्तिक गोपनीयता सम्बन्धी ऐन, २०७५ अनुसार व्यक्तिको अनुमति बिना निजी तस्बिर, फोन नम्बर, वा व्यक्तिगत जीवन सम्बन्धी विवरण सार्वजनिक गरिँदैन।
          </p>
        </section>

        {/* 5. Corrections Policy */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>५. खुला सच्याइ नीति (Transparent Corrections)</span>
          </h2>
          <p>
            यदि कुनै सामग्रीमा तथ्यगत वा प्राविधिक त्रुटि फेला परेमा, पाठकलाई थाहा नदिई सुटुक्क हटाइने छैन। त्रुटि के थियो र नयाँ तथ्य के हो भनी मितिसहित सार्वजनिक "सच्याइ पृष्ठ" (Corrections Page) मा खुलाइनेछ।
          </p>
        </section>

        {/* 6. Sponsored Content Disclosure */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>६. प्रायोजित सामग्रीको स्पष्ट खुलासा (Sponsored Content Disclosure)</span>
          </h2>
          <p>
            कुनै व्यापारिक वा प्रायोजित सामग्री भएमा त्यसलाई नियमित सूचना वा समाचार सरह नभई स्पष्ट रूपमा "प्रायोजित" वा "विज्ञापन" भनी लेबल गरिनेछ।
          </p>
        </section>
      </div>
    </div>
  );
};
