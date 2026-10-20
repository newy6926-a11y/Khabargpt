import React, { useState, useEffect } from 'react';
import { ContentItem, Category, SiteSettings, CorrectionItem, LiveEvent, AdItem } from '../types';
import { api } from '../services/api';
import { MarketTrackerWidget } from '../components/MarketTrackerWidget';
import { AdBanner } from '../components/AdBanner';
import { matchesRomanizedSearch, startVoiceRecognition } from '../utils/romanizedSearch';
import {
  ExternalLink,
  Search,
  BookOpen,
  PlayCircle,
  Eye,
  AlertCircle,
  ChevronRight,
  Shield,
  Facebook,
  Youtube,
  Instagram,
  Twitter,
  Send,
  MessageCircle,
  Sparkles,
  Zap,
  Mic,
  MicOff,
  Radio,
  Mail,
  CheckCircle2,
  Phone,
  BellRing,
  MapPin,
  Image as ImageIcon,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X
} from 'lucide-react';

interface HomePageProps {
  content: ContentItem[];
  categories: Category[];
  corrections: CorrectionItem[];
  settings: SiteSettings;
  onNavigate: (path: string) => void;
  onSelectArticle: (slugOrId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  content,
  categories,
  corrections,
  settings,
  onNavigate,
  onSelectArticle
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(true);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [inFeedAd, setInFeedAd] = useState<AdItem | null>(null);
  const [isNoticeZoomed, setIsNoticeZoomed] = useState<boolean>(false);
  const [noticeZoomLevel, setNoticeZoomLevel] = useState<number>(1);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Fetch live events and in-feed ads
  useEffect(() => {
    api.getLiveEvents()
      .then((events) => setLiveEvents(events.filter((e) => e.status === 'live' || e.status === 'scheduled')))
      .catch(() => {});

    api.getAds('in_article')
      .then((ads) => {
        if (ads.length > 0) setInFeedAd(ads[0]);
      })
      .catch(() => {});
  }, []);

  // Voice recognition toggle
  const handleToggleVoice = () => {
    if (isListeningVoice) {
      setIsListeningVoice(false);
      return;
    }

    const stopFn = startVoiceRecognition(
      (transcript) => {
        setSearchQuery(transcript);
        setIsListeningVoice(false);
      },
      (error) => {
        console.warn('Voice recognition notice:', error);
        setIsListeningVoice(false);
        if (error === 'not-supported') {
          setVoiceSupported(false);
        }
      },
      () => {
        setIsListeningVoice(false);
      }
    );

    if (stopFn) {
      setIsListeningVoice(true);
    } else {
      setVoiceSupported(false);
    }
  };

  // Filter published content with Romanized and Nepali search
  const publishedItems = content.filter((item) => item.status === 'published');

  const filteredItems = publishedItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    if (!searchQuery) return matchesCategory;

    // Use Romanized-Nepali phonetic match + exact match
    const textToSearch = `${item.title} ${item.summary} ${item.category} ${(item.tags || []).join(' ')}`;
    const matchesSearch = matchesRomanizedSearch(textToSearch, searchQuery);

    return matchesCategory && matchesSearch;
  });

  const videoItems = publishedItems.filter((i) => i.type === 'video');
  const recentCorrections = corrections.slice(0, 2);
  const activeLiveEvent = liveEvents.find((e) => e.status === 'live') || liveEvents[0];

  const handleSubscribeNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterLoading(true);
    try {
      // simulate API registration
      await new Promise((r) => setTimeout(r, 600));
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Official Nepali Introduction Banner */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400 bg-red-950/70 px-3 py-1 rounded-full border border-red-800/60">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>नेपालको डिजिटल सूचना तथा एक्सप्लेनर प्लेटफर्म</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans tracking-tight text-white leading-tight">
              {settings.siteSubtitle || 'समसामयिक विषय, तथ्यपरक जानकारी र सरल एक्सप्लेनर'}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-3xl">
              {settings.introTextNp ||
                'खबर GPT नेपालका समसामयिक विषय, सार्वजनिक सरोकारका जानकारी र जटिल विषयलाई सरल भाषामा बुझाउने डिजिटल सूचना पृष्ठ हो।'}
            </p>

            {/* Direct Social Media Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href={settings.facebookUrl || 'https://facebook.com/khabargpt'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <Facebook className="w-4 h-4 fill-white" />
                <span>फेसबुक पेज</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
              </a>

              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                >
                  <Youtube className="w-4 h-4" />
                  <span>युट्युब</span>
                  <ExternalLink className="w-3.5 h-3.5 text-red-200" />
                </a>
              )}

              {/* WhatsApp Broadcast Channel */}
              <a
                href={settings.whatsappUrl || 'https://whatsapp.com/channel/khabargpt'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp च्यानल</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
              </a>

              {/* Dynamic Social Links Added from Admin Portal */}
              {settings.socialLinks &&
                settings.socialLinks
                  .filter((s) => s.active && s.url)
                  .map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition-all border border-slate-700 cursor-pointer shadow-xs"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ))}
            </div>
          </div>

          {/* Breaking Live Event Notification Banner (if any live event active) */}
          {activeLiveEvent && (
            <div className="bg-gradient-to-r from-red-950/90 via-slate-900 to-red-950/90 border-2 border-red-600/80 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-4 w-4 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                      🔴 प्रत्यक्ष कभरेज (LIVE EVENT)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(activeLiveEvent.eventDate).toLocaleDateString('ne-NP')}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                    {activeLiveEvent.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1">
                    {activeLiveEvent.summary}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate(`/live/${activeLiveEvent.slug}`)}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>लाइभ अपडेट हेर्नुहोस् ({activeLiveEvent.updates?.length || 0})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* ================= OFFICIAL PUBLIC NOTICE POSTER & FACEBOOK HUB ================= */}
        <section className="bg-white border-2 border-blue-200/80 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
                <BellRing className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  सार्वजनिक सूचना (Public Notice)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {settings.entryPopupTitle || 'आधिकारिक सूचना (Official Notice)'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <a
                href={settings.facebookUrl || 'https://facebook.com/khabargpt'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
              >
                <Facebook className="w-4 h-4 fill-white" />
                <span>फेसबुक पेजमा जानुहोस्</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={settings.entryPopupImageUrl || '/official-notice.svg'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>पूरा तस्बिर (Full View)</span>
              </a>
            </div>
          </div>

          {/* Full Uncropped Notice Poster Card */}
          <div
            onClick={() => {
              setIsNoticeZoomed(true);
              setNoticeZoomLevel(1);
            }}
            className="max-w-2xl mx-auto rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-red-400 shadow-md bg-white cursor-pointer group relative transition-all"
            title="पूरा तस्बिर हेर्न थिच्नुहोस् (Click to view full image)"
          >
            <img
              src={settings.entryPopupImageUrl || '/official-notice.svg'}
              alt="Khabar GPT Official Notice"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/official-notice.svg';
              }}
              className="w-full h-auto object-contain transition-transform duration-200 group-hover:scale-[1.008]"
            />

            {/* Visual Indicator Overlay on Hover */}
            <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-slate-900/90 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 backdrop-blur-xs">
                <Maximize2 className="w-4 h-4 text-red-400" />
                <span>पूरा तस्बिर हेर्न थिच्नुहोस् (Click for Full View)</span>
              </span>
            </div>

            {/* Corner Badge */}
            <div className="absolute bottom-2.5 right-2.5 bg-slate-950/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md pointer-events-none">
              <Maximize2 className="w-3 h-3 text-red-400" />
              <span>पूरा तस्बिर (Full Size)</span>
            </div>
          </div>

          {/* Buttons below the notice image */}
          <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsNoticeZoomed(true);
                setNoticeZoomLevel(1);
              }}
              className="py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 text-center cursor-pointer transition-all"
            >
              <Maximize2 className="w-4 h-4 text-red-400" />
              <span>🔍 पूरा तस्बिर हेर्नुहोस् (Show Full Image)</span>
            </button>

            <a
              href={settings.facebookUrl || 'https://facebook.com/khabargpt'}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 text-center transition-all cursor-pointer"
            >
              <Facebook className="w-4 h-4 fill-white" />
              <span>👉 खबर GPT फेसबुक पेजमा जानुहोस्</span>
            </a>
          </div>

          {/* Contact Details & Phone Strip (Gmail / Email hidden for now) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">आधिकारिक सम्पर्क:</span>
              <span className="font-bold text-slate-900">{settings.contactPhone || 'Facebook Messenger'}</span>
            </div>

            <a
              href={settings.facebookUrl || 'https://facebook.com/khabargpt'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold hover:underline"
            >
              <Facebook className="w-4 h-4 fill-current" />
              <span>Facebook Messenger मा सन्देश पठाउनुहोस्</span>
            </a>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600 shrink-0" />
              <span className="font-semibold">ठेगाना:</span>
              <span>{settings.address || 'काठमाडौँ, नेपाल'}</span>
            </div>
          </div>
        </section>

        {/* 2. NEPSE, सुन-चाँदी, इन्धन र विनिमय दर चार्ट (Market Tracker Widget) */}
        <section>
          <MarketTrackerWidget />
        </section>

        {/* 3. Search Bar with Voice Recognition and Romanized Search */}
        <section className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search Input with Voice & Romanized Support */}
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="खोज्नुहोस्... (जस्तै: prachanda, nepse, chunab, शिक्षा, काठमाडौँ)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-24 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-sans"
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {/* Voice Search Button */}
                  {voiceSupported && (
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      title={isListeningVoice ? 'आवाज सुन्दैछ... बन्द गर्न थिच्नुहोस्' : 'आवाजबाट खोज्नुहोस् (Voice Search)'}
                      className={`p-2 rounded-lg transition-all cursor-pointer ${
                        isListeningVoice
                          ? 'bg-red-600 text-white animate-pulse shadow-md'
                          : 'text-slate-500 hover:text-red-600 hover:bg-slate-200/70'
                      }`}
                    >
                      {isListeningVoice ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  )}

                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-2 py-1 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      हटाउनुहोस्
                    </button>
                  )}
                </div>
              </div>

              {/* Count */}
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>कुल उपलब्ध:</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums text-sm">
                  {publishedItems.length}
                </span>
                <span>सामग्री</span>
              </div>
            </div>

            {/* Voice listening status hint */}
            {isListeningVoice && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 animate-pulse">
                <Mic className="w-4 h-4 shrink-0" />
                <span>बोलिरहनु भएको सुन्दैछ... नेपाली वा अङ्ग्रेजीमा बोल्नुहोस् (उदा: 'नेप्से', 'चुनाव', 'शिक्षा')</span>
              </div>
            )}

            {/* Romanized hint label */}
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span><strong>रोमनाइज्ड खोज समर्थित:</strong> अङ्ग्रेजीमा <em>'nepal', 'shiksha', 'chunab', 'swasthya'</em> टाइप गर्दा पनि नेपाली सामग्री स्वतः मिल्दछ।</span>
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-thin">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                सबै श्रेणी
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-red-600 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Published Content Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>ताजा सामग्री तथा विश्लेषण</span>
              {selectedCategory !== 'all' && (
                <span className="text-xs font-normal text-slate-500">
                  ({selectedCategory})
                </span>
              )}
            </h3>
            <span className="text-xs text-slate-500">
              {filteredItems.length} सामग्री उपलब्ध
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-gradient-to-b from-blue-50/50 via-white to-slate-50 border-2 border-blue-100 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xs">
              <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
                <Facebook className="w-8 h-8 fill-white" />
              </div>
              <div className="space-y-2 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Khabar GPT आधिकारिक फेसबुक प्लेटफर्म</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  Khabar GPT को सम्पूर्ण ताजा समाचार र अपडेट फेसबुक पेजमा उपलब्ध छन्
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed pt-1">
                  वर्तमानमा यो वेबसाइट मुख्यतया पाठकहरूलाई खबर GPT को आधिकारिक फेसबुक पेज बारे जानकारी दिन समर्पित छ। हामीले हाल यस वेबसाइटमा नियमित समाचार प्रकाशन गरेका छैनौं। हाम्रा सम्पूर्ण आधिकारिक समाचार, ताजा रिपोर्ट र जानकारीमूलक भिडियोहरू केवल आधिकारिक Facebook Page मार्फत सार्वजनिक गरिँदै आएको छ। आधिकारिक पेजमा जोडिन तलको बटन थिच्नुहोस्:
                </p>
              </div>

              {/* Primary Facebook Redirect Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={settings.facebookUrl || 'https://facebook.com/khabargpt'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Facebook className="w-5 h-5 fill-white" />
                  <span>👉 खबर GPT आधिकारिक फेसबुक पेजमा जोडिनुहोस्</span>
                  <ExternalLink className="w-4 h-4 text-blue-200" />
                </a>

                <a
                  href={settings.entryPopupImageUrl || '/official-notice.svg'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                  <span>आधिकारिक सूचना हेर्नुहोस्</span>
                </a>
              </div>

              {/* Direct Official Phone & Support Help */}
              <div className="pt-4 border-t border-slate-200/80 max-w-md mx-auto flex items-center justify-center gap-3 text-xs text-slate-500">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>सम्पर्क / सोधपुछ: <strong>{settings.contactPhone || '+977-9800000000 (Facebook Messenger)'}</strong></span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-bold text-red-600">{item.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {item.type === 'video'
                              ? 'भिडियो'
                              : item.type === 'explainer'
                              ? 'एक्सप्लेनर'
                              : 'समाचार'}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{new Date(item.createdAt).toLocaleDateString('ne-NP')}</span>
                        </div>

                        <h4
                          onClick={() => onSelectArticle(item.slug)}
                          className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors cursor-pointer leading-snug line-clamp-2"
                        >
                          {item.title}
                        </h4>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>

                      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="truncate max-w-[150px] font-medium">
                          {item.sourceName || item.author}
                        </span>
                        <button
                          onClick={() => onSelectArticle(item.slug)}
                          className="text-red-600 font-bold hover:text-red-700 flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span>विस्तृत पढ्नुहोस्</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>

                    {/* Inject In-feed Ad Banner after the 3rd article */}
                    {idx === 2 && inFeedAd && (
                      <div className="col-span-full py-2">
                        <AdBanner ad={inFeedAd} position="in_article" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Facebook Page Redirect Button Below News Articles */}
              <div className="pt-4">
                <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-700/60">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 text-xs text-blue-300 font-bold uppercase tracking-wider">
                      <Facebook className="w-3.5 h-3.5 fill-current" />
                      <span>Khabar GPT फेसबुक हब</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white">
                      थप ताजा समाचार, भिडियो र प्रत्यक्ष अपडेटका लागि हाम्रो फेसबुक पेजमा जोडिनुहोस्
                    </h4>
                    <p className="text-xs text-blue-200">
                      हाम्रो फेसबुक पेजमा नियमित भिडियो सामग्री, फोटो र तत्काल जानकारी उपलब्ध हुन्छन्।
                    </p>
                  </div>
                  <a
                    href={settings.facebookUrl || 'https://facebook.com/khabargpt'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <Facebook className="w-4 h-4 fill-blue-600 text-blue-600" />
                    <span>फेसबुक पेज खोल्नुहोस्</span>
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 5. Video & Reels Showcase */}
        {videoItems.length > 0 && (
          <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-red-400 font-bold uppercase tracking-wider mb-1">
                  <PlayCircle className="w-4 h-4" />
                  <span>भिडियो & Reels हब</span>
                </div>
                <h3 className="text-xl font-bold">खबर GPT सामाजिक सञ्जाल भिडियो सामग्री</h3>
              </div>
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-semibold rounded-lg text-white transition-colors flex items-center gap-1.5"
              >
                <span>सबै Reels फेसबुकमा हेर्नुहोस्</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videoItems.map((vid) => (
                <div
                  key={vid.id}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="text-red-400 font-semibold">{vid.category}</span>
                      <span className="flex items-center gap-1 font-mono tabular-nums">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{vid.views}</span>
                      </span>
                    </div>
                    <h5
                      onClick={() => onSelectArticle(vid.slug)}
                      className="text-sm font-bold text-white hover:text-red-400 cursor-pointer transition-colors line-clamp-2"
                    >
                      {vid.title}
                    </h5>
                    <p className="text-xs text-slate-300 line-clamp-2">{vid.summary}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onSelectArticle(vid.slug)}
                      className="text-slate-300 hover:text-white cursor-pointer"
                    >
                      वेबसाइटमा हेर्नुहोस्
                    </button>
                    {vid.facebookPostUrl && (
                      <a
                        href={vid.facebookPostUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                      >
                        <span>फेसबुकमा खोल्नुहोस्</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Daily/Weekly Newsletter Digest Subscription Card */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700/60">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="w-12 h-12 bg-red-600/30 text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-500/40">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-sans">
              दैनिक / साप्ताहिक सूचना सारांश (Newsletter Digest)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              नेपालका सबैभन्दा महत्त्वपूर्ण घटनाक्रम, तथ्यपरक विश्लेषण र एक्सप्लेनरहरू हप्ताको एकपटक सिधै तपाईंको इमेलमा प्राप्त गर्नुहोस्। कुनै स्प्याम छैन।
            </p>

            {newsletterSubscribed ? (
              <div className="bg-emerald-950/80 border border-emerald-600 text-emerald-200 p-4 rounded-2xl text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>धन्यवाद! तपाईंको सदस्यता सुरक्षित भयो। नयाँ समाचार सारांश तपाईंको इमेलमा पठाइनेछ।</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribeNewsletter} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  required
                  placeholder="तपाईंको इमेल ठेगाना..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="submit"
                  disabled={newsletterLoading}
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{newsletterLoading ? 'दर्ता हुँदै...' : 'सदस्यता लिनुहोस्'}</span>
                </button>
              </form>
            )}
          </div>
        </section>

        {/* 7. Corrections & Transparency Notice Box */}
        {recentCorrections.length > 0 && (
          <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                <h3 className="text-base font-bold text-amber-950">
                  सच्याइ र पारदर्शिता अभिलेख (Corrections Log)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('/corrections')}
                className="text-xs font-semibold text-amber-900 hover:underline cursor-pointer"
              >
                सम्पूर्ण अभिलेख हेर्नुहोस् →
              </button>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              खबर GPT तथ्यमा आधारित जिम्मेवार जानकारी दिन प्रतिबद्ध छ। यदि कुनै सामग्रीमा त्रुटि देखिएमा हामी सुटुक्क नसच्याई यहाँ पारदर्शी रूपमा विवरण खुलाउँछौँ।
            </p>
          </section>
        )}

        {/* 8. Legal Safeguard Card for Nepal */}
        <section className="bg-slate-100 border border-slate-200 rounded-2xl p-6 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Shield className="w-4 h-4 text-slate-700" />
            <span>जिम्मेवारी तथा कानुनी स्पष्टीकरण (Legal Disclaimer)</span>
          </div>
          <p className="leading-relaxed">
            खबर GPT कुनै पनि सरकारी निकाय वा दर्ता भएको सञ्चारमाध्यम होइन। यस पृष्ठमा प्रस्तुत गरिएका सामग्रीहरू सार्वजनिक सरोकारका विषयहरूलाई सरल भाषामा बुझाउन तथा नेपालका कानुनहरूको सम्मान गर्दै तयार पारिएका हुन्।
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-slate-700 font-medium">
            <button
              onClick={() => onNavigate('/editorial-standards')}
              className="hover:text-red-600 cursor-pointer underline"
            >
              सम्पादकीय आचारसंहिता
            </button>
            <button
              onClick={() => onNavigate('/terms')}
              className="hover:text-red-600 cursor-pointer underline"
            >
              प्रतिलिपि अधिकार नीति
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="hover:text-red-600 cursor-pointer underline"
            >
              दाबी तथा सम्पर्क
            </button>
          </div>
        </section>
      </div>

      {/* Full Screen HD Notice Image Lightbox Modal with Zoom Controls */}
      {isNoticeZoomed && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-2 sm:p-4 animate-in fade-in duration-150 select-none"
          onClick={() => setIsNoticeZoomed(false)}
        >
          {/* Top Control Bar */}
          <div
            className="w-full max-w-4xl flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/90 text-white rounded-2xl border border-slate-800 shadow-xl shrink-0 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="font-bold text-xs sm:text-sm truncate">
                {settings.entryPopupTitle || 'आधिकारिक सूचना'} (पूर्ण आकार)
              </span>
            </div>

            {/* Zoom & Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setNoticeZoomLevel((prev) => Math.min(prev + 0.25, 2.5))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                title="जुम बढाउनुहोस् (Zoom In)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setNoticeZoomLevel((prev) => Math.max(prev - 0.25, 0.75))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                title="जुम घटाउनुहोस् (Zoom Out)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setNoticeZoomLevel(1)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                title="रिसेट गर्नुहोस् (Reset)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <a
                href={settings.entryPopupImageUrl || '/official-notice.svg'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="मूल फाइल नयाँ ट्याबमा खोल्नुहोस्"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">नयाँ ट्याब</span>
              </a>
              <button
                type="button"
                onClick={() => setIsNoticeZoomed(false)}
                className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer ml-1"
                aria-label="बन्द गर्नुहोस्"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable / Zoomable Image Canvas */}
          <div
            className="flex-1 w-full max-w-4xl overflow-auto flex items-center justify-center p-2 my-2 cursor-zoom-out"
            onClick={() => setIsNoticeZoomed(false)}
          >
            <img
              src={settings.entryPopupImageUrl || '/official-notice.svg'}
              alt={settings.entryPopupTitle || 'Khabar GPT Notice'}
              style={{
                transform: `scale(${noticeZoomLevel})`,
                transition: 'transform 0.2s ease-out'
              }}
              className="max-h-[82vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Bottom Facebook Help Strip */}
          <div
            className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/90 text-white rounded-2xl border border-slate-800 text-xs shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-slate-300">
              💡 जुम गर्न बटनहरू प्रयोग गर्नुहोस् वा तस्बिरलाई नयाँ ट्याबमा खोल्नुहोस्।
            </span>
            <a
              href={settings.facebookUrl || 'https://facebook.com/khabargpt'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold hover:underline"
            >
              <Facebook className="w-3.5 h-3.5 fill-current" />
              <span>Khabar GPT फेसबुक पेजमा जानुहोस्</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
