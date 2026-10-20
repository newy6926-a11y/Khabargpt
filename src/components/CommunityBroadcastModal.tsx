import React, { useState } from 'react';
import { SiteSettings } from '../types';
import {
  X,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Copy,
  Check,
  Smartphone,
  Users,
  BellRing
} from 'lucide-react';

interface CommunityBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: SiteSettings;
}

export const CommunityBroadcastModal: React.FC<CommunityBroadcastModalProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!isOpen) return null;

  // Retrieve channel URLs
  const whatsappUrl =
    settings?.whatsappUrl ||
    settings?.socialLinks?.find((s) => s.platform === 'whatsapp')?.url ||
    'https://whatsapp.com/channel/0029Vb3KhabarGPT';

  const viberUrl =
    settings?.socialLinks?.find((s) => s.platform === 'viber')?.url ||
    'https://invite.viber.com/?g2=KhabarGPTCommunity';

  const handleCopy = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 my-auto animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                WhatsApp & Viber प्रसारण च्यानल
              </h3>
              <p className="text-[11px] text-slate-500">
                दैनिक ताजा समाचार, तथ्य र बजार विश्लेषण सिधै तपाईंको मोबाइलमा
              </p>
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

        {/* Value Proposition Box */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <Sparkles className="w-3 h-3" />
              आधिकारिक डिजिटल समुदाय
            </span>
            <span className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
              <BellRing className="w-3.5 h-3.5 text-emerald-400" />
              प्रत्यक्ष समाचार प्रसारण
            </span>
          </div>

          <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
            किन जोडिने खबर GPT च्यानलमा?
          </h4>

          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>दैनिक बिहान ७ बजे मुख्य ३ खबर:</strong> अनावश्यक हल्ला र स्पाम बिना तथ्यपरक सार मात्र।</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>१००% गोपनीयता (Privacy First):</strong> तपाईंको फोन नम्बर अन्य सदस्यहरूलाई देखिँदैन।</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>ब्रेकिङ अलर्ट & बजार दर:</strong> सुन, सेयर र पेट्रोलियम दरको तत्काल सूचना।</span>
            </li>
          </ul>
        </div>

        {/* Primary Channels Join Buttons */}
        <div className="space-y-3">
          {/* WhatsApp Channel Card */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 0C5.394 0 0 5.394 0 12.031c0 2.115.55 4.179 1.594 5.992L.055 24l6.156-1.613a11.97 11.97 0 0 0 5.82 1.492c6.637 0 12.031-5.394 12.031-12.031C24.062 5.394 18.668 0 12.031 0zm0 21.996a9.92 9.92 0 0 1-5.066-1.385l-.364-.216-3.766.988 1.005-3.67-.236-.377a9.927 9.927 0 0 1-1.527-5.305c0-5.49 4.469-9.96 9.954-9.96 5.49 0 9.959 4.47 9.959 9.96 0 5.49-4.469 9.96-9.955 9.96zm5.457-7.464c-.299-.15-1.768-.873-2.042-.973-.274-.1-.473-.15-.672.15-.2.299-.773.973-.948 1.172-.174.2-.349.224-.648.075-.299-.15-1.263-.466-2.406-1.485-.89-.794-1.491-1.774-1.666-2.073-.174-.299-.019-.461.131-.61.135-.134.299-.349.449-.523.15-.174.2-.299.3-.499.1-.2.05-.374-.025-.523-.075-.15-.672-1.62-.922-2.219-.244-.583-.493-.504-.672-.513-.174-.009-.374-.01-.573-.01-.199 0-.523.075-.797.374-.274.299-1.047 1.022-1.047 2.493s1.072 2.892 1.221 3.091c.15.2 2.11 3.222 5.112 4.521.714.309 1.272.493 1.706.631.717.228 1.369.196 1.885.119.575-.086 1.768-.723 2.017-1.421.249-.698.249-1.296.174-1.42-.075-.125-.274-.2-.573-.349z"/>
                </svg>
              </div>
              <div>
                <h5 className="font-bold text-sm text-emerald-950">
                  Khabar GPT WhatsApp च्यानल
                </h5>
                <p className="text-[11px] text-emerald-800">
                  फलो गर्नुहोस् र घन्टी (Notification) अन गर्नुहोस्
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span>जोडिनुहोस्</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleCopy(whatsappUrl, 'wa')}
                className="p-2 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
                title="लिङ्क कपि गर्नुहोस्"
              >
                {copiedLink === 'wa' ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Viber Community Card */}
          <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7360f2] text-white flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.92 12.01c-.13-3.69-2.73-6.52-6.19-6.84-.36-.03-.66.24-.69.6-.03.36.24.66.6.69 2.87.27 5.01 2.61 5.12 5.64.01.36.31.64.67.63h.02c.35-.01.63-.31.62-.67l-.15-.05zm-3.21.05c-.09-1.92-1.39-3.41-3.15-3.61-.36-.04-.68.22-.72.58-.04.36.22.68.58.72 1.2.14 2.08 1.15 2.15 2.45.02.36.32.63.68.61.36-.02.63-.32.61-.68l-.15-.07zm6.75 3.79c-.5-1.57-1.42-2.92-2.67-3.92-.09-.07-.2-.11-.31-.11-.22 0-.42.14-.48.36-.07.25.04.52.27.65 1.12.89 1.94 2.1 2.38 3.5.07.24.31.39.56.36.24-.03.44-.22.47-.46.01-.13-.03-.26-.1-.38h-.12zm-3.83 5.48c-.68-.22-1.99-.81-4.04-1.89-3.03-1.6-5.83-4.14-7.66-6.95-1.2-1.85-1.9-3.32-2.2-4.12-.41-1.07-.15-2.09.68-2.69.75-.54 1.76-.55 2.49.03.36.29.98 1.34 1.54 2.47.47.95.83 1.83.67 2.33-.11.35-.35.61-.63.92-.22.24-.45.5-.6.76-.23.4-.17.78.16 1.32.86 1.41 1.98 2.68 3.32 3.76.63.51 1.09.7 1.53.58.33-.09.63-.33.91-.61.35-.35.66-.67 1.06-.82.52-.19 1.4.08 2.34.45 1.16.46 2.27 1.01 2.6 1.34.66.67.75 1.67.24 2.48-.56.88-1.5 1.18-2.45.88z"/>
                </svg>
              </div>
              <div>
                <h5 className="font-bold text-sm text-purple-950">
                  Khabar GPT Viber समुदाय
                </h5>
                <p className="text-[11px] text-purple-800">
                  नेपालको लोकप्रिय च्याट समुदायमा जोडिनुहोस्
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={viberUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#7360f2] hover:bg-[#604ee0] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span>जोडिनुहोस्</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleCopy(viberUrl, 'vib')}
                className="p-2 text-purple-700 hover:bg-purple-100 rounded-xl transition-colors cursor-pointer"
                title="लिङ्क कपि गर्नुहोस्"
              >
                {copiedLink === 'vib' ? <Check className="w-4 h-4 text-purple-700" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>सुरक्षित र आधिकारिक प्रसारण लिङ्कहरू</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};
