import React, { useState } from 'react';
import { ContentItem, ArticleReactions } from '../types';
import { api } from '../services/api';
import { ThumbsUp, Heart, Lightbulb, HelpCircle, ThumbsDown, MessageSquare, Check, AlertCircle, X, Send } from 'lucide-react';

interface ArticleReactionsAndFeedbackProps {
  item: ContentItem;
}

export const ArticleReactionsAndFeedback: React.FC<ArticleReactionsAndFeedbackProps> = ({ item }) => {
  const [reactions, setReactions] = useState<ArticleReactions>(
    item.reactions || { useful: 0, love: 0, informative: 0, thoughtful: 0, disagree: 0 }
  );
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [loadingReaction, setLoadingReaction] = useState(false);

  // Feedback Modal State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'reaction' | 'correction' | 'tip' | 'general'>('reaction');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactContact, setContactContact] = useState('');
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const handleReact = async (type: 'useful' | 'love' | 'informative' | 'thoughtful' | 'disagree') => {
    if (selectedReaction === type || loadingReaction) return;
    setLoadingReaction(true);

    // Optimistic update
    setReactions((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1
    }));
    setSelectedReaction(type);

    try {
      const res = await api.recordReaction(item.id, type);
      if (res && res.reactions) {
        setReactions(res.reactions);
      }
    } catch (err) {
      console.warn('Reaction recording error:', err);
    } finally {
      setLoadingReaction(false);
    }
  };

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) {
      setFeedbackError('कृपया आफ्नो प्रतिक्रिया वा सुझाव लेख्नुहोस्।');
      return;
    }

    setSendingFeedback(true);
    setFeedbackError(null);

    try {
      await api.submitFeedback({
        articleId: item.id,
        articleTitle: item.title,
        type: feedbackType,
        message: feedbackMessage.trim(),
        contactName: contactName.trim() || undefined,
        contactEmailOrPhone: contactContact.trim() || undefined
      });
      setFeedbackSuccess(true);
      setTimeout(() => {
        setFeedbackSuccess(false);
        setFeedbackModalOpen(false);
        setFeedbackMessage('');
      }, 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setFeedbackError(msg || 'प्रतिक्रिया पठाउन सकिएन।');
    } finally {
      setSendingFeedback(false);
    }
  };

  return (
    <div className="border-t border-b border-slate-200 py-6 my-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">यो जानकारी तपाईंलाई कस्तो लाग्यो?</h3>
          <p className="text-xs text-slate-500">आफ्नो राय व्यक्त गर्नुहोस् वा सम्पादकीय समूहलाई सुझाव पठाउनुहोस्</p>
        </div>

        <button
          onClick={() => setFeedbackModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
          <span>सुझाव वा प्रतिक्रिया पठाउनुहोस्</span>
        </button>
      </div>

      {/* Reaction Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => handleReact('useful')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            selectedReaction === 'useful'
              ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:border-blue-200 hover:bg-slate-50'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${selectedReaction === 'useful' ? 'text-blue-600 fill-blue-600' : 'text-slate-500'}`} />
          <span>उपयोगी</span>
          <span className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-600">
            {reactions.useful || 0}
          </span>
        </button>

        <button
          onClick={() => handleReact('love')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            selectedReaction === 'love'
              ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:border-rose-200 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${selectedReaction === 'love' ? 'text-rose-600 fill-rose-600' : 'text-slate-500'}`} />
          <span>मनपर्यो</span>
          <span className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-600">
            {reactions.love || 0}
          </span>
        </button>

        <button
          onClick={() => handleReact('informative')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            selectedReaction === 'informative'
              ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:border-amber-200 hover:bg-slate-50'
          }`}
        >
          <Lightbulb className={`w-4 h-4 ${selectedReaction === 'informative' ? 'text-amber-600 fill-amber-600' : 'text-slate-500'}`} />
          <span>ज्ञानवर्धक</span>
          <span className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-600">
            {reactions.informative || 0}
          </span>
        </button>

        <button
          onClick={() => handleReact('thoughtful')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            selectedReaction === 'thoughtful'
              ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:border-purple-200 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className={`w-4 h-4 ${selectedReaction === 'thoughtful' ? 'text-purple-600' : 'text-slate-500'}`} />
          <span>विचारणीय</span>
          <span className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-600">
            {reactions.thoughtful || 0}
          </span>
        </button>

        <button
          onClick={() => handleReact('disagree')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            selectedReaction === 'disagree'
              ? 'bg-red-50 border-red-300 text-red-700 shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:border-red-200 hover:bg-slate-50'
          }`}
        >
          <ThumbsDown className={`w-4 h-4 ${selectedReaction === 'disagree' ? 'text-red-600 fill-red-600' : 'text-slate-500'}`} />
          <span>असहमत</span>
          <span className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-600">
            {reactions.disagree || 0}
          </span>
        </button>
      </div>

      {/* Reader Feedback Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">सम्पादकीय समूहलाई सुझाव / सच्याइ</h3>
              <button
                onClick={() => setFeedbackModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedbackSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center space-y-1">
                <Check className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">धन्यवाद! तपाईंको सुझाव प्राप्त भयो।</p>
                <p className="text-xs text-emerald-700">हाम्रो सम्पादकीय समूहले यसलाई गम्भीरतापूर्वक समीक्षा गर्नेछ।</p>
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} className="space-y-3 text-xs">
                {feedbackError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{feedbackError}</span>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">प्रतिक्रियाको प्रकार</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(
                      [
                        { id: 'reaction', label: 'सामान्य राय' },
                        { id: 'correction', label: 'तथ्य सच्याइ' },
                        { id: 'tip', label: 'सूचना / सुराक' },
                        { id: 'general', label: 'अन्य' }
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFeedbackType(t.id)}
                        className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-all cursor-pointer ${
                          feedbackType === t.id
                            ? 'bg-red-50 border-red-500 text-red-700 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">तपाईंको सन्देश / सुझाव *</label>
                  <textarea
                    rows={4}
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    required
                    placeholder="यदि कुनै तथ्य वा विवरण गलत लागेको भए वा सुधारको सुझाव भए यहाँ स्पष्ट उल्लेख गर्नुहोस्..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-slate-800 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">तपाईंको नाम (ऐच्छिक)</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="नाम"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">इमेल वा फोन (ऐच्छिक)</label>
                    <input
                      type="text"
                      value={contactContact}
                      onChange={(e) => setContactContact(e.target.value)}
                      placeholder="सम्पर्क ठेगाना"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    रद्द गर्नुहोस्
                  </button>
                  <button
                    type="submit"
                    disabled={sendingFeedback}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sendingFeedback ? 'पठाउँदै...' : 'सुझाव पठाउनुहोस्'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
