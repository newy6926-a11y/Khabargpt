import React from 'react';
import { CorrectionItem } from '../types';
import { AlertCircle, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface CorrectionsPageProps {
  corrections: CorrectionItem[];
  onSelectArticle?: (slugOrId: string) => void;
  onNavigate: (path: string) => void;
}

export const CorrectionsPage: React.FC<CorrectionsPageProps> = ({
  corrections,
  onSelectArticle,
  onNavigate
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-bold uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>जवाफदेहिता & खुलापन</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900">
          सच्याइ तथा स्पष्टीकरण अभिलेख (Corrections Log)
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          हाम्रो सम्पादकीय नीति अनुसार तथ्यमा कुनै त्रुटि भएमा पारदर्शी रूपमा सार्वजनिक गरिएको अभिलेख।
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
        <strong>हाम्रो सच्याइ नीति: </strong>
        खबर GPT मा प्रकाशित कुनै पनि लेख, भिडियो विवरण वा सूचनामा यदि तथ्यगत भूल भेटिएमा, हामी त्यसलाई लुकाउँदैनौँ। पाठकलाई झुक्याउने गरी चुपचाप सम्पादन गर्नुको सट्टा, के गलत थियो र सही तथ्य के हो भनी स्पष्ट मितिसहित यहाँ अभिलेखीकरण गरिन्छ।
      </div>

      {corrections.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center text-slate-500 text-sm space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <p className="font-semibold text-slate-800">हालसम्म कुनै सच्याइ प्रविष्टि छैन</p>
          <p className="text-xs">हाल प्रकाशित सबै सामग्रीहरू परीक्षण गरिएका तथ्य अनुसार छन्।</p>
        </div>
      ) : (
        <div className="space-y-6">
          {corrections.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900 text-base">
                  {item.contentTitle || 'सामान्य सामग्री'}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>सच्याइएको मिति: {item.issueDate}</span>
                </span>
              </div>

              {/* What was wrong vs what was corrected */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-red-50/70 border border-red-200 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-red-800">
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>त्रुटि / अपूर्ण जानकारी (Original Error):</span>
                  </div>
                  <p className="text-red-900 leading-relaxed">{item.originalError}</p>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>सच्याइएको तथ्य (Corrected Fact):</span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed">{item.correctedText}</p>
                </div>
              </div>

              {/* Explanation */}
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800">सम्पादकीय टिप्पणी: </span>
                {item.explanation}
              </div>

              {item.contentId && onSelectArticle && (
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => onSelectArticle(item.contentId!)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>सम्बन्धित मूल सामग्री हेर्नुहोस्</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Report an error prompt */}
      <div className="bg-slate-100 rounded-xl p-5 text-center space-y-2">
        <h3 className="text-sm font-bold text-slate-900">
          के तपाईंले कुनै गल्ती वा तथ्यगत कमजोरी फेला पार्नुभयो?
        </h3>
        <p className="text-xs text-slate-600">
          हामीलाई तुरुन्त जानकारी गराउनुहोस् ताकि हामी यसलाई प्रमाणीकरण गरी यथाशीघ्र सच्याउन सकौँ।
        </p>
        <button
          onClick={() => onNavigate('/contact')}
          className="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          त्रुटि सच्याउन अनुरोध पठाउनुहोस्
        </button>
      </div>
    </div>
  );
};
