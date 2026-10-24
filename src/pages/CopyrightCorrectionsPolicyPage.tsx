import React from 'react';
import { ShieldCheck, AlertCircle, FileText, CheckCircle2, Send, ExternalLink, Flag } from 'lucide-react';
import { KhabarLogo } from '../components/KhabarLogo';
import { SiteSettings } from '../types';

interface CopyrightCorrectionsPolicyPageProps {
  settings?: SiteSettings;
  onNavigate?: (path: string) => void;
}

export const CopyrightCorrectionsPolicyPage: React.FC<CopyrightCorrectionsPolicyPageProps> = ({
  settings,
  onNavigate
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 font-sans text-slate-800">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <KhabarLogo size="sm" customUrl={settings?.customLogoUrl || '/logo.png'} title={settings?.siteTitle || 'Khabar GPT'} />
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 block">
              बौद्धिक सम्पत्ति तथा सम्पादकीय सच्याइ
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              प्रतिलिपि अधिकार तथा सच्याइ नीति (Copyright & Corrections)
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          नेपालको प्रतिलिपि अधिकार ऐन, २०५९ को परिपालना, स्रोतको उचित प्रयोग, गल्ती सच्याउने कार्यविधि र उजुरी प्रक्रिया।
        </p>
      </div>

      {/* Content */}
      <div className="space-y-5 text-xs sm:text-sm leading-relaxed">
        {/* 1. Copyright & Fair Dealing */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            <h2>१. प्रतिलिपि अधिकार र उचित प्रयोग (Fair Dealing & Copyright)</h2>
          </div>
          <p className="text-slate-700">
            खबर GPT का मूल लेख, विश्लेषण, भिडियो संरचना, इन्फोग्राफिक्स र लोगो यस संस्थाका बौद्धिक सम्पत्ति हुन्।
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>शैक्षिक, खोजमूलक वा नागरिक सचेतनाका लागि सङ्क्षिप्त रूपमा सामग्री उद्धृत गर्दा <strong>खबर GPT</strong> र मूल लिङ्क स्पष्ट खुलाउनुपर्नेछ।</li>
            <li>व्यावसायिक फाइदाका लागि हाम्रो सामग्री बिना पूर्वस्वीकृति हुबहु कपि-पेस्ट गर्न निषेध छ।</li>
          </ul>
        </section>

        {/* 2. Notice and Takedown */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
            <Flag className="w-5 h-5 text-blue-600" />
            <h2>२. प्रतिलिपि अधिकार दाबी तथा सामग्री हटाउने प्रक्रिया (Notice & Takedown)</h2>
          </div>
          <p className="text-slate-700">
            यदि तपाईंलाई लाग्छ कि हाम्रो प्लेटफर्ममा प्रस्तुत कुनै सामग्रीले तपाईंको स्वामित्व वा बौद्धिक सम्पत्ति उल्लङ्घन गरेको छ भने, कृपया निम्न प्रमाणसहित हामीलाई सम्पर्क गर्नुहोस्:
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-600">
            <li>उल्लङ्घन भएको मूल सामग्रीको लिङ्क वा प्रमाणिक कागजात</li>
            <li>हाम्रो वेबसाइटमा रहेको सम्बन्धित पृष्ठको URL</li>
            <li>दाबीकर्ताको नाम, संस्था, आधिकारिक सम्पर्क नम्बर र इमेल</li>
          </ol>
          <p className="text-xs text-slate-700 pt-1 font-medium">
            हामी प्रमाण अध्ययन गरी २४ देखि ४८ घण्टाभित्र आवश्यक छानबिन तथा सामग्री परिमार्जन/हटाउने कदम चाल्नेछौँ।
          </p>
        </section>

        {/* 3. Transparent Corrections Policy */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h2>३. त्रुटि स्वीकार तथा सार्वजनिक सच्याइ नीति (Corrections Policy)</h2>
          </div>
          <p className="text-slate-700">
            हामी मान्दछौँ कि पत्रकारिता र सूचना लेखनमा कहिलेकाहीँ अनजानमा तथ्यगत त्रुटिहरू हुन सक्छन्। हाम्रो नीति त्रुटि लुकाउने होइन, पाठकहरूप्रति जिम्मेवार बन्दै पारदर्शी रूपमा सच्याउने हो:
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-700">
            <p><strong>• तत्काल संशोधन: </strong> त्रुटि प्रमाणित हुनासाथ सम्बन्धित लेखमा सच्याइन्छ।</p>
            <p><strong>• सम्पादकीय टिप्पणी: </strong> के गल्ती भएको थियो र कहिले सच्याइयो भन्ने कुरा लेखको तल स्पष्ट रूपमा टिपोट गरिन्छ।</p>
            <p><strong>• सार्वजनिक अभिलेख: </strong> सबै सच्याइएका विवरणहरू हाम्रो <span className="font-semibold text-red-600">/corrections</span> पृष्ठमा स्थायी रूपमा संग्रह गरिन्छ।</p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('/corrections')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>सच्याइ संग्रह (Corrections Archive) हेर्नुहोस्</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            {onNavigate && (
              <button
                onClick={() => onNavigate('/contact')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>सच्याइ वा उजुरी पठाउनुहोस्</span>
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
