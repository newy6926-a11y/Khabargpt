import React, { useState, useEffect } from 'react';
import { KhabarLogo } from './KhabarLogo';
import { NepaliDateClock } from './NepaliDateClock';
import {
  ExternalLink,
  Menu,
  X,
  Zap,
  Calendar,
  MessageCircle,
  Mail,
  Eye,
  Settings,
  Home,
  Newspaper,
  Video,
  Sparkles,
  HelpCircle,
  FileCheck2,
  Handshake,
  PhoneCall,
  Edit3,
  ShieldCheck,
  AlertTriangle,
  Lock,
  FileText,
  Info,
  ChevronRight
} from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  settings?: SiteSettings;
  onOpenNepaliCalendar?: () => void;
  onOpenAccessibility?: () => void;
  onOpenCommunity?: () => void;
  onOpenDailyDigest?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  settings,
  onOpenNepaliCalendar,
  onOpenAccessibility,
  onOpenCommunity,
  onOpenDailyDigest
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const facebookUrl = settings?.facebookUrl || 'https://facebook.com/khabargpt';
  const customLogoUrl = settings?.customLogoUrl || '/logo.png';
  const siteTitle = settings?.siteTitle || 'Khabar GPT';
  const isBreakingActive = Boolean(
    settings?.breakingNewsActive && settings?.breakingNewsText?.trim()
  );

  const handleNavigateAndClose = (path: string) => {
    onNavigate(path);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs w-full">
      {/* 1. Official Safeguard Disclaimer Notice & Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-2.5 sm:px-4 border-b border-slate-800 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4 w-full">
          {/* Left: Live Nepali Date & Time */}
          <div className="flex items-center justify-center gap-2 max-w-full text-center">
            <NepaliDateClock
              compact
              onOpenCalendar={onOpenNepaliCalendar}
            />
          </div>

          {/* Right: Quick Action Links (Daily Digest, Community, Accessibility, Settings) */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-2.5 gap-y-1 text-slate-300 text-[10px] sm:text-[11px] max-w-full">
            {onOpenDailyDigest && (
              <button
                onClick={onOpenDailyDigest}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-semibold text-amber-300 shrink-0"
                title="आजको दैनिक न्यूजलेटर डाइजेस्ट"
              >
                <Mail className="w-3 h-3" />
                <span>दैनिक डाइजेस्ट</span>
              </button>
            )}

            <span className="text-slate-700 hidden xs:inline">|</span>

            {onOpenCommunity && (
              <button
                onClick={onOpenCommunity}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-semibold text-emerald-400 shrink-0"
                title="WhatsApp & Viber च्यानलमा जोडिनुहोस्"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp / Viber</span>
              </button>
            )}

            <span className="text-slate-700 hidden xs:inline">|</span>

            {onOpenAccessibility && (
              <button
                onClick={onOpenAccessibility}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-slate-300 shrink-0"
                title="पहुँचयोग्यता सेटिङ (Alt+A)"
              >
                <Eye className="w-3 h-3 text-blue-400" />
                <span>पहुँचयोग्यता</span>
              </button>
            )}

            <span className="text-slate-700 hidden xs:inline">|</span>

            <button
              onClick={() => onNavigate('/settings')}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-slate-300 shrink-0"
              title="व्यक्तिगत सेटिङ"
            >
              <Settings className="w-3 h-3 text-slate-400" />
              <span>सेटिङ</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Live Breaking News Ticker (if enabled by admin) */}
      {isBreakingActive && (
        <div className="bg-red-600 text-white text-xs py-1.5 px-3 sm:px-4 overflow-hidden shadow-xs w-full">
          <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3 w-full">
            <span className="inline-flex items-center gap-1 bg-white text-red-700 font-extrabold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-sm shrink-0">
              <Zap className="w-3 h-3 fill-red-600" />
              ताजा अपडेट
            </span>
            <span className="truncate font-medium text-xs text-red-50 min-w-0">
              {settings?.breakingNewsText}
            </span>
          </div>
        </div>
      )}

      {/* 3. Main Header Bar (Clean, Uncluttered: Logo on Left, Social & 3-line Menu on Right) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3 w-full">
        {/* Zone 1: Dynamic Brand Logo & Wordmark */}
        <button
          onClick={() => {
            onNavigate('/');
            setMenuOpen(false);
          }}
          className="flex items-center text-left hover:opacity-90 transition-opacity min-w-0 cursor-pointer"
          aria-label={`${siteTitle} Home`}
        >
          <KhabarLogo size="md" customUrl={customLogoUrl} title={siteTitle} />
        </button>

        {/* Zone 2: Primary Actions + 3-Line Menu Button (Visible across all screens) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* YouTube quick icon */}
          {settings?.youtubeUrl && (
            <a
              href={settings.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white items-center justify-center transition-colors"
              title="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          )}

          {/* TikTok quick icon */}
          {settings?.tiktokUrl && (
            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex w-8 h-8 rounded-lg bg-slate-100 text-slate-800 hover:bg-black hover:text-white items-center justify-center transition-colors"
              title="TikTok"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.54c-.03 2.05-.8 4.11-2.28 5.57-1.57 1.56-3.79 2.37-6.03 2.19-2.08-.14-4.08-1.12-5.4-2.73-1.44-1.74-1.99-4.08-1.54-6.3.45-2.26 2.03-4.19 4.13-5.06 1.14-.48 2.39-.67 3.63-.58v4.14c-.69-.13-1.42-.09-2.08.15-.75.27-1.38.86-1.67 1.61-.31.78-.26 1.68.14 2.41.42.75 1.19 1.25 2.04 1.34 1.07.13 2.19-.34 2.79-1.22.45-.66.57-1.48.56-2.28V.02z"/>
              </svg>
            </a>
          )}

          {/* Primary Facebook Page Button */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            title="Follow Khabar GPT on Facebook"
          >
            <span>फेसबुक</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Quick Contact & Inquiry Button on Desktop */}
          <button
            onClick={() => handleNavigateAndClose('/contact')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="सम्पर्क तथा सोधपुछ"
          >
            <PhoneCall className="w-3.5 h-3.5 text-red-600" />
            <span>सम्पर्क</span>
          </button>

          {/* Primary 3-Line Menu Button (Accessible on all screens) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer shrink-0 shadow-xs active:scale-98"
            aria-label={menuOpen ? 'मेनु बन्द गर्नुहोस्' : 'मुख्य मेनु खोल्नुहोस्'}
            title="मुख्य मेनु (Menu)"
          >
            {menuOpen ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            ) : (
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
            <span className="text-xs sm:text-sm font-bold tracking-tight">मेनु</span>
          </button>
        </div>
      </div>

      {/* Slide-out Three-Line Full Drawer Menu & Backdrop */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
          {/* Dimmed backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer container (slides from right) */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <aside
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full overflow-hidden border-l border-slate-200"
              role="dialog"
              aria-modal="true"
              aria-label="मुख्य नेभिगेसन मेनु"
            >
              {/* Drawer Top Header */}
              <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <KhabarLogo size="sm" customUrl={customLogoUrl} title={siteTitle} />
                  <div>
                    <h2 className="text-sm font-bold text-white leading-tight">खबर GPT मेनु</h2>
                    <p className="text-[10px] text-slate-400">स्वतन्त्र डिजिटल सूचना पोर्टल</p>
                  </div>
                </div>

                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                  aria-label="मेनु बन्द गर्नुहोस्"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                {/* 1. Priority Section: Contact, Inquiry & Correction (Explicitly requested) */}
                <div className="bg-red-50/70 border border-red-200/80 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                      सम्पर्क, सोधपुछ तथा सुधार
                    </span>
                    <span className="text-[10px] font-semibold bg-red-600 text-white px-2 py-0.5 rounded-full">
                      प्रत्यक्ष पहुँच
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {/* Contact & Inquiries */}
                    <button
                      onClick={() => handleNavigateAndClose('/contact')}
                      className={`w-full p-2.5 rounded-xl text-left transition-all border flex items-center justify-between cursor-pointer ${
                        currentPath === '/contact'
                          ? 'bg-red-600 text-white border-red-700 shadow-xs'
                          : 'bg-white text-slate-800 border-red-100 hover:border-red-300 hover:bg-red-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <PhoneCall className={`w-4 h-4 ${currentPath === '/contact' ? 'text-white' : 'text-red-600'}`} />
                        <div>
                          <div className="text-xs font-bold">सम्पर्क तथा सोधपुछ</div>
                          <div className={`text-[10px] ${currentPath === '/contact' ? 'text-red-100' : 'text-slate-500'}`}>
                            सोधपुछ वा सुझाव पठाउनुहोस्
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>

                    {/* Inquiry Correction & Fact Updates */}
                    <button
                      onClick={() => handleNavigateAndClose('/corrections')}
                      className={`w-full p-2.5 rounded-xl text-left transition-all border flex items-center justify-between cursor-pointer ${
                        currentPath === '/corrections'
                          ? 'bg-red-600 text-white border-red-700 shadow-xs'
                          : 'bg-white text-slate-800 border-red-100 hover:border-red-300 hover:bg-red-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Edit3 className={`w-4 h-4 ${currentPath === '/corrections' ? 'text-white' : 'text-amber-600'}`} />
                        <div>
                          <div className="text-xs font-bold">त्रुटि सच्याइ (Correction)</div>
                          <div className={`text-[10px] ${currentPath === '/corrections' ? 'text-red-100' : 'text-slate-500'}`}>
                            तथ्य त्रुटि सच्याउन अनुरोध
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  </div>
                </div>

                {/* 2. Main Navigation Sections */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    प्रमुख पृष्ठहरू
                  </h3>
                  <div className="space-y-1">
                    {[
                      { label: 'गृहपृष्ठ (Home)', path: '/', icon: Home },
                      { label: 'ताजा खबर (Latest News)', path: '/news', icon: Newspaper },
                      { label: 'एक्सप्लेनर (Explainers)', path: '/explainers', icon: Sparkles },
                      { label: 'भिडियोहरू (Videos)', path: '/videos', icon: Video },
                      { label: 'हाम्रो बारेमा (About Us)', path: '/about', icon: Info }
                    ].map((item) => {
                      const isActive = item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path);
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNavigateAndClose(item.path)}
                          className={`w-full px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                            <span>{item.label}</span>
                          </div>
                          {isActive && (
                            <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-md">
                              सक्रिय
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Interactive Hub & Creation Tools */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    अन्तरक्रियात्मक टुल्स तथा सहकार्य
                  </h3>
                  <div className="space-y-1">
                    {[
                      { label: 'पोस्टर स्टुडियो (Poster Studio)', path: '/poster-studio', icon: Sparkles, desc: 'आकर्षक खबर पोस्टर बनाउनुहोस्' },
                      { label: 'ज्ञान क्विज (Knowledge Quiz)', path: '/quiz', icon: HelpCircle, desc: 'आफ्नो ज्ञान र चेतना जाँच्नुहोस्' },
                      { label: 'व्यक्तिगत सेटिङ (Settings)', path: '/settings', icon: Settings, desc: 'डिस्प्ले, फन्ट तथा प्राथमिकताहरू' },
                      { label: 'तथ्य जाँच गाइड (Fact-Check Guide)', path: '/verify-information', icon: FileCheck2, desc: 'सूचना कसरी भेरिफाई गर्ने?' },
                      { label: 'सहकार्य तथा मिडिया किट (Collaborate)', path: '/collaborate', icon: Handshake, desc: 'सहकार्य, विज्ञापन तथा तथ्याङ्क' }
                    ].map((item) => {
                      const isActive = currentPath.startsWith(item.path);
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNavigateAndClose(item.path)}
                          className={`w-full px-3.5 py-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                            isActive
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-slate-500'}`} />
                            <div>
                              <div className="text-sm font-semibold">{item.label}</div>
                              <div className="text-[11px] text-slate-400 font-normal">{item.desc}</div>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Policies, Editorial Standards & Legal */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    नीतिहरू, मापदण्ड तथा कानुनी सूचना
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'सम्पादकीय मापदण्ड', path: '/editorial-standards', icon: ShieldCheck },
                      { label: 'सामग्री डिस्क्लेमर', path: '/content-disclaimer', icon: AlertTriangle },
                      { label: 'गोपनीयता नीति', path: '/privacy', icon: Lock },
                      { label: 'नियम तथा सर्तहरू', path: '/terms', icon: FileText }
                    ].map((item) => {
                      const isActive = currentPath === item.path;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNavigateAndClose(item.path)}
                          className={`p-2.5 rounded-xl text-left transition-all border flex items-center gap-2 cursor-pointer ${
                            isActive
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          <span className="text-xs font-medium truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Utility Services */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    दैनिक सेवाहरू तथा सुविधाहरू
                  </h3>
                  <div className="space-y-2">
                    {onOpenDailyDigest && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenDailyDigest();
                        }}
                        className="w-full p-2.5 bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-amber-600" />
                          <span>दैनिक डाइजेस्ट (Daily Newsletter)</span>
                        </div>
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-semibold">खोल्नुहोस्</span>
                      </button>
                    )}

                    {onOpenCommunity && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenCommunity();
                        }}
                        className="w-full p-2.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-emerald-600" />
                          <span>WhatsApp & Viber समुदायमा जोडिनुहोस्</span>
                        </div>
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md font-semibold">जोडिनुहोस्</span>
                      </button>
                    )}

                    {onOpenNepaliCalendar && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenNepaliCalendar();
                        }}
                        className="w-full p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-red-600" />
                          <span>विक्रम संवत् क्यालेन्डर तथा मिति</span>
                        </div>
                        <span className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded-md font-semibold border border-slate-200">पात्रो</span>
                      </button>
                    )}

                    {onOpenAccessibility && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenAccessibility();
                        }}
                        className="w-full p-2.5 bg-blue-50 hover:bg-blue-100/80 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span>पहुँचयोग्यता सेटिङ (Accessibility Toolbar)</span>
                        </div>
                        <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-md font-semibold">Alt+A</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 6. Social Media & External Channels */}
                <div className="pt-2 border-t border-slate-200">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    सामाजिक सञ्जालमा खबर GPT
                  </h3>
                  <div className="flex flex-col gap-2">
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span>आधिकारिक फेसबुक पेज फलो गर्नुहोस्</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {settings?.youtubeUrl && (
                      <a
                        href={settings.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          <span>YouTube च्यानल सब्स्क्राइब गर्नुहोस्</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Footer Notice */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 text-center shrink-0">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  खबर GPT एक स्वतन्त्र सूचना र सञ्चार प्लेटफर्म हो।
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  © {new Date().getFullYear()} {siteTitle}. सर्वाधिकार सुरक्षित।
                </p>
              </div>
            </aside>
          </div>
        </div>
      )}
    </header>
  );
};
