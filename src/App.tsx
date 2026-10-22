import React, { useState, useEffect } from 'react';
import { ContentItem, Category, CorrectionItem, SiteSettings, AuthUser, AdItem, LiveEvent } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SavedArticlesDrawer } from './components/SavedArticlesDrawer';
import { AdBanner } from './components/AdBanner';
import { offlineStorage } from './utils/offlineStorage';
import { Bookmark, WifiOff, Eye, Mail, MessageCircle, Calendar, Wrench } from 'lucide-react';
import { NepaliCalendarModal } from './components/NepaliCalendarModal';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { CommunityBroadcastModal } from './components/CommunityBroadcastModal';
import { DailyDigestModal } from './components/DailyDigestModal';
import { WelcomeNoticeModal } from './components/WelcomeNoticeModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { NewsListingPage } from './pages/NewsListingPage';
import { VideosPage } from './pages/VideosPage';
import { AboutPage } from './pages/AboutPage';
import { EditorialStandardsPage } from './pages/EditorialStandardsPage';
import { CorrectionsPage } from './pages/CorrectionsPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsCopyrightPage } from './pages/TermsCopyrightPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminPortal } from './pages/AdminPortal';
import { LiveEventDetailPage } from './pages/LiveEventDetailPage';
import { updateDocumentSEO } from './utils/seo';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Core Data States
  const [content, setContent] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [corrections, setCorrections] = useState<CorrectionItem[]>([]);
  const [headerAd, setHeaderAd] = useState<AdItem | null>(null);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [savedArticlesCount, setSavedArticlesCount] = useState(0);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: 'Khabar GPT (खबर GPT)',
    siteSubtitle: 'नेपालका समसामयिक विषय र सार्वजनिक सरोकारका जानकारी',
    introTextNp: 'खबर GPT नेपालका समसामयिक विषय, सार्वजनिक सरोकारका जानकारी र जटिल विषयलाई सरल भाषामा बुझाउने सूचना पृष्ठ हो। हाम्रो उद्देश्य तथ्यमा आधारित, उपयोगी र जिम्मेवार जानकारी प्रस्तुत गर्नु हो।',
    facebookUrl: 'https://facebook.com/khabargpt',
    contactEmail: '',
    contactPhone: '',
    address: 'काठमाडौँ, नेपाल',
    customLogoUrl: '/logo.png',
    bannerNotice: 'सूचना: खबर GPT स्वतन्त्र सूचना पृष्ठ हो। यो दर्ता भएको समाचार संस्था वा प्रेस होइन।',
    bannerNoticeActive: true,
    articlePublishingEnabled: true,
    disallowSearchIndexing: false,
    adminSecretSlug: 'kg-admin-secure',
    breakingNewsText: '',
    breakingNewsActive: false,
    footerText: '© २०२६ खबर GPT. सर्वाधिकार सुरक्षित। नेपालका कानुनहरूको सम्मान गर्दै जिम्मेवार सूचना प्रस्तुति।',
    seoKeywords: 'Khabar GPT, Nepal, Facebook Khabar GPT',
    entryPopupActive: true,
    entryPopupShowAlways: true,
    entryPopupTitle: 'आधिकारिक सूचना (Official Notice)',
    entryPopupMessage: '',
    entryPopupImageUrl: '/official-notice.svg',
    entryPopupButtonText: 'फेसबुक पेजमा जोडिनुहोस्',
    entryPopupButtonLink: 'https://facebook.com/khabargpt'
  });
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial saved articles count
    setSavedArticlesCount(offlineStorage.getSavedArticles().length);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global feature modal states
  const [nepaliCalendarOpen, setNepaliCalendarOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [dailyDigestOpen, setDailyDigestOpen] = useState(false);

  // Keyboard shortcut: Alt + A for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setAccessibilityOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    setSelectedSlug(null);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (slugOrId: string) => {
    setSelectedSlug(slugOrId);
    setCurrentPath(`/article/${slugOrId}`);
    window.history.pushState({}, '', `/article/${slugOrId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial load
  useEffect(() => {
    loadData();
    checkCurrentUser();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [c, cats, cors, sets, ads] = await Promise.all([
        api.getContent().catch(() => []),
        api.getCategories().catch(() => []),
        api.getCorrections().catch(() => []),
        api.getSettings().catch(() => null),
        api.getAds('header_top').catch(() => [])
      ]);
      setContent(c);
      setCategories(cats);
      setCorrections(cors);
      if (sets) setSettings(sets);
      if (ads && ads.length > 0) setHeaderAd(ads[0]);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentUser = async () => {
    try {
      const loggedUser = await api.verifyAuth();
      setUser(loggedUser);
    } catch {
      setUser(null);
    }
  };

  // Resolve Article Detail if viewing an article
  const currentArticle =
    selectedSlug || currentPath.startsWith('/article/')
      ? content.find(
          (c) =>
            c.slug === (selectedSlug || currentPath.replace('/article/', '')) ||
            c.id === (selectedSlug || currentPath.replace('/article/', ''))
        )
      : null;

  // Resolve Live Event Slug if viewing live event
  const liveSlug = currentPath.startsWith('/live/')
    ? currentPath.replace('/live/', '')
    : currentPath === '/live'
    ? 'chunab-2084-live'
    : null;

  // Dynamic SEO metadata synchronization
  useEffect(() => {
    updateDocumentSEO(settings, currentArticle, currentPath);
  }, [settings, currentArticle, currentPath]);

  // Check if current route is the secret admin safe link
  const secretSlug = (settings.adminSecretSlug || 'kg-admin-secure').replace(/^\//, '');
  const isSecretAdminRoute =
    currentPath === `/${secretSlug}` ||
    currentPath === '/kg-admin-secure' ||
    (typeof window !== 'undefined' &&
      (window.location.search.includes('admin_access=khabar') ||
        window.location.search.includes('secret_access=kg')));

  // Maintenance Mode Interceptor
  if (settings.maintenanceModeActive && !isSecretAdminRoute) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white text-center font-sans">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Wrench className="w-8 h-8 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-widest text-amber-400 font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              प्राविधिक मर्मत सम्भार (Maintenance)
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              वेबसाइट हाल मर्मत सम्भारमा छ
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
              {settings.maintenanceModeMessage ||
                'हाम्रो प्रणालीलाई अझ प्रभावकारी र सुरक्षित बनाउन नियमित प्राविधिक मर्मत भइरहेको छ। केही समयमै सेवा पुन: सञ्चालनमा आउनेछ।'}
            </p>
          </div>

          {settings.maintenanceEstimatedTime && (
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs text-slate-300">
              <span className="text-slate-400">अनुमानित समय: </span>
              <span className="font-bold text-amber-300">{settings.maintenanceEstimatedTime}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 space-y-3">
            <a
              href={settings.facebookUrl || 'https://facebook.com/khabargpt'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition"
            >
              <span>👉 ताजा भिडियो तथा अपडेटका लागि फेसबुक पेजमा जानुहोस्</span>
            </a>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition underline cursor-pointer"
              >
                🔑 व्यवस्थापक लगइन (Admin Access)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Offline Status Warning Bar */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs px-4 py-2 font-medium flex items-center justify-between shadow-xs sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
            <span>इन्टरनेट विच्छेद भएको छ। तपाईं अफलाइन मोडमा हुनुहुन्छ। पहिले सेभ गरिएका लेखहरू पढ्न सकिन्छ।</span>
          </div>
          <button
            onClick={() => setSavedDrawerOpen(true)}
            className="underline font-bold text-amber-100 hover:text-white cursor-pointer ml-2"
          >
            सेभ गरिएका लेख खोल्नुहोस्
          </button>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        settings={settings}
        onOpenNepaliCalendar={() => setNepaliCalendarOpen(true)}
        onOpenAccessibility={() => setAccessibilityOpen(true)}
        onOpenCommunity={() => setCommunityOpen(true)}
        onOpenDailyDigest={() => setDailyDigestOpen(true)}
      />

      {/* Header Ad Slot (if configured) */}
      {!isSecretAdminRoute && headerAd && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
          <AdBanner ad={headerAd} position="header_top" />
        </div>
      )}

      {/* Floating Offline Articles Button */}
      <button
        onClick={() => {
          setSavedArticlesCount(offlineStorage.getSavedArticles().length);
          setSavedDrawerOpen(true);
        }}
        title="अफलाइन सेभ गरिएका लेखहरू"
        className="fixed bottom-20 right-4 z-40 bg-slate-900 text-white p-3 rounded-full shadow-xl hover:bg-slate-800 transition-transform active:scale-95 flex items-center gap-2 border border-slate-700/60 cursor-pointer"
      >
        <Bookmark className="w-5 h-5 text-amber-400" />
        {savedArticlesCount > 0 && (
          <span className="bg-red-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
            {savedArticlesCount}
          </span>
        )}
      </button>

      {/* Saved Articles Drawer */}
      <SavedArticlesDrawer
        isOpen={savedDrawerOpen}
        onClose={() => setSavedDrawerOpen(false)}
        onSelectArticle={(slugOrId) => {
          setSavedDrawerOpen(false);
          handleSelectArticle(slugOrId);
        }}
      />

      {/* Main Content View Container */}
      <main className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
            <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-500 font-medium">खबर GPT लोड हुँदैछ...</span>
          </div>
        ) : liveSlug ? (
          <LiveEventDetailPage
            eventIdOrSlug={liveSlug}
            onBack={() => navigate('/')}
          />
        ) : currentPath.startsWith('/article/') && currentArticle ? (
          <ArticleDetailPage
            item={currentArticle}
            relatedItems={content.filter((c) => c.id !== currentArticle.id && c.category === currentArticle.category)}
            onBack={() => navigate('/')}
            onSelectArticle={handleSelectArticle}
            onNavigate={navigate}
          />
        ) : currentPath === '/' ? (
          <HomePage
            content={content}
            categories={categories}
            corrections={corrections}
            settings={settings}
            onNavigate={navigate}
            onSelectArticle={handleSelectArticle}
          />
        ) : currentPath === '/news' ? (
          <NewsListingPage
            content={content}
            categories={categories}
            onSelectArticle={handleSelectArticle}
          />
        ) : currentPath === '/explainers' ? (
          <NewsListingPage
            content={content.filter((c) => c.type === 'explainer')}
            categories={categories}
            onSelectArticle={handleSelectArticle}
          />
        ) : currentPath === '/videos' ? (
          <VideosPage
            content={content}
            facebookUrl={settings.facebookUrl}
            onSelectArticle={handleSelectArticle}
          />
        ) : currentPath === '/about' ? (
          <AboutPage settings={settings} onNavigate={navigate} />
        ) : currentPath === '/editorial-standards' ? (
          <EditorialStandardsPage />
        ) : currentPath === '/corrections' ? (
          <CorrectionsPage
            corrections={corrections}
            onSelectArticle={handleSelectArticle}
            onNavigate={navigate}
          />
        ) : currentPath === '/contact' ? (
          <ContactPage settings={settings} />
        ) : currentPath === '/privacy' ? (
          <PrivacyPolicyPage />
        ) : currentPath === '/terms' ? (
          <TermsCopyrightPage />
        ) : isSecretAdminRoute ? (
          <AdminPortal
            user={user}
            settings={settings}
            onSettingsUpdate={(updated) => setSettings(updated)}
            onNavigateHome={() => navigate('/')}
            onAuthChange={checkCurrentUser}
          />
        ) : (
          <NotFoundPage onNavigate={navigate} />
        )}
      </main>

      {/* Editorial Footer */}
      <Footer onNavigate={navigate} settings={settings} />

      {/* Android-first Mobile Bottom Navigation Bar */}
      <MobileBottomNav currentPath={currentPath} onNavigate={navigate} />

      {/* Nepali Calendar & Panchanga Modal */}
      <NepaliCalendarModal
        isOpen={nepaliCalendarOpen}
        onClose={() => setNepaliCalendarOpen(false)}
      />

      {/* Universal Accessibility & Voice Reader Modal */}
      <AccessibilityToolbar
        isOpen={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
      />

      {/* WhatsApp & Viber Broadcast Community Modal */}
      <CommunityBroadcastModal
        isOpen={communityOpen}
        onClose={() => setCommunityOpen(false)}
        settings={settings}
      />

      {/* Daily Newsletter Digest Modal */}
      <DailyDigestModal
        isOpen={dailyDigestOpen}
        onClose={() => setDailyDigestOpen(false)}
        content={content}
        onSelectArticle={handleSelectArticle}
      />

      {/* Entry Welcome / Special Notice Popup (Controlled via Admin) */}
      <WelcomeNoticeModal settings={settings} onNavigate={navigate} />
    </div>
  );
}
