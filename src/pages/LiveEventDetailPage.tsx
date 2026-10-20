import React, { useState, useEffect } from 'react';
import { LiveEvent, LiveUpdate } from '../types';
import { api } from '../services/api';
import {
  ArrowLeft,
  Zap,
  Clock,
  Pin,
  RefreshCw,
  Share2,
  Check,
  Copy,
  Facebook,
  MessageCircle,
  AlertCircle,
  Radio
} from 'lucide-react';

interface LiveEventDetailPageProps {
  eventIdOrSlug: string;
  onBack: () => void;
}

export const LiveEventDetailPage: React.FC<LiveEventDetailPageProps> = ({ eventIdOrSlug, onBack }) => {
  const [event, setEvent] = useState<LiveEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchEvent = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      const data = await api.getLiveEvent(eventIdOrSlug);
      setEvent(data);
    } catch (err) {
      console.warn('Failed to fetch live event:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventIdOrSlug]);

  // Auto-refresh timer
  useEffect(() => {
    if (!autoRefresh || !event || event.status !== 'live') return;
    const interval = setInterval(() => {
      fetchEvent();
    }, 25000); // 25s
    return () => clearInterval(interval);
  }, [autoRefresh, event]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading && !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-600 text-sm">प्रत्यक्ष कभरेज लोड हुँदैछ...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">प्रत्यक्ष कभरेज फेला परेन</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
        >
          पछाडि फर्कनुहोस्
        </button>
      </div>
    );
  }

  const pinnedUpdate = event.pinnedUpdateId
    ? event.updates.find((u) => u.id === event.pinnedUpdateId)
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-20">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>पछाडि फर्कनुहोस्</span>
      </button>

      {/* Live Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {event.status === 'live' ? (
              <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                प्रत्यक्ष कभरेज (LIVE)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-slate-700 text-slate-300 text-xs font-bold uppercase px-3 py-1 rounded-full">
                समाप्त भएको कभरेज (ENDED)
              </span>
            )}
            <span className="text-xs text-slate-400 font-medium">{event.category}</span>
          </div>

          {/* Auto Refresh Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                autoRefresh
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {autoRefresh ? 'स्वचालित रिफ्रेस सक्रिय' : 'स्वचालित रिफ्रेस बन्द'}
            </button>
            <button
              onClick={() => fetchEvent(true)}
              disabled={refreshing}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
              title="अहिले ताजा गर्नुहोस्"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-red-400' : ''}`} />
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-snug">
          {event.title}
        </h1>

        {event.titleEn && <p className="text-sm text-slate-400 italic">{event.titleEn}</p>}

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          {event.summary}
        </p>

        {/* Share & Stats Row */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span>कुल अपडेटहरू: <strong className="text-white">{event.updates.length}</strong></span>
            <span>हेराइ: <strong className="text-white">{event.views || 1}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'कपी भयो' : 'लिङ्क सेयर'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notice / Disclaimer for Live coverage */}
      <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-start gap-2 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">प्रत्यक्ष कभरेज सूचना:</span> घटनाको विकासक्रमसँगै तत्काल प्राप्त जानकारी यहाँ अद्यावधिक गरिन्छ। प्रारम्भिक जानकारीहरू पुष्टि भएबमोजिम सच्याइने वा परिमार्जन गरिनेछ।
        </div>
      </div>

      {/* Pinned Update (if any) */}
      {pinnedUpdate && (
        <div className="p-4 sm:p-5 bg-red-50 border-2 border-red-300 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-black text-red-700 uppercase tracking-wider">
            <Pin className="w-4 h-4 fill-red-600" />
            <span>प्रमुख मुख्य अपडेट (Pinned Key Highlight)</span>
            <span className="text-slate-500 font-normal">· {pinnedUpdate.timeLabel || 'अहिले'}</span>
          </div>
          {pinnedUpdate.title && <h3 className="font-bold text-base text-slate-900">{pinnedUpdate.title}</h3>}
          <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">{pinnedUpdate.content}</div>
        </div>
      )}

      {/* Timeline Stream of Live Updates */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-red-600" />
          <span>अपडेटहरूको समयतालिका (Live Updates Stream)</span>
        </h2>

        {event.updates.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 text-sm">
            हाल कुनै अपडेट पोस्ट गरिएको छैन। केही क्षणमै नयाँ अपडेट आउनेछ।
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-6 pl-4 sm:pl-6 space-y-6">
            {event.updates.map((update) => (
              <div key={update.id} className="relative group">
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-[23px] sm:-left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    update.isBreaking ? 'bg-red-600 animate-pulse ring-4 ring-red-100' : 'bg-slate-600'
                  }`}
                ></div>

                {/* Card */}
                <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                        {update.timeLabel || new Date(update.timestamp).toLocaleTimeString('ne-NP')}
                      </span>
                      {update.isBreaking && (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 font-extrabold px-2 py-0.5 rounded text-[11px] uppercase">
                          <Zap className="w-3 h-3 fill-red-600" />
                          ब्रेकिङ
                        </span>
                      )}
                      {update.author && <span className="text-slate-500">· {update.author}</span>}
                    </div>
                  </div>

                  {update.title && <h3 className="font-bold text-base text-slate-900">{update.title}</h3>}

                  <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                    {update.content}
                  </div>

                  {update.mediaUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden max-h-96">
                      <img src={update.mediaUrl} alt="" className="w-full object-cover rounded-xl" />
                    </div>
                  )}

                  {update.sourceAttribution && (
                    <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 italic">
                      स्रोत: {update.sourceAttribution}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
