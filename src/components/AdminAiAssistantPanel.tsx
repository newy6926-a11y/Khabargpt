import React, { useState } from 'react';
import { api } from '../services/api';
import {
  Sparkles,
  Wand2,
  Check,
  Copy,
  AlertTriangle,
  FileText,
  Search,
  BookOpen,
  Send,
  RefreshCw,
  Lightbulb
} from 'lucide-react';

interface AdminAiAssistantPanelProps {
  onApplyHeadline?: (headline: string) => void;
  onApplySeo?: (seo: string) => void;
  onApplyContent?: (content: string) => void;
}

export const AdminAiAssistantPanel: React.FC<AdminAiAssistantPanelProps> = ({
  onApplyHeadline,
  onApplySeo,
  onApplyContent
}) => {
  const [inputText, setInputText] = useState('');
  const [actionType, setActionType] = useState<
    'suggest_headlines' | 'polish_grammar' | 'generate_seo' | 'fact_check_advisory'
  >('suggest_headlines');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleRunAi = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setResultText('');
    try {
      const response = await api.runAiAssistant({
        action: actionType,
        text: inputText
      });
      setResultText(response.result);
    } catch (err: unknown) {
      setResultText(
        err instanceof Error
          ? `त्रुटि: ${err.message}`
          : 'AI सम्पादकीय सहायकसँग सम्पर्क हुन सकेन।'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (resultText) {
      navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI सम्पादकीय सहायक (AI Editorial Assistant)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            नेपाली भाषा र पत्रकारिता सहायक
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            आकर्षक शीर्षक सिर्जना, व्याकरण र नेपाली पत्रकारिता शैली परिमार्जन, SEO मेटा विवरण तथा तथ्य-जाँच सुझाव प्राप्त गर्नुहोस्।
          </p>
        </div>
      </div>

      {/* Action Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            id: 'suggest_headlines',
            label: 'शीर्षक सुझाव (Catchy Headlines)',
            icon: Lightbulb,
            desc: '५ वटा उच्च क्लिक-दर भएका शीर्षक'
          },
          {
            id: 'polish_grammar',
            label: 'शैली & व्याकरण परिमार्जन',
            icon: Wand2,
            desc: 'शुद्ध नेपाली पत्रकारिता भाषा'
          },
          {
            id: 'generate_seo',
            label: 'SEO मेटा विवरण (Meta Tag)',
            icon: Search,
            desc: 'Google र Facebook का लागि १५० अक्षर'
          },
          {
            id: 'fact_check_advisory',
            label: 'तथ्य-जाँच & संवेदनशीलता',
            icon: AlertTriangle,
            desc: 'कानुनी जोखिम र स्रोत प्रमाणीकरण'
          }
        ].map((act) => {
          const Icon = act.icon;
          const isActive = actionType === act.id;
          return (
            <button
              key={act.id}
              onClick={() => setActionType(act.id as any)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-50/80 border-purple-500 shadow-2xs ring-1 ring-purple-500'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                <span className={`text-xs font-bold ${isActive ? 'text-purple-950' : 'text-slate-700'}`}>
                  {act.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{act.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Editor & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Text */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>मूल समाचार वा मस्यौदा (Source Text):</span>
              <span className="text-[11px] text-slate-400 font-normal">
                {inputText.length} अक्षर
              </span>
            </label>
            <textarea
              rows={12}
              placeholder="यहाँ तपाईंको समाचार, टिप्पणी वा कच्चा ड्राफ्ट टाँस्नुहोस् वा लेख्नुहोस्..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full text-xs p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-sans leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setInputText('')}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              खाली गर्नुहोस्
            </button>

            <button
              onClick={handleRunAi}
              disabled={loading || !inputText.trim()}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Wand2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'विश्लेषण हुँदैछ...' : 'AI सहायक चलाउनुहोस्'}</span>
            </button>
          </div>
        </div>

        {/* Right: AI Result */}
        <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>AI सिफारिस र नतिजा:</span>
              </span>

              {resultText && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'कपि भयो!' : 'कपि गर्नुहोस्'}</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3 text-slate-400">
                <Wand2 className="w-8 h-8 animate-spin text-purple-400" />
                <span className="text-xs">नेपाली व्याकरण, शैली र पत्रकारिता नियम विश्लेषण गरिँदैछ...</span>
              </div>
            ) : resultText ? (
              <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line max-h-[380px] overflow-y-auto pr-1">
                {resultText}
              </div>
            ) : (
              <div className="py-24 text-center text-slate-500 text-xs space-y-2">
                <Sparkles className="w-8 h-8 text-slate-700 mx-auto" />
                <p>बायाँतर्फ पाठ राखेर 'AI सहायक चलाउनुहोस्' बटन थिच्नुहोस्।</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-[11px] text-slate-400">
            💡 <strong>सम्पादकीय सल्लाह:</strong> AI ले दिएका सुझावहरूलाई सधैँ मानव सम्पादकद्वारा अन्तिम समीक्षा (Fact-checking) गरेर मात्र प्रकाशित गर्नुहोस्।
          </div>
        </div>
      </div>
    </div>
  );
};
