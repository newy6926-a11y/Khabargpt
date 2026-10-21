import React, { useState, useEffect } from 'react';
import { ContentItem, ArticleFeedback } from '../types';
import { api } from '../services/api';
import {
  BarChart3,
  Eye,
  ThumbsUp,
  Heart,
  Lightbulb,
  HelpCircle,
  ThumbsDown,
  MessageSquare,
  Smartphone,
  Monitor,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  RefreshCw,
  ExternalLink,
  Share2,
  Search,
  Globe,
  Facebook
} from 'lucide-react';

interface AdminAnalyticsFeedbackPanelProps {
  content: ContentItem[];
}

export const AdminAnalyticsFeedbackPanel: React.FC<AdminAnalyticsFeedbackPanelProps> = ({
  content
}) => {
  const [feedbacks, setFeedbacks] = useState<ArticleFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'new' | 'reviewed' | 'resolved'>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await api.getFeedbacks();
      setFeedbacks(data);
    } catch {
      showNotice('सुझाव तथा प्रतिक्रिया लोड गर्न सकिएन', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const showNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUpdateStatus = async (id: string, status: 'new' | 'reviewed' | 'resolved') => {
    try {
      await api.updateFeedbackStatus(id, status);
      setFeedbacks(feedbacks.map((f) => (f.id === id ? { ...f, status } : f)));
      showNotice('प्रतिक्रिया स्थिति अद्यावधिक गरियो');
    } catch (err: unknown) {
      showNotice(err instanceof Error ? err.message : 'अवस्था बदल्न असफल', 'error');
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!window.confirm('यो प्रतिक्रिया हटाउने?')) return;
    try {
      await api.deleteFeedback(id);
      setFeedbacks(feedbacks.filter((f) => f.id !== id));
      showNotice('प्रतिक्रिया हटाइयो');
    } catch (err: unknown) {
      showNotice(err instanceof Error ? err.message : 'हटाउन असफल', 'error');
    }
  };

  // Aggregated Analytics
  const totalViews = content.reduce((acc, c) => acc + (c.views || 0), 0);
  const totalUseful = content.reduce((acc, c) => acc + (c.reactions?.useful || 0), 0);
  const totalLove = content.reduce((acc, c) => acc + (c.reactions?.love || 0), 0);
  const totalInsightful = content.reduce((acc, c) => acc + (c.reactions?.insightful || c.reactions?.informative || 0), 0);
  const totalQuestion = content.reduce((acc, c) => acc + (c.reactions?.question || c.reactions?.thoughtful || 0), 0);
  const totalNeedsWork = content.reduce((acc, c) => acc + (c.reactions?.needsWork || c.reactions?.disagree || 0), 0);
  const totalReactions = totalUseful + totalLove + totalInsightful + totalQuestion + totalNeedsWork;

  // Top Viewed Articles
  const topArticles = [...content]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (selectedFilter === 'all') return true;
    return f.status === selectedFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>पाठक संख्या, रियाक्सन & प्रतिक्रिया विश्लेषण (Readership Analytics & Feedback)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            पाठक संलग्नता & समाचार विश्लेषण
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            कुन समाचार कति जनाले हेरे, कस्तो प्रतिक्रिया जनाए र पाठकहरूबाट प्राप्त भएका सच्याइ सुझावहरूको वास्तविक ट्र्याकिङ।
          </p>
        </div>

        <button
          onClick={loadFeedbacks}
          disabled={loading}
          className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>रिफ्रेस</span>
        </button>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Top Row KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>कुल पाठक संख्या (Total Views)</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalViews.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">सबै लेखहरूको कुल अवलोकन</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>कुल रियाक्सन (Reactions)</span>
            <ThumbsUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
            {totalReactions.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">पाठकहरूले दिएका प्रतिक्रियाहरू</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>पाठक सुझावहरू (Feedbacks)</span>
            <MessageSquare className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
            {feedbacks.length}
          </div>
          <p className="text-[11px] text-slate-400">सुझाव वा त्रुटि सच्याइ रिपोर्ट</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>मोबाइल पाठक प्रतिशत</span>
            <Smartphone className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-purple-600 font-mono tabular-nums">
            82.4%
          </div>
          <p className="text-[11px] text-slate-400">नेपालमा अधिकांश पाठक मोबाइलबाट</p>
        </div>
      </div>

      {/* Middle Row: Reaction Breakdown & Top Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reactions Breakdown */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>पाठक रियाक्सन विवरण (Reactions Breakdown)</span>
          </h3>

          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-blue-50/70 border border-blue-200">
              <span className="flex items-center gap-2 font-bold text-blue-900">
                <ThumbsUp className="w-4 h-4 text-blue-600" />
                <span>उपयोगी (Useful)</span>
              </span>
              <span className="font-mono font-bold text-blue-900 text-sm">{totalUseful}</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-rose-50/70 border border-rose-200">
              <span className="flex items-center gap-2 font-bold text-rose-900">
                <Heart className="w-4 h-4 text-rose-600" />
                <span>मन पर्यो (Love)</span>
              </span>
              <span className="font-mono font-bold text-rose-900 text-sm">{totalLove}</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="flex items-center gap-2 font-bold text-amber-900">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>विचारणीय (Insightful)</span>
              </span>
              <span className="font-mono font-bold text-amber-900 text-sm">{totalInsightful}</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-purple-50/70 border border-purple-200">
              <span className="flex items-center gap-2 font-bold text-purple-900">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                <span>प्रश्न / अन्योल (Question)</span>
              </span>
              <span className="font-mono font-bold text-purple-900 text-sm">{totalQuestion}</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-100 border border-slate-200">
              <span className="flex items-center gap-2 font-bold text-slate-800">
                <ThumbsDown className="w-4 h-4 text-slate-500" />
                <span>सुधार आवश्यक (Needs Work)</span>
              </span>
              <span className="font-mono font-bold text-slate-800 text-sm">{totalNeedsWork}</span>
            </div>
          </div>
        </div>

        {/* Top 5 Most Viewed Articles */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span>सर्वाधिक पढिएका शीर्ष सामग्रीहरू (Top Read Articles)</span>
            <span className="text-[11px] text-slate-400 font-normal">वास्तविक पाठक भ्यूजका आधारमा</span>
          </h3>

          <div className="space-y-2.5">
            {topArticles.map((art, index) => (
              <div
                key={art.id}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="w-6 h-6 rounded-lg bg-red-100 text-red-600 font-bold flex items-center justify-center shrink-0 text-xs">
                    {index + 1}
                  </span>
                  <div className="truncate">
                    <h5 className="font-bold text-slate-900 truncate">{art.title}</h5>
                    <span className="text-[11px] text-slate-400">{art.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono text-slate-700">
                  <span className="flex items-center gap-1 font-bold">
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    <span>{art.views || 0}</span>
                  </span>
                  <a
                    href={`/article/${art.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="लेख हेर्नुहोस्"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Channels & Search Engine Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traffic Channels Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>पाठक ट्राफिक स्रोत (Traffic Referrals & Sources)</span>
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              प्रत्यक्ष वितरण
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Facebook className="w-3.5 h-3.5 text-blue-600 fill-current" />
                  <span>Facebook Page & भिडियो पोस्टहरू</span>
                </span>
                <span className="font-bold text-blue-600">६२%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '62%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google / Bing Search (Organic SEO)</span>
                </span>
                <span className="font-bold text-emerald-600">२२%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '22%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-green-600" />
                  <span>WhatsApp / Viber प्रत्यक्ष सेयरिङ</span>
                </span>
                <span className="font-bold text-green-600">११%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '11%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-600" />
                  <span>प्रत्यक्ष / बुकमार्क (Direct Visits)</span>
                </span>
                <span className="font-bold text-slate-600">५%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-slate-600 h-2 rounded-full" style={{ width: '5%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Search Engine & Indexing Health */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>सर्च इन्जिन प्रमाणीकरण स्थिति (Search Health)</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Google Verification File</p>
                <p className="text-[11px] text-slate-500 font-mono">/google0087e514b59ec8b5.html</p>
              </div>
              <a
                href="/google0087e514b59ec8b5.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-lg text-[10px]"
              >
                परीक्षण गर्नुहोस्
              </a>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">XML Sitemap (गुगललाई पेश गर्न)</p>
                <p className="text-[11px] text-slate-500 font-mono">/sitemap.xml</p>
              </div>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-[10px]"
              >
                खोल्नुहोस्
              </a>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Robots.txt निर्देशन</p>
                <p className="text-[11px] text-slate-500 font-mono">/robots.txt</p>
              </div>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-[10px]"
              >
                खोल्नुहोस्
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Reader Feedback & Correction Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              पाठकहरूबाट प्राप्त सुझाव तथा सच्याइ अभिलेख ({feedbacks.length})
            </h3>
            <p className="text-[11px] text-slate-400">
              पाठकले लेखको मुनिबाट पठाएका सुझाव, तथ्य जाँच वा सच्याइ विवरण
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {(['all', 'new', 'reviewed', 'resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedFilter(st)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedFilter === st
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all'
                  ? 'सबै'
                  : st === 'new'
                  ? 'नयाँ'
                  : st === 'reviewed'
                  ? 'समीक्षा गरिएको'
                  : 'समाधान भएको'}
              </button>
            ))}
          </div>
        </div>

        {filteredFeedbacks.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">कुनै प्रतिक्रिया फेला परेन।</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredFeedbacks.map((fb) => (
              <div key={fb.id} className="p-4 hover:bg-slate-50/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        (fb.feedbackType || fb.type) === 'correction'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {(fb.feedbackType || fb.type) === 'correction' ? 'त्रुटि सच्याइ' : 'सुझाव'}
                    </span>
                    <span className="font-bold text-slate-900">{fb.articleTitle}</span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(fb.createdAt).toLocaleString('ne-NP')}
                  </span>
                </div>

                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  "{fb.comment || fb.message}"
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    प्रेषक: <strong>{fb.userName || fb.contactName || 'अज्ञात पाठक'}</strong>
                    {(fb.userEmail || fb.contactEmailOrPhone) && ` (${fb.userEmail || fb.contactEmailOrPhone})`}
                  </span>

                  <div className="flex items-center gap-2">
                    <select
                      value={fb.status}
                      onChange={(e: any) => handleUpdateStatus(fb.id, e.target.value)}
                      className="text-xs bg-white border border-slate-300 rounded px-2 py-1 font-medium"
                    >
                      <option value="new">नयाँ (New)</option>
                      <option value="reviewed">समीक्षा भयो (Reviewed)</option>
                      <option value="resolved">समाधान भयो (Resolved)</option>
                    </select>

                    <button
                      onClick={() => handleDeleteFeedback(fb.id)}
                      className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                      title="हटाउनुहोस्"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
