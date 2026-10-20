import React, { useState, useEffect } from 'react';
import { ContentItem, MarketSnapshot } from '../types';
import { getNepaliDate, toNepaliDigits } from '../utils/nepaliCalendar';
import { api } from '../services/api';
import {
  X,
  Mail,
  Send,
  Calendar,
  Check,
  Copy,
  TrendingUp,
  Award,
  Sparkles,
  Bookmark,
  Share2,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  Clock
} from 'lucide-react';

interface DailyDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ContentItem[];
  onSelectArticle?: (slugOrId: string) => void;
}

export const DailyDigestModal: React.FC<DailyDigestModalProps> = ({
  isOpen,
  onClose,
  content,
  onSelectArticle
}) => {
  const nepaliDate = getNepaliDate();
  const [emailInput, setEmailInput] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [market, setMarket] = useState<MarketSnapshot | null>(null);

  // Filter top 5 published news/explainers
  const topArticles = content
    .filter((c) => c.status === 'published')
    .slice(0, 5);

  useEffect(() => {
    if (isOpen) {
      api.getMarketData().then((m) => setMarket(m)).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const [submittingSub, setSubmittingSub] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    setSubmittingSub(true);
    setSubError(null);
    try {
      await api.subscribeNewsletter(emailInput, frequency);
      setSubscribed(true);
      setTimeout(() => {
        setEmailInput('');
      }, 3000);
    } catch (err: unknown) {
      setSubError(err instanceof Error ? err.message : 'दर्ता गर्न सकिएन');
    } finally {
      setSubmittingSub(false);
    }
  };

  // Generate plain text formatted for WhatsApp / Viber sharing
  const getShareableText = () => {
    let text = `📰 खबर GPT - दैनिक न्यूजलेटर डाइजेस्ट\n`;
    text += `📅 मिति: ${nepaliDate.dateFormattedNp} (${nepaliDate.tithiNp})\n`;
    text += `-------------------------------------------\n\n`;

    text += `📌 आजका मुख्य ५ तथ्यपरक खबरहरू:\n`;
    topArticles.forEach((art, idx) => {
      text += `${idx + 1}. ${art.title}\n`;
      text += `   सार: ${art.summary.slice(0, 90)}...\n`;
      text += `   विस्तृत: https://khabargpt.com/article/${art.slug}\n\n`;
    });

    if (market) {
      text += `📊 आजको बजार दर (Nepal Market Snapshot):\n`;
      text += `• नेप्से (NEPSE): ${market.nepse.index.toLocaleString()} (${market.nepse.change >= 0 ? '+' : ''}${market.nepse.change})\n`;
      text += `• छापावाल सुन: रु ${market.goldSilver.fineGoldTola.toLocaleString()} / तोला\n`;
      text += `• चाँदी: रु ${market.goldSilver.silverTola.toLocaleString()} / तोला\n`;
      text += `• पेट्रोल: रु ${market.fuel.petrolLitre} | डिजेल: रु ${market.fuel.dieselLitre}\n\n`;
    }

    text += `-------------------------------------------\n`;
    text += `💡 आधिकारिक वेबसाइट: https://khabargpt.com\n`;
    text += `📲 WhatsApp च्यानल: https://whatsapp.com/channel/khabargpt\n`;
    return text;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getShareableText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-6 my-auto animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  दैनिक डिजिटल बुलेटिन
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {nepaliDate.dateFormattedNp}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                आजको दैनिक न्यूजलेटर डाइजेस्ट
              </h3>
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

        {/* Today's Market Quick Recap in Digest */}
        {market && (
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>आजको बजार सार (Market Snapshot)</span>
              </span>
              <span className="font-mono text-[10px]">स्रोत: NEPSE / FENEGOSIDA / NOC</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
              <div className="bg-slate-800/80 p-2 rounded-xl">
                <span className="text-slate-400 block text-[10px]">नेप्से परिसूचक:</span>
                <span className="font-bold text-white font-mono">
                  {market.nepse.index.toLocaleString()}
                </span>
                <span className={`block text-[10px] font-mono ${market.nepse.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {market.nepse.change >= 0 ? '+' : ''}{market.nepse.change} अंक
                </span>
              </div>

              <div className="bg-slate-800/80 p-2 rounded-xl">
                <span className="text-slate-400 block text-[10px]">छापावाल सुन:</span>
                <span className="font-bold text-amber-300 font-mono">
                  रु {market.goldSilver.fineGoldTola.toLocaleString()}
                </span>
                <span className="block text-[10px] text-slate-400">प्रति तोला</span>
              </div>

              <div className="bg-slate-800/80 p-2 rounded-xl">
                <span className="text-slate-400 block text-[10px]">चाँदी दर:</span>
                <span className="font-bold text-slate-200 font-mono">
                  रु {market.goldSilver.silverTola.toLocaleString()}
                </span>
                <span className="block text-[10px] text-slate-400">प्रति तोला</span>
              </div>

              <div className="bg-slate-800/80 p-2 rounded-xl">
                <span className="text-slate-400 block text-[10px]">पेट्रोल / डिजेल:</span>
                <span className="font-bold text-emerald-300 font-mono">
                  रु {market.fuel.petrolLitre} / {market.fuel.dieselLitre}
                </span>
                <span className="block text-[10px] text-slate-400">प्रति लिटर (काठमाडौं)</span>
              </div>
            </div>
          </div>
        )}

        {/* Curated Top 5 News & Explainers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-red-600" />
              <span>आजका शीर्ष ५ तथ्यपरक समाचार र विश्लेषण</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              {topArticles.length} विषयहरू संकलित
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {topArticles.map((art, idx) => (
              <div
                key={art.id}
                onClick={() => {
                  if (onSelectArticle) {
                    onSelectArticle(art.slug || art.id);
                    onClose();
                  }
                }}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-red-300 transition-all cursor-pointer group space-y-1"
              >
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-bold text-red-600 bg-red-100/60 px-2 py-0.5 rounded">
                    {idx + 1}. {art.category}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    {new Date(art.createdAt).toLocaleDateString('ne-NP')}
                  </span>
                </div>

                <h5 className="font-bold text-sm text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                  {art.title}
                </h5>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {art.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 1-Click WhatsApp / Viber Broadcast Copy Button */}
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="block text-emerald-900">ह्वाट्सएप वा भाइबरमा प्रसारण गर्नुहोस्</strong>
              <span className="text-[11px] text-emerald-700">१-क्लिकमा तयार फर्म्याट गरिएको टेक्स्ट कपि गर्नुहोस्</span>
            </div>
          </div>

          <button
            onClick={handleCopyText}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>कपि भयो!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>फर्म्याट टेक्स्ट कपि</span>
              </>
            )}
          </button>
        </div>

        {/* Subscribe Box */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              दैनिक बिहान ७ बजेको इमेल बुलेटिन सब्स्क्राइब गर्नुहोस्
            </h5>
          </div>

          {subscribed ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>धन्यवाद! तपाईंको इमेल सफलतापूर्वक दर्ता भयो। अब दैनिक बिहान ७ बजे डाइजेस्ट प्राप्त हुनेछ।</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="तपाईंको इमेल ठेगाना (उदा: yourname@gmail.com)"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>निःशुल्क सब्स्क्राइब</span>
              </button>
            </form>
          )}
          <p className="text-[10px] text-slate-400">
            * कुनै विज्ञापन वा स्पाम पठाइने छैन। तपाईं जुनसुकै बेला एक क्लिकमा अनसब्स्क्राइब गर्न सक्नुहुन्छ।
          </p>
        </div>
      </div>
    </div>
  );
};
