import React, { useState, useEffect } from 'react';
import { ContentItem, MarketSnapshot, NewsletterSubscriber } from '../types';
import { getNepaliDate, toNepaliDigits } from '../utils/nepaliCalendar';
import { api } from '../services/api';
import {
  Mail,
  Send,
  Check,
  Copy,
  Calendar,
  Sparkles,
  FileText,
  Users,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  Download,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  AlertCircle,
  Info,
  CheckSquare,
  Square,
  Filter
} from 'lucide-react';

interface AdminNewsletterPanelProps {
  content: ContentItem[];
}

export const AdminNewsletterPanel: React.FC<AdminNewsletterPanelProps> = ({ content }) => {
  const nepaliDate = getNepaliDate();
  const publishedItems = content.filter((c) => c.status === 'published');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(
    publishedItems.slice(0, 5).map((c) => c.id)
  );

  const [digestTitle, setDigestTitle] = useState('खबर GPT दैनिक न्यूजलेटर डाइजेस्ट');
  const [digestIntro, setDigestIntro] = useState(
    'नमस्ते, आजका मुख्य समसामयिक घटनाक्रम, तथ्यपरक विश्लेषण, एक्सप्लेनर र बजार दरको संक्षिप्त संकलन यहाँ प्रस्तुत गरिएको छ।'
  );
  const [includeMarketRates, setIncludeMarketRates] = useState(true);
  const [marketSnapshot, setMarketSnapshot] = useState<MarketSnapshot | null>(null);

  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentNotice, setSentNotice] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  // Real Subscriber state from Backend
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newFrequency, setNewFrequency] = useState<'daily' | 'weekly'>('daily');
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'subscribers' | 'how_it_works' | 'settings'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');
  const [resendKeyInput, setResendKeyInput] = useState('');
  const [resendSenderInput, setResendSenderInput] = useState('onboarding@resend.dev');

  const fetchSubscribers = async () => {
    setLoadingSubscribers(true);
    try {
      const data = await api.getNewsletterSubscribers();
      setSubscribers(data);
    } catch {
      // Fallback initial
      setSubscribers([
        { id: 'sub-1', email: 'kathmandu.reader@gmail.com', frequency: 'daily', status: 'active', subscribedAt: new Date().toISOString() },
        { id: 'sub-2', email: 'pokhara.news@gmail.com', frequency: 'daily', status: 'active', subscribedAt: new Date().toISOString() },
        { id: 'sub-3', email: 'diaspora.sydney@gmail.com', frequency: 'weekly', status: 'active', subscribedAt: new Date().toISOString() }
      ]);
    } finally {
      setLoadingSubscribers(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    api.getMarketData().then((m) => setMarketSnapshot(m)).catch(() => {});
    api.getSettings().then((s) => {
      if (s.resendApiKey) setResendKeyInput(s.resendApiKey);
      if (s.resendSenderEmail) setResendSenderInput(s.resendSenderEmail);
    }).catch(() => {});
  }, []);

  const handleSaveResend = async () => {
    try {
      await api.updateSettings({
        resendApiKey: resendKeyInput.trim(),
        resendSenderEmail: resendSenderInput.trim() || 'onboarding@resend.dev'
      });
      setSentNotice('Resend API सेटिङ्स सफलतापूर्वक सुरक्षित गरियो!');
      setTimeout(() => setSentNotice(null), 4000);
    } catch {
      setSendError('सेटिङ्स सेभ गर्न असफल');
      setTimeout(() => setSendError(null), 4000);
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter((i) => i !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  const selectedArticles = publishedItems.filter((c) => selectedItemIds.includes(c.id));

  // Auto-generate digest text with clean formatting
  const generateDigestText = () => {
    let out = `📰 ${digestTitle}\n`;
    out += `📅 मिति: ${nepaliDate.dateFormattedNp} (${nepaliDate.tithiNp})\n`;
    out += `तपाईंको भरपर्दो सूचना स्रोत: खबर GPT (Khabar GPT)\n`;
    out += `--------------------------------------------------\n\n`;
    out += `${digestIntro}\n\n`;

    out += `📌 आजका शीर्ष समाचार & तथ्यपरक एक्सप्लेनरहरू:\n\n`;
    selectedArticles.forEach((art, idx) => {
      out += `${toNepaliDigits(idx + 1)}. *${art.title}*\n`;
      out += `   श्रेणी: ${art.category} | लेखक: ${art.author}\n`;
      out += `   सार: ${art.summary}\n`;
      out += `   👉 विस्तृत पढ्नुहोस्: https://khabargpt.com/article/${art.slug}\n\n`;
    });

    if (includeMarketRates && marketSnapshot) {
      out += `📊 आजको बजार दर (Nepal Market Snapshot):\n`;
      out += `• नेप्से परिसूचक: ${marketSnapshot.nepse.index.toLocaleString()} (${marketSnapshot.nepse.change >= 0 ? '+' : ''}${marketSnapshot.nepse.change} अंक)\n`;
      out += `• छापावाल सुन: रु ${marketSnapshot.goldSilver.fineGoldTola.toLocaleString()} / तोला\n`;
      out += `• चाँदी: रु ${marketSnapshot.goldSilver.silverTola.toLocaleString()} / तोला\n`;
      out += `• पेट्रोल: रु ${marketSnapshot.fuel.petrolLitre} / लिटर | डिजेल: रु ${marketSnapshot.fuel.dieselLitre} / लिटर\n`;
      out += `• अमेरिकी डलर (USD): खरिद रु ${marketSnapshot.forex.usd.buy} / बिक्री रु ${marketSnapshot.forex.usd.sell}\n\n`;
    }

    out += `--------------------------------------------------\n`;
    out += `नोट: खबर GPT सार्वजनिक सरोकारका जानकारी सरल भाषामा प्रस्तुत गर्ने डिजिटल सूचना पृष्ठ हो।\n`;
    out += `📲 आधिकारिक WhatsApp च्यानल: https://whatsapp.com/channel/khabargpt\n`;
    out += `🌐 पोर्टल: https://khabargpt.com\n`;
    return out;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateDigestText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dispatch Newsletter to all subscribed Gmail readers
  const handleSendDigest = async () => {
    setSending(true);
    setSentNotice(null);
    setSendError(null);

    try {
      const result = await api.dispatchNewsletter({
        subject: digestTitle,
        digestText: generateDigestText()
      });
      setSentNotice(result.message || `${result.sentCount} जना सक्रिय सदस्यहरूलाई इमेल सफलतापूर्वक पठाइयो।`);
      setTimeout(() => setSentNotice(null), 5000);
    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : 'न्यूजलेटर पठाउन त्रुटि भयो।');
      setTimeout(() => setSendError(null), 5000);
    } finally {
      setSending(false);
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) return;

    try {
      const added = await api.addNewsletterSubscriber(newEmail.trim(), newFrequency);
      setSubscribers([added, ...subscribers]);
      setNewEmail('');
      setSentNotice(`नयाँ ग्राहक (${newEmail}) सफलतापूर्वक थपियो!`);
      setTimeout(() => setSentNotice(null), 4000);
    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : 'ग्राहक थप्न त्रुटि भयो');
      setTimeout(() => setSendError(null), 4000);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const updated = await api.toggleNewsletterSubscriber(id);
      setSubscribers(subscribers.map((s) => (s.id === id ? updated : s)));
    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : 'स्थिति परिवर्तन गर्न असफल');
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!window.confirm('के तपाईं यो ग्राहकलाई सूचीबाट हटाउन निश्चित हुनुहुन्छ?')) return;
    try {
      await api.deleteNewsletterSubscriber(id);
      setSubscribers(subscribers.filter((s) => s.id !== id));
      setSentNotice('ग्राहक सफलतापूर्वक हटाइयो!');
      setTimeout(() => setSentNotice(null), 3000);
    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : 'हटाउन असफल');
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Email,Frequency,Status,SubscribedAt']
        .concat(subscribers.map((s) => `${s.email},${s.frequency},${s.status},${s.subscribedAt}`))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `khabar_subscribers_${nepaliDate.yearBs}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscribers = subscribers.filter((s) => {
    const matchesSearch = s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = subscribers.filter((s) => s.status === 'active').length;
  const gmailCount = subscribers.filter((s) => s.email.toLowerCase().endsWith('@gmail.com')).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>दैनिक न्यूजलेटर डाइजेस्ट & Gmail सेवा (Daily Newsletter & Gmail Service)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            जीमेल ग्राहक & दैनिक न्यूजलेटर डाइजेस्ट नियन्त्रण
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            वेबसाइटमा निःशुल्क सदस्यता लिएका जीमेल प्रयोगकर्ताहरूलाई १-क्लिकमा दैनिक वा ब्रेकिङ समाचार प्रसारण गर्नुहोस्।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveSubTab('create')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                activeSubTab === 'create' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              डाइजेस्ट निर्माण
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('subscribers')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'subscribers' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>ग्राहक सूची ({toNepaliDigits(subscribers.length)})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('how_it_works')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'how_it_works' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              <span>कसरी काम गर्छ?</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('settings')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'settings' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-purple-600" />
              <span>Resend / Gmail सेटिङ्स</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {sentNotice && (
        <div className="p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{sentNotice}</span>
        </div>
      )}

      {sendError && (
        <div className="p-3.5 bg-red-50 text-red-900 border border-red-200 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{sendError}</span>
        </div>
      )}

      {/* TAB 1: CREATE & DISPATCH DIGEST */}
      {activeSubTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form & Selector */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-600" />
                <span>१. डाइजेस्ट शीर्षक & परिचय</span>
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  इमेल/डाइजेस्ट शीर्षक (Email Subject)
                </label>
                <input
                  type="text"
                  value={digestTitle}
                  onChange={(e) => setDigestTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  प्रारम्भिक सन्देश (Intro Note)
                </label>
                <textarea
                  rows={2}
                  value={digestIntro}
                  onChange={(e) => setDigestIntro(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="incRates"
                  checked={includeMarketRates}
                  onChange={(e) => setIncludeMarketRates(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded cursor-pointer accent-red-600"
                />
                <label htmlFor="incRates" className="text-xs font-medium text-slate-700 cursor-pointer">
                  आजको नेपाल बजार दर (नेप्से, सुन-चाँदी, इन्धन, डलर) समावेश गर्नुहोस्
                </label>
              </div>
            </div>

            {/* Article Selector */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>२. आजका समावेश गरिने समाचारहरू ({selectedItemIds.length}/{publishedItems.length})</span>
                </h3>
                <span className="text-[11px] text-slate-500">क्लिक गरी छान्नुहोस् वा हटाउनुहोस्</span>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {publishedItems.slice(0, 15).map((item) => {
                  const isSelected = selectedItemIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleSelect(item.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-red-500 bg-red-50/40 text-slate-900 font-medium'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="mt-0.5 text-red-600">
                        {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-300" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                            {item.category}
                          </span>
                          <span className="text-[10px] text-slate-600">{item.author}</span>
                        </div>
                        <p className="line-clamp-1">{item.title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Preview & Dispatches */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col h-full">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-xs uppercase text-slate-700 tracking-wider">
                    प्रत्यक्ष पूर्वावलोकन (Live Preview)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'कपि भयो!' : 'कपि गर्नुहोस्'}</span>
                </button>
              </div>

              {/* Formatted Text Box */}
              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] leading-relaxed whitespace-pre-wrap flex-1 max-h-96 overflow-y-auto selection:bg-red-500 selection:text-white">
                {generateDigestText()}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSendDigest}
                  disabled={sending || activeCount === 0}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {sending
                      ? 'पठाउँदै...'
                      : `सबै सक्रिय जीमेल पाठकहरूलाई पठाउनुहोस् (${toNepaliDigits(activeCount)} जना)`}
                  </span>
                </button>

                <div className="text-[11px] text-center text-slate-600 flex items-center justify-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>
                    कुल {toNepaliDigits(subscribers.length)} सदस्यहरूमध्ये {toNepaliDigits(activeCount)} सक्रिय छन्।
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBSCRIBERS LIST & MANAGEMENT */}
      {activeSubTab === 'subscribers' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">कुल इमेल सदस्य</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{toNepaliDigits(subscribers.length)}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-emerald-600 uppercase">सक्रिय (Active)</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{toNepaliDigits(activeCount)}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-blue-600 uppercase">Gmail प्रयोगकर्ता</span>
              <p className="text-2xl font-black text-blue-700 mt-1">{toNepaliDigits(gmailCount)}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">निष्क्रिय (Inactive)</span>
              <p className="text-2xl font-black text-slate-600 mt-1">{toNepaliDigits(subscribers.length - activeCount)}</p>
            </div>
          </div>

          {/* Add Subscriber Form & Actions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>नयाँ सदस्य थप्नुहोस् वा ग्राहक सूची व्यवस्थापन गर्नुहोस्</span>
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchSubscribers}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingSubscribers ? 'animate-spin' : ''}`} />
                  <span>रिफ्रेस</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV डाउनलोड</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddSubscriber} className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="उदा: reader.nepal@gmail.com"
                className="flex-1 w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-red-500 focus:bg-white outline-none"
              />
              <select
                value={newFrequency}
                onChange={(e) => setNewFrequency(e.target.value as 'daily' | 'weekly')}
                className="w-full sm:w-auto p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="daily">दैनिक (Daily Digest)</option>
                <option value="weekly">साप्ताहिक (Weekly Digest)</option>
              </select>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>सदस्य थप्नुहोस्</span>
              </button>
            </form>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="इमेल खोजी गर्नुहोस्..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-slate-600 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>फिल्टर:</span>
              </span>
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                सबै ({subscribers.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  statusFilter === 'active' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                सक्रिय ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('unsubscribed')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  statusFilter === 'unsubscribed' ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                निष्क्रिय ({subscribers.length - activeCount})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">इमेल ठेगाना</th>
                    <th className="p-3.5">प्रदायक</th>
                    <th className="p-3.5">फ्रिक्वेन्सी</th>
                    <th className="p-3.5">दर्ता मिति</th>
                    <th className="p-3.5">स्थिति</th>
                    <th className="p-3.5 text-right">कार्यहरू</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">
                        कुनै ग्राहक फेला परेन।
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub) => {
                      const isGmail = sub.email.toLowerCase().endsWith('@gmail.com');
                      return (
                        <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 font-semibold text-slate-900 font-mono">
                            {sub.email}
                          </td>
                          <td className="p-3.5">
                            {isGmail ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                Google Gmail
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                                Other Mail
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 uppercase font-semibold text-[11px]">
                            {sub.frequency === 'daily' ? 'दैनिक (Daily)' : 'साप्ताहिक (Weekly)'}
                          </td>
                          <td className="p-3.5 text-slate-500">
                            {new Date(sub.subscribedAt).toLocaleDateString()}
                          </td>
                          <td className="p-3.5">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(sub.id)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                sub.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {sub.status === 'active' ? 'सक्रिय (Active)' : 'निष्क्रिय (Paused)'}
                            </button>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteSubscriber(sub.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="ग्राहक मेटाउनुहोस्"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HOW IT WORKS EXPLAINER */}
      {activeSubTab === 'how_it_works' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>खबर GPT निःशुल्क जीमेल सेवा प्रणाली</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              कसरी काम गर्छ खबर GPT को निःशुल्क जीमेल & न्यूजलेटर सदस्यता?
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              पाठकले खबर GPT मा आफ्नो Gmail वा इमेल राखेपछि के हुन्छ र एड्मिनले कसरी पूर्ण नियन्त्रण गर्न सक्नुहुन्छ भन्ने विस्तृत विवरण:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                १
              </div>
              <h4 className="font-bold text-sm text-slate-900">पाठकको १००% निःशुल्क दर्ता</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                पाठकले वेबसाइटको फुटर वा साइडबारबाट कुनै पनि क्रेडिट कार्ड वा पैसा नतिरी केवल आफ्नो Gmail दर्ता गर्छन्। दर्ता हुनासाथ यो एड्मिन प्यानलमा तत्काल देखा पर्दछ।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                २
              </div>
              <h4 className="font-bold text-sm text-slate-900">एड्मिन पोर्टलबाट पूर्ण नियन्त्रण</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                एड्मिनले यहाँबाट जुनसुकै ग्राहकको इमेल हेर्न, खोजी गर्न, नयाँ सदस्य थप्न, वा चाहेको खण्डमा १-क्लिकमा निष्क्रिय वा स्थायी रूपमा मेटाउन सक्नुहुन्छ।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">
                ३
              </div>
              <h4 className="font-bold text-sm text-slate-900">१-क्लिक इमेल डाइजेस्ट प्रसारण</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                एड्मिनले आजका मुख्य समाचार र बजार दर छानेर 'डाइजेस्ट पठाउनुहोस्' बटन थिच्दा सबै सक्रिय जीमेल पाठकहरूलाई सोझै इनबक्समा पठाइन्छ वा समुदायमा सेयर गर्न सकिन्छ।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Resend API & Gmail Settings */}
      {activeSubTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
              <Send className="w-4 h-4" />
              <span>इमेल डेलिभरी प्रदायक व्यवस्थापन (Email Delivery Provider)</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Resend API वा Gmail SMTP कन्फिगरेसन
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              अहिले Resend API प्रयोग गरी निःशुल्क १०० वटा इमेल दैनिक पठाउन सक्नुहुन्छ। पछि जुनसुकै बेला यसलाई हटाएर आफ्नै Gmail प्रयोग गर्न सक्नुहुन्छ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resend Option */}
            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-purple-950 flex items-center gap-1.5">
                  <span>🚀 Resend API (सक्रिय विकल्प)</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                  {resendKeyInput ? '✓ Key सेट छ' : 'अपेक्षित'}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Resend ले १०० इमेल/दिन निःशुल्क दिन्छ। तपाईंको <code>re_...</code> कि यहाँ राख्नुहोस् वा Render को Environment मा <code>RESEND_API_KEY</code> मा राख्नुहोस्।
              </p>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Resend API Key:
                </label>
                <input
                  type="password"
                  value={resendKeyInput}
                  onChange={(e) => setResendKeyInput(e.target.value)}
                  placeholder="re_123456789_abcdefg"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  प्रेषक इमेल (Sender From Email):
                </label>
                <input
                  type="text"
                  value={resendSenderInput}
                  onChange={(e) => setResendSenderInput(e.target.value)}
                  placeholder="onboarding@resend.dev"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  डोमेन प्रमाणीकरण नभएसम्म Resend को निःशुल्क <code>onboarding@resend.dev</code> प्रयोग हुन्छ।
                </span>
              </div>
              <button
                type="button"
                onClick={handleSaveResend}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition cursor-pointer"
              >
                Resend सेटिङ्स सेभ गर्नुहोस्
              </button>
            </div>

            {/* Switch to Gmail Option */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-red-600" />
                  <span>आफ्नै Gmail SMTP (कुनै पनि बेला परिवर्तन गर्न सकिने)</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                  वैकल्पिक
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                यदि पछि Resend हटाएर आफ्नै व्यक्तिगत वा संस्थागत Gmail प्रयोग गर्न चाहनुहुन्छ भने:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1 text-[11px]">
                <li>Google Account &gt; Security &gt; 2-Step Verification अन गर्नुहोस्।</li>
                <li>त्यहाँबाट १६ अक्षरको <strong>App Password</strong> बनाउनुहोस्।</li>
                <li>माथिको Resend Key खाली छोडेर आफ्नो Gmail जोड्न सक्नुहुन्छ।</li>
              </ol>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-500">
                💡 तपाईंले चाहेको बेला Resend र Gmail बीच १ मिनेटमै स्विच गर्न सक्नुहुन्छ।
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
